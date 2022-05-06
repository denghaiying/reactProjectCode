import EpsFormType from '@/eps/commons/EpsFormType';
import {
  Button,
  Form,
  Modal,
  Select,
  Input,
  Checkbox,
  Dropdown,
  Menu,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsReportStore from '@/eps/components/buttons/EpsReportButton/store/EpsReportStore';
import { observer, useLocalObservable } from 'mobx-react';
import ExportReportFile from '@/eps/components/buttons/EpsReportButton/ExportReportFile';
import ImportReportFile from '@/eps/components/buttons/EpsReportButton/ImportReportFile';
import Design from '@/eps/components/buttons/EpsReportButton/Design';
import EpsReportService from '@/eps/components/buttons/EpsReportButton/store/EpsReportService';
import { PrinterOutlined } from '@ant-design/icons';
import './index.less';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import axios from 'axios';
import fetch from '@/utils/fetch';
import cookie from 'react-cookies';

interface IProp {
  store: EpsTableStore;
  umid: string;
  ids: any[];
}

const EpsReportButton = observer((props: IProp) => {
  console.log('IpropEpsreportbutton====', props);
  const ref = useRef();

  const [initKey, setInitKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [modalWidth, SetModalWidth] = useState(1200);
  const [defaultChecked, SetDefaultChecked] = useState(false);
  const [publicChecked, SetPublicChecked] = useState(false);
  const [store] = useState(props.store);
  const [prinstvisible, setPrintVisible] = useState(false);
  const [modalHeight, setModalHeight] = useState(0);
  const [ids, setIds] = useState({});

  const { Option } = Select;
  //  const [form]= Form.useForm();

  /*const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            EpsReportStore.setSelectId(selectedRowKeys);
            EpsReportStore.setSelectedRow(selectedRows[0]);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };*/

  /**
   * 获取当前用户名称
   */
  const yhmc = SysStore.getCurrentUser().yhmc;

  /**
   * 获取当前用户ID
   */
  const yhid = SysStore.getCurrentUser().id;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const [umid, setUmid] = useState({});
  const [bsreporturl, setBsreporturl] = useState({});
  const [menuDatas, setMenuDatas] = useState([]);

  const EpsPrintStore = useLocalObservable(() => ({
    menuData: [],
    epsReportEntity: {},
    printUrl: '',
    param: {},
    fileData: '',
    onlineReport: '',
    lxReport: '',
    GnregSyncReport: [],
    menu: [],

    async findMenuData(umid) {
      const responselb = await fetch.post(
        `${this.url}/queryForList?umid=` + umid,
      );
      if (responselb && responselb.status === 200) {
        this.menu = responselb.data;
      } else {
        return;
      }
    },

    async getGnregSyncOnlineReport() {
      const response = await fetch.get(
        `/api/eps/control/main/getGnsReg?gnids=EPSREPORT001`,
      );
      if (response.status === 200) {
        if (response.data) {
          this.onlineReport = response.data.EPSREPORT001;
        }
      }
    },

    async getGnregSyncLxReport() {
      const response = await fetch.get(
        `/api/eps/control/main/getGnsReg?gnids=EPSREPORT002`,
      );
      if (response.status === 200) {
        if (response.data) {
          this.lxReport = response.data.EPSREPORT002;
        }
        console.log('lxReport', this.lxReport);
      }
    },

    async getGnregSyncReport() {
      let online = false;
      const response = await fetch.get(
        `/api/eps/control/main/getGnsReg?gnids=EPSREPORT001`,
      );
      if (response.status === 200) {
        if (response.data) {
          online = response.data.EPSREPORT001;
        }
      }
      let lx = false;
      const response1 = await fetch.get(
        `/api/eps/control/main/getGnsReg?gnids=EPSREPORT002`,
      );
      if (response1.status === 200) {
        if (response1.data) {
          lx = response1.data.EPSREPORT002;
        }
      }

      if (online === true && lx === false) {
        this.GnregSyncReport.push(<Option value="1">在线设计</Option>);
        this.GnregSyncReport.push(<Option value="2">插件设计</Option>);

        //    datadd="[{ value: '1', label: '在线设计'},{value: '2', label: '插件设计'}]";
      } else if (lx === true && online === false) {
        this.GnregSyncReport.push(<Option value="2">插件设计</Option>);
        this.GnregSyncReport.push(<Option value="3">离线设计</Option>);
        //   datadd="[{value: '2', label: '插件设计'},{value: '3', label: '离线设计'}]";
      } else if (lx === true && online === true) {
        this.GnregSyncReport.push(<Option value="1">在线设计</Option>);
        this.GnregSyncReport.push(<Option value="2">插件设计</Option>);
        this.GnregSyncReport.push(<Option value="3">离线设计</Option>);
        //    datadd="[{ value: '1', label: '在线设计'},{value: '2', label: '插件设计'},{value: '3', label: '离线设计'}]";
      } else {
        this.GnregSyncReport.push(<Option value="2">插件设计</Option>);
      }
    },

    existsReportPlugin() {
      return true;
    },

    async queryForId(id) {
      if (id != '') {
        const response = await fetch.post(
          `/api/eps/control/main/epsreport/queryForId?id=` + id,
        );
        if (response && response.status === 200) {
          this.epsReportEntity = response.data;
        } else {
          this.loading = true;
        }
      }
    },

    async reportPrint(reportinfo) {
      const sjData = props.store.selectedRowKeys;
      let ids = sjData.toString();
      // if (props.ids) {
      //  for (var i = 0; i < sjData.length; i++) {
      //    ids +=","+sjData[i].id;
      //    }
      //   ids.substring(1);

      if (reportinfo.designType === '1') {
        const pm = {
          ids: ids,
        };
        const bmc = props.store.params.bmc;
        const tmzt = props.store.params.tmzt;
        const param =
          reportinfo.reportid +
          '?bmc=' +
          bmc +
          '&tmzt=' +
          tmzt +
          '&yhid=' +
          SysStore.getCurrentUser().id +
          '&ssotoken=' +
          cookie.load('ssotoken') +
          '&epsParam=' +
          encodeURIComponent(JSON.stringify(pm));
        // const ipvaule = this.getParamDev("REPORT0001", "");
        // const pathvaule = this.getParamDev("REPORT0012", "");

        const ipvaule = await fetch.post(
          '/api/eps/control/main/params/getParamsDevOption',
          this.params,
          {
            params: {
              code: 'REPORT0001',
              gnid: '',
              yhid: SysStore.getCurrentUser().id,
              ...this.params,
            },
          },
        );
        const pathvaule = await fetch.post(
          '/api/eps/control/main/params/getParamsDevOption',
          this.params,
          {
            params: {
              code: 'REPORT0012',
              gnid: '',
              yhid: SysStore.getCurrentUser().id,
              ...this.params,
            },
          },
        );

        this.printUrl =
          'http://' + ipvaule.data + pathvaule.data + '/view/' + param;

        // window.open(url);
      } else if (reportinfo.designType === '3') {
        const pp = store.params;
        //  pp['ids']= ids;
        if (ids !== '') {
          pp.ids = ids;
        }
        const response = await fetch.post(
          `/api/eps/control/main/epsreport/queryReportData`,
          this.params,
          {
            params: {
              id: reportinfo.id,
              storeParams: pp,
              ...this.params,
            },
          },
        );
        if (response && response.status === 200) {
          let data1 = response.data.results;
          this.param = data1;
          let reportName1 = data1.reportName;
          this.param['data'] = data1.data;
          this.param['paramter'] = data1.paramter;

          const jasperPathVaule = await fetch.post(
            '/api/eps/control/main/params/getParamsDevOption',
            this.params,
            {
              params: {
                code: 'REPORT0002',
                gnid: '',
                yhid: SysStore.getCurrentUser().id,
                ...this.params,
              },
            },
          );

          if (!jasperPathVaule) {
            return;
          }

          axios({
            // 用axios发送post请求
            method: 'post',
            url:
              'http://' +
              jasperPathVaule.data +
              '/offline/report/apiMap/print/' +
              reportName1, // 请求地址
            data: this.param, // 参数
            //    responseType: 'blob' // 表明返回服务器返回的数据类型
          })
            .then((response) => {
              if (response.status === 200) {
                this.fileData = response.data;
                //      this.printshow=true;
                const pdfurl = encodeURIComponent(
                  '/api/eps/offline/report/loadpdf?file=' + this.fileData,
                );
                this.printUrl =
                  '/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' +
                  pdfurl +
                  '&printfile=1&downfile=1?ran=' +
                  Math.random();
                //                      window.open('/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' + pdfurl + "&printfile=1&downfile=1");
              } else {
                return false;
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          this.loading = true;
        }
      }
    },

    async doPrintOrPreview(opt, repid) {
      if (!repid) {
        return;
      }
      if (!this.existsReportPlugin()) {
        return;
      }
      const qurl = '/api/eps/control/main/epsreport';
      if (1 == 1) {
        this.queryForId(repid).then(() => {
          let reportinfo = this.epsReportEntity;
          if (reportinfo.designType != '2') {
            this.reportPrint(reportinfo);
          } else {
            let names = this.allData.reportDataSetNames;
            // console.log(this.allData);
            if (names && names.length > 0) {
              let pms = {};
              let tknifo = 'token=' + Eps.getCookie('token');
              if (opt == 'design') {
                pms['opt'] = '0';
              } else if (opt == 'print') {
                pms['opt'] = '2';
              } else {
                pms['opt'] = '1';
              }
              pms['id'] = repid;
              pms['queryUrl'] = qurl + '/queryForId?' + tknifo;
              let datainfo = [];
              for (let i = 0; i < names.length; i++) {
                let di = {};
                di['name'] = names[i];
                if (names[i] == 'GRID') {
                  di['fields'] = JSON.stringify(
                    this.getReportDBFields(this.allData.fields),
                  ).replace(/\u005C\u005C/g, '\u005C');
                }
                if (names[i] == 'GRID_MASTER') {
                  di['fields'] = JSON.stringify(
                    this.getReportDBFields(this.allData.fields),
                  ).replace(/\u005C\u005C/g, '\u005C');
                }
                if (names[i] == 'GRID_SLAVE') {
                  di['fields'] = JSON.stringify(
                    this.getReportDBFields(this.allData.datilfields),
                  ).replace(/\u005C\u005C/g, '\u005C');
                }
                //di["indexfieldnames"]="";
                //di["masterdataname"]="";
                //di["masterfields"]="";
                let rdi = this.doGetReportDataInfo(names[i]);
                for (let key in rdi) {
                  di[key] = rdi[key];
                }
                datainfo.push(di);
              }
              pms['datainfo'] = JSON.stringify(datainfo);
              pms['saveurl'] = qurl + '/updatexml?' + tknifo;
              pms['rsqlparams'] = JSON.stringify(this.doGetReportSqlParams());
              pms['rsqlurl'] = qurl + '/runsql?' + tknifo;
              pms['queryparams'] = JSON.stringify(
                this.getJsonQueryParams({}),
              ).replace(/\u005C\u005C/g, '\u005C');

              let vd = base64encode(utf16to8(JSON.stringify(pms)));
              let url = qurl + '/genVReport';
              const fd = new FormData();
              fd.append('data', vd);
              fetch
                .post(url, fd, {
                  headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                  },
                })
                .then((response) => {
                  if (response.status === 200) {
                    let url = 'epssoft:@EpsReport@?';
                    url +=
                      'id=' +
                      response.data +
                      '&url=' +
                      qurl +
                      '/queryVReport?' +
                      tknifo;
                    window.location.href = url;
                  }
                });
            }
          }
        });
      }
    },
  }));

  useEffect(() => {
    setModalHeight(window.innerHeight - 300);

    EpsPrintStore.getGnregSyncReport();
  }, []);

  const tableProp: ITable = {
    tableSearch: false,
  };

  const source: EpsSource[] = [
    {
      title: '报表名称',
      code: 'name',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '报表设计类型',
      code: 'designType',
      align: 'center',
      width: 80,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text) {
          if (text === '1') {
            return (text = '在线报表');
          } else if (text === '2') {
            return (text = '插件报表');
          } else if (text === '3') {
            return (text = '离线报表');
          }
        } else {
          return (text = '未知');
        }
      },
    },
    {
      title: '缺省',
      code: 'isdefault',
      align: 'center',
      width: 60,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text) {
          return text == 'N' ? '否' : '是';
        } else {
          return (text = '未知');
        }
      },
    },
    {
      title: '是否设计',
      code: 'isDesign',
      align: 'center',
      width: 80,
      formType: EpsFormType.Input,
    },

    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      width: 80,
      formType: EpsFormType.Input,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
  ];
  const title = {
    name: '报表',
  };

  function onChangeDefault(e) {
    console.log(`checked = ${e.target.checked}`);
    SetDefaultChecked(e.target.checked);
  }

  function onChangePublic(e) {
    console.log(`checked = ${e.target.checked}`);
    SetPublicChecked(e.target.checked);
  }

  useEffect(() => {
    setUmid({ umid: props.umid });
    EpsReportStore.findMenu(props.umid);
    EpsReportStore.setallData(props);
    setBsreporturl(EpsPrintStore.printUrl);
  }, [props.umid, EpsPrintStore.printUrl]);

  useEffect(() => {
    setIds({ ids: props.ids });
  }, [props.ids]);

  const menuShow = () => {
    const uo = EpsReportStore.menuData;
    setMenuDatas(uo);
  };

  useEffect(() => {
    setUmid({ umid: props.umid });
    menuShow();
    console.log('aaaaaaa==', menuDatas);
  }, [EpsReportStore.menuData]);

  const handlelxChange = (value) => {
    /*if(value=="3") {
            EpsReportStore.setUploadstate(false);
        }
*/
  };

  // 自定义表单

  const customForm = () => {
    //自定义表单校验

    return (
      <>
        <Form.Item
          label="报表名称:"
          name="name"
          required
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item label="缺省:" name="isdefault">
          <Checkbox checked={defaultChecked} onChange={onChangeDefault} />
        </Form.Item>

        <Form.Item label="公用:" name="ispublic">
          <Checkbox checked={publicChecked} onChange={onChangePublic} />
        </Form.Item>
        <Form.Item label="设计类型:" name="designType">
          <Select onChange={handlelxChange}>
            {/* <Option value="1">在线报表</Option>
                        <Option value="2">插件报表</Option>
                        <Option value="3">离线报表</Option> */}
            {EpsPrintStore.GnregSyncReport}
          </Select>
        </Form.Item>

        <Form.Item name="whr" label="维护人：">
          <Input defaultValue={EpsReportStore.yhmc} disabled />
        </Form.Item>

        <Form.Item label="维护时间:" name="whsj">
          <Input defaultValue={EpsReportStore.getDate} disabled />
        </Form.Item>

        <Form.Item name="whrid">
          <Input initialValues={EpsReportStore.yhid} hidden />
        </Form.Item>
        <Form.Item name="gnid">
          <Input initialValues={props.umid} hidden />
        </Form.Item>
      </>
    );
  };

  // 自定义功能按钮
  const customAction = (store: EpsTableStore) => {
    return [
      <>
        {/*  {EpsEditButton()}
            {<EpsEditButton column={props.source} title={props.title.name} data={record} store={tableStore} customForm={customForm}/>}
            {<EpsDeleteButton data={text} store={tableStore} />}*/}
        {/*<Button onClick={() =>onButtonClick()}>复制</Button>
            <Button onClick={() =>onButtonClick()}>编辑</Button>
            <Button onClick={() =>onButtonClick()}>删除</Button>
            <Button onClick={() =>onButtonClick()}>查看</Button>
            <Button onClick={() =>onButtonClick()}>设计</Button>
            <Button onClick={() =>onButtonClick()}>导入</Button>
            <Button onClick={() =>onButtonClick()}>导出</Button>*/}
      </>,
    ];
  };

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(
    new EpsTableStore(EpsReportService),
  );
  /*
        const [columns, setColumns] = useState<TableColumn[]>([])
    */

  const getCustomTableAction = (text, record, index, store) => {
    let res: Array<any> = [];
    res.push(
      <Design text={text} record={record} index={index} store={store} />,
    );
    if (record.designType === '2') {
      res.push(
        <ImportReportFile
          text={text}
          record={record}
          index={index}
          store={store}
        />,
      );
      res.push(
        <ExportReportFile
          text={text}
          record={record}
          index={index}
          store={store}
        />,
      );
    }

    return <>{[res]}</>;
  };

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return getCustomTableAction(text, record, index, store);
    //    return ([
    //             <CopyReport title="复制" column={source} data={record} store={tableStore} customForm={customForm} />,
    //             Design(text,record,index,store),
    //             ImportReportFile(text,record,index,store),
    //             ExportReportFile(text,record,index,store)
    //        ])
  };

  function reportClose() {
    //   EpsReportStore.findMenu(props.umid);
    fetch
      .get(`/api/eps/control/main/epsreport/queryForList?umid=` + props.umid)
      .then((res) => {
        if (res && res.status === 200) {
          if (res.data.length > 0) {
            setMenuDatas(res.data);
            EpsReportStore.setMenuData(res.data);
          }
        }
      });
    setVisible(false);
  }

  // 创建菜单
  const loop = (data) =>
    data.map((item) => {
      return (
        <Menu.Item
          key={item.id}
          title={item.name}
          onClick={() => {
            EpsReportStore.doPrintOrPreview('yl', item.id, store, ids);
            console.log('sfsdfdsf store', props.store);
          }}
        >
          <span>{item.name}</span>
        </Menu.Item>
      );
    });
  // 打印的菜单,
  const menu = <Menu mode="vertical">{loop(menuDatas)}</Menu>;

  // const bsreporturl=EpsPrintStore.printUrl;

  return (
    <>
      <Dropdown overlay={menu} placement="bottomCenter" arrow>
        <Button
          type="primary"
          style={{ marginRight: 10 }}
          icon={<PrinterOutlined />}
          onClick={() => {
            setInitKey(props.umid);
            let store = ref.current?.getTableStore();
          }}
        >
          打印
        </Button>
      </Dropdown>

      <Modal
        title="报表"
        centered
        visible={prinstvisible}
        footer={null}
        width={1200}
        bodyStyle={{ height: 700 }}
        onCancel={() => setPrintVisible(false)}
        destroyOnClose={true}
      >
        {/*<iframe name="bsframe" frameBorder="false" width="100%" scrolling="auto" height="100%"*/}
        {/*        src={bsreporturl}/>*/}
      </Modal>

      <Button
        type="primary"
        style={{ marginRight: 10 }}
        onClick={() => {
          setInitKey(props.umid);
          let store = ref.current?.getTableStore();
          setVisible(true);
        }}
      >
        报表
      </Button>
      <Modal
        title="报表"
        centered
        visible={visible}
        footer={null}
        className="report-modal"
        //    style={{height: 'auto'}}
        width={modalWidth}
        style={{ maxHeight: modalHeight + 'px', height: modalHeight + 'px' }}
        //  onCancel={() => setVisible(false)}
        onCancel={reportClose}
      >
        <div
          style={{
            maxHeight: (props.height || modalHeight) + 'px',
            height: (props.height || modalHeight) + 'px',
            width: '100%',
          }}
        >
          <EpsPanel
            title={title}
            source={source}
            initKey={initKey}
            initParams={umid}
            tableProp={tableProp}
            ref={ref}
            /* searchForm={searchFrom}            */ // 高级搜索组件，选填
            tableService={EpsReportService}
            customForm={customForm}
            /* customAction={customAction}*/
            customTableAction={customTableAction}
          ></EpsPanel>
        </div>
      </Modal>
    </>
  );
});

export default EpsReportButton;
