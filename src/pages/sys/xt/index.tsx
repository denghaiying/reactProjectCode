import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import MkService from '@/services/system/MkService';
import { EpsSource, ITable } from '@/eps/commons/declare';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Switch,
  Tooltip,
  TreeSelect,
  Upload,
} from 'antd';
import EpsReportButton from '@/eps/components/buttons/EpsReportButton/index';
import Detail from '@/pages/sys/Mk/Detail';
import { observer, useLocalObservable } from 'mobx-react';
import {
  ClearOutlined,
  ExportOutlined,
  ImportOutlined,
  LoginOutlined,
  LogoutOutlined,
  SaveOutlined,
  ToolOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import EpsReportStore from '@/eps/components/buttons/EpsReportButton/store/EpsReportStore';
import fetch from '@/utils/fetch';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import SysStore from '@/stores/system/SysStore';
import ImportRegInfo from '@/pages/sys/xt/importRegInfo';
import moment from 'moment';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import EpsUploadButton from '@/eps/components/buttons/EpsUploadButton';
import xtfjService from './xtfjService';

import EpsUploadSimple from '@/eps/components/uploadSimple';
const FormItem = Form.Item;

const Xt = observer((props) => {
  const [umid, setUmid] = useState('');
  const [importDisabled, setImportDisabled] = useState(false);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const [modalWidth, SetModalWidth] = useState(500);
  const [xtDisabled, setXtDisabled] = useState(false);
  const [toolsDisabled, setToolsDisabled] = useState(false);
  const [modalHeight, setModalHeight] = useState(0);
  const ref = useRef();

  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  // 创建Store实例
  /**
   * childStore
   */
  const XtStore = useLocalObservable(() => ({
    xtData: {},
    filegre: '',
    xtid: '',
    xtgjDisabled: false,
    importDisabled: false,
    zcdate: '',
    gninfo: {},
    fjsc: false,

    async queryXt() {
      const response = await fetch.post(`/api/eps/control/main/xt/queryForId`);

      if (response.status === 200) {
        this.xtData = response.data;
        //   this.filegre=response.data.filegrpid;
        if (!response.data.filegrpid || !response.data.filegrpid.trim()) {
          const res1 = await fetch.post(`/api/eps/wdgl/attachdoc/getGuid`);
          let guid = '';
          if (response.status === 200) {
            guid = res1.message;
          }
          this.filegre = guid;
        } else {
          this.filegre = response.data.filegrpid;
        }
        this.xtid = response.data.xtid;
        //       this.zcdate=moment(response.data.zcrq);
      } else {
        return;
      }
    },

    async update(values) {
      const response = await new HttpRequest('').get({
        url: `/api/eps/control/main/xt/update`,
        params: values,
      });
      if (response && response.status === 200) {
        if (response.data.success === false) {
          message.error(`保存失败!`);
        } else {
          message.success(`保存成功!`);
        }
      }
    },

    async getUserOptionXtgj() {
      let url = '/api/eps/control/main/params/getUserOption';
      const response = await fetch.get(url, {
        code: 'CONTROLS012',
        gnid: 'CONTROL0001',
        yhid: SysStore.currentUser.id,
      });
      if (response.status === 200) {
        if (response.data.length > 0) {
          if (response != 'Y') {
            this.xtgjDisabled = true;
          }
        } else {
          return;
        }
      }
    },

    async exportRegInfo() {
      // const url="/api/eps/control/main/xt/exportRegInfo";
      // let formData = new FormData();
      // formData.append('ids', "export");
      // const response = await fetch.post(url, formData);
      // if (response.status === 200) {
      //     console.log('response==',response);
      //
      // }else{
      //   return;
      // }
      window.location.href = '/api/eps/control/main/xt/exportRegInfo';
    },

    async clearCache() {
      const url = '/api/eps/control/main/xt/clearCache';
      const response = await fetch.post(url);
      if (response && response.status === 200) {
        if (response.data.success) {
          message.success(`清除缓存成功!`);
        } else {
          return;
        }
      }
    },

    async getGnInfo() {
      let mkurl = '';
      const data = await fetch.post(
        '/api/eps/control/main/mk/queryForId?mkbh=CONTROL',
      );

      if (data && data.data) {
        mkurl = data.data.baseurl;
      }

      const response = await fetch.post(
        mkurl + '/getFunctionInfo?umid=CONTROL0001',
      );

      if (response.status === 200) {
        this.gninfo = response.data;
        if (response.data.opts === 'all') {
          this.fjsc = true;
        } else {
          const b = (',' + response.data.opts + ',').indexOf(',FJSC01,') >= 0;
          this.fjsc = b;
        }
      } else {
        return;
      }
    },
  }));

  useEffect(() => {
    // SearchStore.queryDw();
    XtStore.getUserOptionXtgj();
    XtStore.queryXt();
    XtStore.getGnInfo();
    setUmid('CONTROL0001');
    setModalHeight(window.innerHeight - 300);
    // setFormData(props.data)
  }, []);

  useEffect(() => {
    setFormData(XtStore.xtData);
    form.setFieldsValue(XtStore.xtData);
  }, [XtStore.xtData]);

  const onFinish = (values: any) => {
    XtStore.update(values)
      .then((res) => {
        //  message.success('密码修改成功');
        XtStore.queryXt();
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const onExportRegInfo = () => {
    const res = XtStore.exportRegInfo();
    console.log('resexport==', res);
  };

  const onImportRegInfo = () => {
    setImportDisabled(true);
  };

  const openTool = () => {
    // if (!XtStore.filegre) {
    //   var pata={};
    //     let url="/api/eps/wdgl/attachdoc/getGuid";
    //     const response =await fetch.get(url,{});
    //     setGrpid(response.data.message);
    //     pata=props.tableparams;
    //     pata.grpid=response.data.message;
    //     setTableparams(pata);
    // }else{
    //    setGrpid(XtStore.filegre);
    // //   setTableparams(tableparams);
    // }
    setToolsDisabled(true);
  };

  function onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  }

  function beforeUpload(file) {
    let isJpgOrPng = true;
    const fname = file.name;
    const extName = fname.substring(fname.lastIndexOf('.') + 1);
    console.log('extName' + extName);

    if (extName !== 'rgi') {
      isJpgOrPng = false;
      message.error('只能上传rgi文件!');
    }

    return isJpgOrPng;
  }

  /**
   * 上传组件prop
   */
  const uploadProp: IUpload = {
    disableUpload: false, // 上传按钮
    disableBigUpload: true, // 大文件上传按钮
    disableDown: false, // 下载按钮
    disableYwDown: true, // 水印下载
    disableViewDoc: true, // 查阅
    disableYwViewDoc: true, // 水印查阅
    uploadUrl: '/api/eps/wdgl/attachdoc/upload', // 上传url地址
    doctbl: 'ATTACHDOC', // 附件表名
    grptbl: 'DOCGROUP', // 附件分组表名
    wrkTbl: 'XT', // 数据表名
    // dakid: dakid,
    dw: SysStore.getCurrentUser().dwid, // 用户单位ID
    umId: 'CONTROL0001',
    aprint: '', // 水印打印次数
    adown: '', // 水印下载 次数
  };

  // 附件列表信息
  const uploadtableProp: ITable = {
    disableEdit: true,
    disableAdd: true,
    disableCopy: true,
    tableSearch: false,
    labelColSpan: 8,
    rowSelection: {
      type: 'check',
    },
  };

  /**
   * 附件列表 表格source
   */
  const fjsource: EpsSource[] = [
    {
      title: '标题',
      code: 'title',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '文件名',
      code: 'filename',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '文件类型',
      code: 'ext',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '文件大小',
      code: 'fullsize',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '有效日期',
      code: 'yxrq',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '停用',
      code: 'ty',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '备注',
      code: 'bz',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '版本号',
      code: 'bbh',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '校验码',
      code: 'md5code',
      align: 'center',
      formType: EpsFormType.Input,
    },
  ];

  const span = 12;
  const _width = 300;
  const dateFormat = 'YYYY-MM-DD';

  const cidvs = { xtid: XtStore.xtid };

  return (
    <>
      <div style={{ height: '100%', overflowX: 'hidden', overflowY: 'auto' }}>
        <br />

        <Form
          name="xtform"
          form={form}
          initialValues={XtStore.xtData}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
        >
          <div style={{ marginTop: '10px' }}>
            {/* <Button disabled={XtStore.xtgjDisabled} type="primary" style={{marginRight: 10}} icon={<ToolOutlined />}
              onClick={() => {EpsReportStore.findMenu(props.umid);}} >
        系统工具
      </Button> */}
            &nbsp;&nbsp;
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              保存
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              icon={<ToolOutlined />}
              onClick={openTool}
            >
              系统工具
            </Button>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              icon={<ImportOutlined />}
              onClick={onImportRegInfo}
            >
              导入注册信息
            </Button>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              icon={<ExportOutlined />}
              onClick={onExportRegInfo}
            >
              导出注册信息
            </Button>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              icon={<ClearOutlined />}
              onClick={() => {
                XtStore.clearCache();
              }}
            >
              清除后台缓存
            </Button>
          </div>

          <div className="ant-form">
            <Divider orientation="left" plain>
              系统信息
            </Divider>
            <Row gutter={20}>
              <Col span={span}>
                <Form.Item label="系统编码" name="xtid">
                  <Input
                    disabled
                    style={{ width: _width }}
                    className="ant-input"
                  />
                </Form.Item>
              </Col>
              <Col span={span}>
                <Form.Item label="系统名称" name="xtmc">
                  <Input
                    disabled
                    style={{ width: _width }}
                    className="ant-input"
                  />
                </Form.Item>
              </Col>
              <Col span={span}>
                <Form.Item label="皮肤" name="pf">
                  <Select style={{ width: _width }} className="ant-select">
                    <option value="6">平台</option>
                    <option value="7" defaultChecked>
                      弹出菜单
                    </option>
                    <option value="8">标签页</option>
                    <option value="9">深蓝</option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={span}>
                <Form.Item label="注册日期" name="zcrq">
                  <Input
                    disabled
                    style={{ width: _width }}
                    className="ant-input"
                  />
                  {/* <DatePicker disabled  format="YYYY-MM-DD" style={{width:  _width}}  /> */}
                </Form.Item>
              </Col>
              <Col span={span}>
                <Form.Item label="系统更新号" name="xtgxh">
                  <Input
                    disabled
                    style={{ width: _width }}
                    className="ant-input"
                  />
                </Form.Item>
              </Col>
              <Col span={span}>
                <Form.Item label="基准数据库号" name="sjkgxh">
                  <Input
                    disabled
                    style={{ width: _width }}
                    className="ant-input"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left" plain>
              单位信息
            </Divider>
            <Row gutter={20}>
              <Col span={span}>
                <Form.Item label="单位名称" name="dwmc">
                  <Input
                    disabled
                    style={{ width: _width }}
                    className="ant-input"
                  />
                </Form.Item>
              </Col>
              <Col span={span}>
                <Form.Item label="地址" name="dz">
                  <Input style={{ width: _width }} className="ant-input" />
                </Form.Item>
              </Col>

              <Col span={span}>
                <Form.Item label="联系人" name="lxr">
                  <Input style={{ width: _width }} className="ant-input" />
                </Form.Item>
              </Col>
              <Col span={span}>
                <Form.Item label="联系方式" name="lxfs">
                  <Input style={{ width: _width }} className="ant-input" />
                </Form.Item>
              </Col>
              <Col span={span} style={{ height: 52 }}>
                <Form.Item label="单位数" name="dws">
                  <Input
                    disabled
                    style={{ width: _width }}
                    className="ant-input"
                  />
                </Form.Item>
              </Col>
              <Col span={span} style={{ height: 52 }}>
                <Form.Item label="用户数" name="yhs">
                  <Input
                    disabled
                    style={{ width: _width }}
                    className="ant-input"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left" plain>
              安全信息
            </Divider>
            <Row gutter={20}>
              <Col span={span}>
                <Form.Item label="密码组成规则" name="mmzcgz">
                  <Select style={{ width: _width }} className="ant-select">
                    <option value="A" defaultChecked>
                      字母或数字
                    </option>
                    <option value="B">数字</option>
                    <option value="C">字母</option>
                    <option value="D">字母和数字</option>
                    <option value="E">字母和数字和特殊字符</option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={span}>
                <Form.Item label="新老密码不同" name="xlmmbt">
                  <Select style={{ width: _width }} className="ant-select">
                    <option value="1" defaultChecked>
                      相同
                    </option>
                    <option value="0">不同</option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={span}>
                <Form.Item label="最短密码长度" name="zdmmcd">
                  <Input style={{ width: _width }} className="ant-input" />
                </Form.Item>
              </Col>

              <Col span={span}>
                <Form.Item label="密码更新天数" name="mmqzgxts">
                  <Input style={{ width: _width }} className="ant-input" />
                </Form.Item>
              </Col>

              <Col span={span}>
                <Form.Item label="密码失效提醒" name="mmsxqtxts">
                  <Input style={{ width: _width }} className="ant-input" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
      <Modal
        title="导入注册信息"
        centered
        visible={importDisabled}
        footer={null}
        onCancel={() => setImportDisabled(false)}
        width={modalWidth}
      >
        <Upload
          name="Fdata"
          action="/api/eps/control/main/xt/importRegInfo"
          beforeUpload={beforeUpload}
          //     data={{id:record.id}}
          onChange={onChange}
          /* onSuccess={onSuccess}*/
          //    listType="text"
        >
          <Button
            icon={<UploadOutlined />}
            type="primary"
            style={{ margin: '0 0 10px' }}
          >
            导入
          </Button>
        </Upload>
      </Modal>

      <Modal
        title={'系统工具'}
        centered
        visible={toolsDisabled}
        footer={null}
        width={1250}
        //    style={{maxHeight: (props.height || modalHeight) + 'px', height: (props.height || modalHeight) + 'px'}}
        style={{ maxHeight: modalHeight + 'px', height: modalHeight + 'px' }}
        onCancel={() => setToolsDisabled(false)}
      >
        <div style={{ height: '500px' }}>
          <EpsUploadSimple
            title={'系统工具'}
            ref={ref}
            uploadProp={uploadProp} //附件上传prop
            width={1250}
            source={fjsource}
            params={{
              docTbl: 'ATTACHDOC',
              docGrpTbl: 'DOCGROUP',
              grpid: XtStore.filegre,
              docTblXt: 'ATTACHDOC',
              idvs: JSON.stringify({ xtid: XtStore.xtid }),
              wrkTbl: 'XT',
              lx: null,
              atdw: 'DEFAULT',
              tybz: 'N',
              whr: yhmc,
              whsj: getDate,
              fjsctrue: XtStore.fjsc,
            }} //附件上传参数
            tableProp={uploadtableProp} //附件列表prop
            tableService={xtfjService} //附件列表server
            tableparams={{
              doctbl: 'ATTACHDOC',
              grptbl: 'DOCGROUP',
              grpid: XtStore.filegre,
              sfzxbb: '1',
              lx: null,
              ordersql: 'N',
            }} //附件列表参数
            grpid={XtStore.filegre} //附件列表参数
          ></EpsUploadSimple>
        </div>
      </Modal>
    </>
  );
});

export default Xt;
