import { useEffect, useState, useRef } from 'react';
import { observer, useObserver } from 'mobx-react';
import EpsRecordPanel from '@/eps/components/panel/EpsTabPanel';
import { ITable, ITitle } from '@/eps/commons/declare';
import { DownloadOutlined, FileAddOutlined } from '@ant-design/icons';
import _ApplyService from './ApplyService';
import InspectionService from './ApplyDetailService';
import {
  Select,
  DatePicker,
  Space,
  Button,
  notification,
  Form,
  Tooltip,
  Tabs,
  Input,
  Radio,
  Row,
  Col,
} from 'antd';
import _ApplyStore from './ApplyStore';
import { WflwButtons } from '@/components/Wflw';
const { RangePicker } = DatePicker;
import DapubStore from './DapubStore';
import applyDetailStore from './ApplyDetailStore';
import './index.less';
import WfdefStore from '@/stores/workflow/WfdefStore';
import Print from '@/pages/dagl/Yjsp/Print';
import UploadReport from '@/pages/dagl/Yjsp/UploadReport';

import moment, { isMoment } from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import { EditOutlined } from '@ant-design/icons';
import EpsDeleteButton from '@/eps/components/buttons/EpsDeleteButton';
import SysStore from '@/stores/system/SysStore';
import EditDailog from './EditDailog';
import { useIntl } from 'umi';
import ApplyDetail from './DajdDetailNoToolBar';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import ArchDetail from './ArchDetail';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import MobxButton from '@/eps/components/buttons/EpsModalButton/MobxButton';
import ApplyEditButton from './ApplyEditButton';
import TextArea from 'antd/lib/input/TextArea';
import { useParams } from 'umi';
import GszxyjcxStore from '@/stores/dagsyj/GszxyjcxStore';
import { showMessage } from '@/eps/components/message';

const { TabPane } = Tabs;

const title: ITitle = {
  name: '审批',
};

interface DataType {
  autosubmit: boolean;
  bmid: string;
  dakid: string;
  dakmc: string;
  datbl: string;
  date: string;
  dwid: string;
  edittype: number;
  fjs: number;
  id: string;
  mbid: string;
  month: number;
  title: string;
  wfawaiter: string;
  wfhandler: string;
  wfid: string;
  wfinst: string;
  whsj: string;
  wpid: string;
  year: number;
  yjr: string;
  yjrid: string;
  zt: string;
}
const userinfo = SysStore.getCurrentUser();
const ApplyStore = new _ApplyStore('', true, true);
const inspectionService = new InspectionService('');

const Approve = observer((props) => {
  const approveParams = useParams();
  inspectionService.setUrl(`/api/eps/control/main/${props.spurl}`);
  ApplyStore.setUrl(`/api/eps/control/main/${props.spurl}`);
  const ApplyService = new _ApplyService(
    `/api/eps/control/main/${props.spurl}`,
  );
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  // 审批默认列
  const defaultMainColumns = [
    {
      title: formatMessage({ id: 'e9.dagl.yjsp.zt' }),
      code: 'wpid',
      width: 100,
      render: (value) => {
        if (value === 'ZZZY') {
          return '否决';
        }
        const list = WfdefStore.proclist[props.wfCode];

        if (list) {
          for (let i = 0; i <= list.length - 1; i++) {
            if (list[i].wpid == value) {
              return list[i].name;
            }
          }
        }
        // return value;
      },
    },
    {
      title: '申请单号',
      code: 'id',
      width: 120,
    },
    {
      title: '标题',
      code: 'title',
      width: 280,
    },
    {
      title: '申请人',
      code: 'yjr',
      width: 100,
    },
    {
      title: '申请日期',
      code: 'date',
      width: 150,
    },
    {
      title: formatMessage({ id: 'e9.wflw.pub.wfawaiter' }),
      code: 'wfawaiter',
      width: 100,
    },
  ];
  const tmzt = props.tmzt;
  const [detailTableStore, setDetailTableStore] = useState<EpsTableStore>(
    new EpsTableStore(inspectionService),
  );

  const defaultDetailColumns: any[] = [
    // {
    //   code: 'jdyj',
    //   align: 'center',
    //   title: '审批标识',
    //   width: '150px',
    //   render: (value, record, index) => (
    //     <Space size={8}>
    //       <span>
    //         {props?.approveMark?.agree || '同意'}
    //         <span style={{ color: '#f50' }}>({record.kfs})</span>
    //       </span>
    //       <span>
    //         {props?.approveMark?.disAgree || '不同意'}
    //         <span style={{ color: '#2db7f5' }}>({record.bkfs})</span>
    //       </span>
    //     </Space>
    //   ),
    //   // ="#f50">开放{record.kfs}</Tag>
    //   // <Tag color="#2db7f5
    // },
  ];
  const wfinst = approveParams.wfinst || '';
  const [tabkey, setTabkey] = useState('1');
  const { columns } = props;
  const umid = props.umid;
  const jdlx = props.jdlx;

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   */
  const doSearchAction = (formData, tableStore) => {
    const { datebe, sw = 'W' } = formData;
    const dateb = datebe && datebe[0];
    const datee = datebe && datebe[1];
    const params = { sw };
    if (dateb && isMoment(dateb)) {
      params.dateb = dateb.format('YYYY-MM-DD');
    }
    if (datee && isMoment(datee)) {
      params.datee = datee.format('YYYY-MM-DD');
    }
    ApplyStore.setParams(params, true);
    tableStore.findByKey(tableStore.key, 1, tableStore.size, params);
  };
  const ref = useRef();

  const onChangeRow = (value, tableStore, records) => {
    const record = records[0];
    if (records && records.length > 0) {
      ApplyStore.setSelectRows(
        records.map((item) => item.id),
        records,
      );
      const spkj = ApplyStore.ctrlWfVisile('P', record);
      ApplyStore.setSpkj(spkj);
      debugger;
      // 调档可见
      const ddkj = ApplyStore.ctrlWfVisile('D', record);
      ApplyStore.setDdkj(ddkj);
      // 人员分配可见
      const rykj = ApplyStore.ctrlWfVisile('R', record);
      ApplyStore.setRykj(rykj);

      // 只可见自己
      const zjkj = ApplyStore.ctrlWfVisile('G', record);
      ApplyStore.setZjkj(zjkj);

      //   ApplyStore.setCanWfadd(canWfAdd);

      DapubStore.getDaklist(records[0].dakid, tmzt);
      // console.log(DapubStore.mainColumns;
      setTabkey('1');
      ApplyStore.setDetailParams({
        zt: record.zt,
        wpid: record.wpid,
        fid: record.id,
        dakid: record.dakid,
        tmzt,
        mbid: record.mbid,
        bmc: record.datbl,
      });
    }
  };

  const initApplyInfo = async () => {
    await WfdefStore.getPromisePorcs(props.wfCode);
    ApplyStore.getProcOpts(props.wfCode);
    OptrightStore.getFuncRight(umid);
    // field.setValues({
    //   dateb: moment().startOf("month"),
    //   datee: moment().endOf("month"),
    //   sw: "W",
    // });
    ApplyStore.setColumns(props.columns || defaultMainColumns);
  };

  useEffect(() => {
    initApplyInfo();
  }, []);

  //<workdlofbegin
  const onBeforeWfAction = async (action) => {
    if (
      !ApplyStore.selectRowRecords ||
      ApplyStore.selectRowRecords.length !== 1
    ) {
      notification.open({
        message: '提示',
        description: '请选择一条数据',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
      return false;
    }
    //判断状态为P时提交必须所有人明细都进行审批

    if (
      ApplyStore.selectRowRecords[0].zt == 'P' &&
      !ApplyStore.checkAllApply()
    ) {
      notification.open({
        message: '提示',
        description: '有未审批的的明记录，请进行审批!',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
      return false;
    }
    return true;
  };

  const doGlobalRefresh = (res) => {
    const store = ref.current?.getTableStore();
    doSearchAction({}, store);
    if (res) {
      if (res.success) {
        debugger;
        store.selectedRowKeys = [res.data.id];
        store.checkedRows = [res.data];
        ApplyStore.setFid(res.data.id);
        onChangeRow(null, null, [res.data]);
      } else {
        ApplyStore.setSelectRows('', []);
        ref.current?.clearTableRowClick();
      }

      // ApplyStore.fid = '';
      // ApplyStore.setDetailSelectRowKeys([], []);
      // ApplyStore.ddVisit = true;

      ApplyStore.setDdVisit(true);
    } else {
      refsh();
    }
    ///refsh(res.data.id);
  };

  const onAfterWfAction = (data) => {
    //  ApplyStore.queryForPage();
    clear();
  };

  const clear = () => {
    ref.current?.clearTableRowClick();
    ApplyStore.setSelectRows('', []);
    const store = ref.current?.getTableStore();
    doSearchAction({}, store);
    ApplyStore.fid = '';
    ApplyStore.setDetailSelectRowKeys([], []);
    debugger;
    ApplyStore.setDetailParams({
      zt: '',
      wpid: '',
      fid: '',
    });
    refsh();
  };

  const getWfid = () => {
    if (ApplyStore.selectRowRecords && ApplyStore.selectRowRecords.length > 0) {
      return ApplyStore.selectRowRecords[0].wfid;
    }
    return '';
  };

  const getWfinst = () => {
    if (ApplyStore.selectRowRecords && ApplyStore.selectRowRecords.length > 0) {
      return ApplyStore.selectRowRecords[0].wfinst;
    }
    return '';
  };
  //>workflow end

  //<print begin
  function openUpload() {
    ApplyStore.uploadVisible = true;
  }

  function openPrint() {
    ApplyStore.printVisible = true;
  }

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onDetailPaginationChange = (current) => {
    applyDetailStore.setPageNo(current);
  };

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onDetailPageSizeChange = (pageSize) => {
    applyDetailStore.setPageSize(pageSize);
  };

  //>print end

  //<e9 begin
  const openDak = () => {
    DapubStore.getDDaklist(ApplyStore.detailParams.dakid);
  };

  /**
   * 删除 组件
   * @param record
   * @param store
   * @returns
   */
  const deleteTableAction = (record, store) => {
    return (
      <EpsDeleteButton
        deleteMessage={
          '删除申请单后，申请单的明细记录将退回文件收集库中，您可以到文件收集库中查看该申请单的明细记录，并重新提交'
        }
        data={record}
        store={store}
        afterDelete={clear}
        key={'common-delete' + record.id}
      />
    );
  };

  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = (record, store) => {
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    if (record.userEnable === 0) {
      json.userEnable = 0;
    }
    if (record.userQyrq === null) {
      json.userQyrq = null;
    }
    if (record.userTyrq === null) {
      json.userTyrq = null;
    }

    json.whrid = userinfo.id;
    json.whr = userinfo.yhmc;
    json.whsj = moment();
    debugger;
    // ApplyStore.setEditRecord(record);
    ApplyStore.showEditForm('edit', json, store);
  };
  /**
   * 编辑组件
   * @param record
   * @param store
   * @returns
   */
  const editTableAction = (record, store) => {
    return (
      <EpsModalButton
        key={`approveEdit_${record.id}`}
        isIcon={true}
        store={store}
        params={{ jgmxid: record.id }}
        url="/perfortest/jcjg/sxjcjgLog"
        title="编辑"
        width={1200}
        height={400}
        name="详情"
        icon={<EditOutlined />}
      ></EpsModalButton>
    );
  };

  const [form] = Form.useForm();
  // 自定义功能按钮
  const customAction = (store, rows) => {
    return [
      <>
        <Form
          onFinish={(formData) => doSearchAction(formData, store)}
          layout={'inline'}
          form={form}
          initialValues={{
            // datebe: [moment().startOf("month"), moment().endOf("month")],
            sw: 'W',
          }}
        >
          <Form.Item name="sw">
            <Select style={{ width: 120 }}>
              <Select.Option value="W">待我处理</Select.Option>
              <Select.Option value="H">我已处理</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="datebe">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType={'submit'}>
              查询
            </Button>
          </Form.Item>
        </Form>
        {/*<UploadReport />*/}
        {ApplyStore.spkj && <UploadReport />}
        {
          <EpsModalButton
            noFoot={true}
            key={`approveAdd`}
            isIcon={false}
            btnStyle={{ marginRight: '10px' }}
            store={store}
            params={{ spUrl: 'kfjdsp' }}
            url="/eps/business/Approve/SelectDialogAdd"
            title="新建"
            callback={doGlobalRefresh}
            width={600}
            height={230}
            name="新建"
            icon={<EditOutlined />}
          ></EpsModalButton>
        }

        {
          <MobxButton
            isDraw={true}
            showButton={ApplyStore.ddkj}
            modalVisit={ApplyStore.ddVisit}
            store={ApplyStore}
            closeModal={() => ApplyStore.setDdVisit(false)}
            key={`selectDakMain`}
            btnStyle={{ marginRight: '10px' }}
            callback={refsh}
            isIcon={false}
            useIframe={false}
            beforeOpen={(params) => {
              if (params.dakid) {
                return true;
              } else {
                showMessage('请选择审批单', 'warn');
                return false;
              }
            }}
            // callback={refsh}
            params={{
              bmc:
                ApplyStore.selectRowRecords &&
                ApplyStore.selectRowRecords[0] &&
                ApplyStore.selectRowRecords[0].datbl,
              dakid:
                ApplyStore.selectRowRecords &&
                ApplyStore.selectRowRecords[0] &&
                ApplyStore.selectRowRecords[0].dakid,
              kfjdid:
                ApplyStore.selectRowRecords &&
                ApplyStore.selectRowRecords[0] &&
                ApplyStore.selectRowRecords[0].id,
              lx: '01',
              mc: '文书档案',
              path: '/runRfunc/archManage/DAK202110241653120002/1',
              title: '111|文书档案',
              tmzt: 8,
              type: 'K',
              umid: 'DAGL001',
              umname: '档案鉴定',
              wzlk: 'N',
              ztmc: '档案鉴定',
              params: {
                dynamicButtons: [
                  {
                    daklx: '01',
                    edittype: 0,
                    fid: '1',
                    fjs: 0,
                    fz: '',
                    icon: 'DAK00_31.png',
                    isadd: 'N',
                    name: '确认',
                    optcode: 'DY001',
                    optlx: '1',
                    sort: '22',
                    tmzt: '3',
                    whsj: '2022-02-14 16:23:46',
                    wzlk: 'N',
                  },
                  {
                    daklx: '01',
                    edittype: 0,
                    fid: '1',
                    fjs: 0,
                    fz: '',
                    icon: 'DAK00_31.png',
                    isadd: 'N',
                    name: '确认并关闭',
                    optcode: 'DY002',
                    optlx: '1',
                    sort: '22',
                    tmzt: '3',
                    whsj: '2022-02-14 16:23:46',
                    wzlk: 'N',
                  },
                  {
                    daklx: '01',
                    edittype: 0,
                    fid: '1',
                    fjs: 0,
                    fz: '',
                    icon: 'DAK00_31.png',
                    isadd: 'N',
                    name: '关闭',
                    optcode: 'DY003',
                    optlx: '1',
                    sort: '22',
                    tmzt: '3',
                    whsj: '2022-02-14 16:23:46',
                    wzlk: 'N',
                  },
                ],
                authType: 'modal',
                initQuery: { kfjd: '' },
              },
            }}
            url={'/runRfunc/archManage/DAK202110241653120002/8'}
            title="调档"
            width={'100%'}
            height={document.body.clientHeight - 20}
            name="调档"
            icon={<EditOutlined />}
          ></MobxButton>
        }
        <WflwButtons
          style={{ marginLeft: '10px' }}
          offset={[18, 0]}
          type={['submit', 'return', 'reject', 'logview']}
          wfid={getWfid()}
          wfinst={getWfinst()}
          onBeforeAction={onBeforeWfAction}
          onAfterAction={onAfterWfAction}
        />
      </>,
    ];
  };

  const doEditOk = () => {
    const store = ref.current?.getTableStore();
    doSearchAction({}, store);
  };

  const doDownloadAction = (record) => {
    const params = {
      dakid: record.dakid,
      // tmid: "DAIM202004031357510010",

      id: record.id,
      xtname: SysStore.xtname,
    };
    console.log('dodownloan', params);
    GszxyjcxStore.xdownloadEEP(params);
  };

  /**
   * 响应删除事件
   * @param {*} id
   */
  const onDeleteAction = (id) => {};

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
        {[
          ApplyStore.canWfDelete(record) && deleteTableAction(record, store),
          // ApplyStore.canWfEdit(record) &&
          // editTableAction(record, store),
          // Print(text, record, index, store),
        ]}
        {record.wpid === 'ZZZZ' && props.canDownloadAsip && (
          <Button
            size="small"
            style={{ fontSize: '12px' }}
            type="primary"
            shape="circle"
            icon={<DownloadOutlined />}
            onClick={() => doDownloadAction(record)}
          />
        )}
      </>
    );
  };

  const tableProp: ITable = {
    disableAdd: true,
    tableSearch: false,
    disableEdit: true,
    disableDelete: true,
    disableCopy: true,
    rowSelection: {
      type: 'radio',
    },
  };

  const onTabChange = (key) => {
    if (key == '2') {
      const rs = detailTableStore.selectedRowKeys;
      if (!rs || rs.length <= 0) {
        // IceNotification.info({
        //   message: formatMessage({ id: "e9.info.info" }),
        //   description: formatMessage({ id: "e9.info.selectOneOnly" }),
        // });

        notification.open({
          message: '提示',
          description: formatMessage({ id: 'e9.info.selectOneOnly' }),
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
        return;
      }

      ApplyStore.setDetailSelectRowKeys(
        detailTableStore.selectedRowKeys,
        detailTableStore.checkedRows,
      );
      //openDak();
    }
    if (key == '3') {
      if (!ApplyStore.detailRecordParams.daid) {
        notification.open({
          message: '提示',
          description: formatMessage({ id: 'e9.info.selectOneOnly' }),
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
        return;
      }
    }
    setTabkey(key);
  };

  //审批form
  const customForm = () => {
    return (
      <>
        <>
          <Form.Item label="审批人" name="spr">
            <Input disabled style={{ width: '100%' }} placeholder="" />
          </Form.Item>
          <Form.Item label="审批时间" name="sprq">
            <DatePicker style={{ width: '100%' }} showTime />
          </Form.Item>
          {!props.applylevel && (
            <Form.Item label="审批" name="spzt">
              <Radio.Group defaultValue="a" buttonStyle="solid">
                <Radio.Button value="Y">
                  {props.approveMark?.agree || '同意'}
                </Radio.Button>
                <Radio.Button value="N">
                  {props.approveMark?.disAgree || '不同意'}
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          )}

          {props.applylevel.options.length > 0 && (
            <Form.Item
              label={props.applylevel.label}
              name={props.applylevel.name}
            >
              <Select
                placeholder={props.applylevel.label}
                className="ant-select"
                options={props.applylevel.options}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}

          <Form.Item label="意见" name="remark">
            <TextArea style={{ width: '100%' }} rows={2} />
          </Form.Item>
        </>
      </>
    );
  };

  const refsh = (fid) => {
    debugger;
    if (fid || ApplyStore.fid) {
      detailTableStore?.findByKey('', 1, detailTableStore.size, {
        fid: fid ? fid : ApplyStore.fid,
        ...ApplyStore.detailParams,
      });
    }
  };

  const operations = (
    <span style={{ padding: '20px' }}>
      <Space>
        {ApplyStore.rykj && (
          <EpsModalButton
            isDraw={true}
            isIcon={false}
            useIframe={false}
            callback={refsh}
            beforeOpen={(params) => {
              if (params.mxid) {
                return true;
              } else {
                showMessage('请选择条目', 'warn');
                return false;
              }
            }}
            params={{
              mxid: detailTableStore.checkedRows
                .map((o) => {
                  return o.id;
                })
                .join(','),
            }}
            url={'/sys/yh/yhModal'}
            title="鉴定人员"
            width={'100%'}
            height={document.body.clientHeight - 90}
            name="鉴定人员"
            icon={<EditOutlined />}
          ></EpsModalButton>
        )}
        {ApplyStore.ddkj && (
          <EpsModalButton
            isDraw={true}
            key={`selectDak`}
            isIcon={false}
            useIframe={false}
            callback={refsh}
            beforeOpen={(params) => {
              if (params.dakid) {
                return true;
              } else {
                showMessage('请选择审批单', 'warn');
                return false;
              }
            }}
            params={{
              bmc:
                ApplyStore.selectRowRecords &&
                ApplyStore.selectRowRecords[0] &&
                ApplyStore.selectRowRecords[0].datbl,
              dakid:
                ApplyStore.selectRowRecords &&
                ApplyStore.selectRowRecords[0] &&
                ApplyStore.selectRowRecords[0].dakid,
              lx: '01',
              kfjdid:
                ApplyStore.selectRowRecords &&
                ApplyStore.selectRowRecords[0] &&
                ApplyStore.selectRowRecords[0].id,
              lx: '01',
              params: {
                dynamicButtons: [
                  {
                    daklx: '01',
                    edittype: 0,
                    fid: '1',
                    fjs: 0,
                    fz: '',
                    icon: 'DAK00_31.png',
                    isadd: 'N',
                    name: '确认',
                    optcode: 'DY001',
                    optlx: '1',
                    sort: '22',
                    tmzt: '3',
                    whsj: '2022-02-14 16:23:46',
                    wzlk: 'N',
                  },
                  {
                    daklx: '01',
                    edittype: 0,
                    fid: '1',
                    fjs: 0,
                    fz: '',
                    icon: 'DAK00_31.png',
                    isadd: 'N',
                    name: '确认并关闭',
                    optcode: 'DY002',
                    optlx: '1',
                    sort: '22',
                    tmzt: '3',
                    whsj: '2022-02-14 16:23:46',
                    wzlk: 'N',
                  },
                  {
                    daklx: '01',
                    edittype: 0,
                    fid: '1',
                    fjs: 0,
                    fz: '',
                    icon: 'DAK00_31.png',
                    isadd: 'N',
                    name: '关闭',
                    optcode: 'DY003',
                    optlx: '1',
                    sort: '22',
                    tmzt: '3',
                    whsj: '2022-02-14 16:23:46',
                    wzlk: 'N',
                  },
                ],
                authType: 'modal',
                initQuery: { kfjd: '' },
              },
              mc: '文书档案',
              path: '/runRfunc/archManage/DAK202110241653120002/1',
              title: '111|文书档案',
              tmzt: 8,
              type: 'K',
              umid: 'DAGL001',
              umname: '档案鉴定',
              wzlk: 'N',
              ztmc: '档案鉴定',
            }}
            url={'/runRfunc/archManage/DAK202110241653120002/8'}
            title="调档"
            width={'100%'}
            height={document.body.clientHeight - 20}
            name="调档"
            icon={<EditOutlined />}
          ></EpsModalButton>
        )}
        {ApplyStore.spkj && (
          <ApplyEditButton
            key={'applybutton_sp'}
            column={[]}
            title={'批量审批'}
            isButton={true}
            refreshDetail={refsh}
            data={{
              spr: SysStore.getCurrentUser().yhmc,
              sprid: SysStore.getCurrentUser().id,
              sprq: moment(),
              jdlx: jdlx,
              daid: detailTableStore.checkedRows
                .map((o) => {
                  return o.daid;
                })
                .join(','),
              kfjdmxid: detailTableStore.checkedRows
                .map((o) => {
                  return o.id;
                })
                .join(','),
              zt: ApplyStore.detailParams.zt,
              wpid: ApplyStore.detailParams.wpid,
            }}
            customForm={customForm}
          />
        )}
        {ApplyStore.spkj && (
          <ApplyEditButton
            key={'applybutton_all'}
            column={[]}
            title={'审批全部'}
            isButton={true}
            allSelect={true}
            fid={ApplyStore.selectRowKeys[0]}
            refreshDetail={refsh}
            data={{
              spr: SysStore.getCurrentUser().yhmc,
              sprid: SysStore.getCurrentUser().id,
              sprq: moment(),
              jdlx: jdlx,

              daid: detailTableStore.checkedRows
                .map((o) => {
                  return o.daid;
                })
                .join(','),
              kfjdmxid: detailTableStore.checkedRows
                .map((o) => {
                  return o.id;
                })
                .join(','),
              zt: ApplyStore.detailParams.zt,
              wpid: ApplyStore.detailParams.wpid,
            }}
            customForm={customForm}
          />
        )}
      </Space>
    </span>
  );

  const bottomAction = (store, rows) => {
    const applyDetailColumns = defaultDetailColumns.concat(
      DapubStore.mainColumns,
    );
    const allDetailApplyColumns = [
      {
        title: '审批结果',
        code: 'spjg',
        align: 'center',
        width: 100,
        // render: function (value) {
        //   return value == 'Y'
        //     ? props?.approveMark?.agree || '通过'
        //     : value == 'N'
        //     ? props?.approveMark?.disAgree || '不通过'
        //     : '';
        // },
      },
      {
        title: '鉴定人',
        code: 'sprname',
        align: 'center',
        width: 100,
      },
    ].concat(DapubStore.mainColumns);
    return useObserver(() => (
      <div className="detail-container">
        <Tabs
          type="line"
          style={{ height: '100%' }}
          hideAdd
          tabBarExtraContent={operations}
          activeKey={tabkey}
          // onEdit={onEdit}
          onChange={(key) => onTabChange(key)}
        >
          <TabPane
            key={1}
            tab={'条目明细'}
            style={{ height: '100%' }}
            closable={false}
          >
            <ApplyDetail
              setTableStore={(value) => {
                setDetailTableStore(value);
              }}
              inspectionService={inspectionService}
              canAdd={props.canAdd}
              zjkj={ApplyStore.zjkj}
              customForm={customForm}
              approveMark={props.approveMark || {}}
              jdlx={props.jdlx}
              approve={ApplyStore.spkj}
              canWfDelete={ApplyStore.canWfDelete()}
              columns={allDetailApplyColumns}
              fid={ApplyStore.fid}
              detailParams={ApplyStore.detailParams}
              spurl={props.spurl}
            />
          </TabPane>
          {/* 工程案卷或者案卷卷内 */}
          {ApplyStore.selectRowRecords &&
            ApplyStore.selectRowRecords.length &&
            DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid] &&
            ['02', '03', '0401', '04'].includes(
              DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid].daklx,
            ) && (
              <TabPane
                key={2}
                tab={
                  DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid]
                    .daklx == '04'
                    ? '工程案卷'
                    : '卷内'
                }
                style={{ height: '100%' }}
                closable={false}
              >
                <ArchDetail
                  onChangeRow={ApplyStore.archRecordsChangeRow}
                  setDakid={ApplyStore.setDakid}
                  archParams={{ fid: ApplyStore.detailParams.dakid, tmzt }}
                  fileCol
                  recordId={ApplyStore?.detailSelectRows[0]?.daid}
                  jdlx={jdlx}
                />
              </TabPane>
            )}
          {ApplyStore.selectRowRecords &&
            ApplyStore.selectRowRecords.length &&
            DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid] &&
            ['04'].includes(
              DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid].daklx,
            ) && (
              <TabPane
                key={3}
                tab={'卷内'}
                style={{ height: '100%' }}
                closable={false}
              >
                <ArchDetail
                  onChangeRow={(value) => {
                    console.log(value);
                  }}
                  archParams={{ fid: ApplyStore.ajDakid, tmzt }}
                  fileCol
                  recordId={ApplyStore.detailRecordParams.daid}
                  jdlx={jdlx}
                />
              </TabPane>
            )}
        </Tabs>
      </div>
    ));
  };

  return (
    <>
      <EpsRecordPanel
        customAction={customAction}
        customTableAction={customTableAction}
        tableProp={tableProp}
        initParams={{ wfinst }}
        mainTabTitle={'申请单'}
        //activeKey={ApplyStore.activeTabKey}
        canAdd={props.canAdd}
        onChangeTab={ApplyStore.setActiveKey}
        //tableRowClick={onChangeRow}
        title={title}
        source={ApplyStore.columns}
        tableService={ApplyService}
        ref={ref}
        bottomAction={bottomAction}
        onTabChange={onChangeRow}
      />
      <EditDailog ApplyStore={ApplyStore} doEditOk={doEditOk} />
    </>
  );
});

export default Approve;
