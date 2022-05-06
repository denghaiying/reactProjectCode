import React, { useEffect, useState } from 'react';
import './Fwstart.less';
import {
  Form,
  Input,
  Button,
  Upload,
  Tabs,
  Divider,
  message,
  Tree,
  TreeSelect,
  Dropdown,
  Menu,
  Tooltip,
  Modal,
} from 'antd';
import { Select } from 'antd';
import { Radio } from 'antd';
import { Tag } from 'antd';
import { DatePicker, Space, Row, Col } from 'antd';
import SysStore from '../../../../stores/system/SysStore';
import { observer } from 'mobx-react';
import cookie from 'react-cookies';
import WflwButtons, { WflwLog } from '@/components/Wflw';
import {
  ExclamationCircleOutlined,
  MenuOutlined,
  ReadOutlined,
  SmileOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import moment, { isMoment } from 'moment';
import DoctypeService from '../../Doctype/Service/DoctypeService';
import { Wps } from '../WPS/wps-ext';
import OrgStore from '../../../../stores/system/OrgStore';
import FwService from '../../Gwzx/Service/FwService';
import FwStore from '@/stores/gwgl/FwStore';

const { TextArea } = Input;

const { Option } = Select;

function onChange(value) {
  console.log('changed', value);
}

const { Search } = Input;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const formItemLayout2 = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const formItemLayout3 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const Fwstart = observer((props) => {
  const {
    match: { params: params },
  } = props;

  const { editRecord, opt } = FwStore;

  //部门树形数据
  const [treeDataBM, setTreeDataBM] = useState([]);
  //附件list
  const [fjfileList, setFjfileList] = useState<any[]>([]);

  const [leftdisplay, setLeftdisplay] = useState('block');

  const [rightdisplay, setRightdisplay] = useState('block');
  //密级
  const [mjData, setMjData] = useState([]);
  //用户
  const [yhData, setYhData] = useState([]);

  //展示的方式。1是左右两变展示，2是左边全部。3是右边全部
  const [displayIndex, setDisplayIndex] = useState(1);
  //公文种类
  const [doctypeData, setDoctypeData] = useState([]);
  //tab的激活key
  const [tabKey, setTabkey] = useState<string>('1');

  const [wflwType, setWflwType] = useState([
    'submit',
    'return',
    'reject',
    'logview',
  ]);

  // 获取当前用户名称和维护时间
  const userinfo = SysStore.getCurrentUser();
  const whr = userinfo.yhmc;
  const whrid = userinfo.id;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');
  const date = moment().format('YYYYMMDD');

  const [refform] = Form.useForm();

  //   穿梭框
  useEffect(() => {
    console.log('props', props);
    WPSInit();
    initValues(params.wfinst);
    InitMouseEvent();
    InitOrgAndYh();
  }, []);

  const InitOrgAndYh = () => {
    OrgStore.queryDwOrgTree()
      .then(() => {
        setTreeDataBM(OrgStore.orgData);
        console.log(OrgStore.orgData);
      })
      .catch((error) => {
        message.error(`${error}`);
      });
    FwService.queryForYh('P')
      .then((data) => {
        console.log(data);
        setYhData(data);
      })
      .catch((error) => {
        message.error(`${error}`);
      });
    DoctypeService.findAllData({})
      .then((data) => {
        setDoctypeData(data);
      })
      .catch((error) => {
        message.error(`${error}`);
      });
    FwService.querySjzdMx('SJZD019')
      .then((data) => {
        console.log(data);
        setMjData(data);
      })
      .catch((error) => {
        message.error(`${error}`);
      });
  };

  const startDoc = () => {
    try {
      wpsExt.apis.newDoc();
    } catch (e) {
      setTimeout(startDoc, 500);
    }
  };

  const WPSInit = () => {
    const dom = document.querySelector('#wps');
    if (!dom) {
      return;
    }
    const wps1 = Wps.createNew(dom);
    window.wpsExt = wps1;

    setTimeout(startDoc, 500);
  };
  const onTitleChange = (e) => {
    if (e.target.value) {
      try {
        wpsExt.apis.setBookmarkValue({
          bookmarkName: 'title',
          bookmarkValue: e.target.value,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onMjChange = (value) => {
    if (value) {
      try {
        wpsExt.apis.setBookmarkValue({
          bookmarkName: 'mj',
          bookmarkValue: value,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const initValues = (wfinst) => {
    //代表是从代办进来的
    if (wfinst) {
      FwStore.findByWfinst(wfinst)
        .then((data) => {
          const { fwrq, whsj, ...values } = data;
          if (fwrq) {
            values.fwrq = moment(fwrq);
          }
          if (whsj) {
            values.whsj = moment(whsj);
          }
          //通过edit判断是否可以编辑，edit在流程域同步里配置
          FwStore.showEditForm(values.edit === '1' ? 'edit' : 'view', values);
          refform.setFieldsValue(values);
          FwService.queryfiles(values.id)
            .then((data: any) => {
              //type，2正文，1附件
              if (data.length === 0) {
                console.log('此流程无文件！');
                return;
              }
              const fjlist = [];
              data.forEach((element) => {
                if (element.type === '1') {
                  const values = {
                    uid: element.id,
                    name: element.filename,
                    status: 'done',
                    response: 'Server Error 500', // custom error message to show
                    url: `/api/eps/gwgl/fw/download/${encodeURI(
                      element.filename,
                    )}?fileid=${element.id}`,
                  };
                  fjlist.push(values);
                } else {
                  try {
                    wpsExt.apis.openRemoteDoc({
                      url: `http://${
                        location.host
                      }/api/eps/gwgl/fw/download/${encodeURI(
                        element.filename,
                      )}?fileid=${element.id}&token=${cookie.load('ssotoken')}`,
                      readOnly: values.edit === '0',
                    });
                  } catch (error) {
                    console.log('打开正文失败', error);
                  }
                }
              });
              setFjfileList(fjlist);
            })
            .catch((error) => {
              message.error(`${error}`);
            });
        })
        .catch((error) => {
          message.error(`${error}`);
        });
    } else {
      //代表是新增
      const values = {
        id: `FW${moment().format('YYYYMMDDHHmmssSSS')}`,
        jjcd: '1',
        fwrq: moment(),
        fwh: `FWH-${date}`,
        ngrid: userinfo.id,
        ngr: userinfo.yhmc,
        ngbmid: userinfo.bmid,
        whrid: userinfo.id,
        whr: userinfo.yhmc,
        whsj: moment(),
        fenfa: userinfo.bmid,
        zhusong: userinfo.yhmc,
        zhusongbmid: userinfo.bmid,
        chaosong: userinfo.yhmc,
        chaosongbmid: userinfo.bmid,
        cjrid: userinfo.id,
        cjr: userinfo.yhmc,
      };
      refform.setFieldsValue(values);
      FwStore.showEditForm('add', values);
      console.log(values);
    }
  };

  const InitMouseEvent = () => {
    const rightdom = document.getElementById('wpsContainer');
    rightdom?.addEventListener('mouseleave', onRightMouseEnter);
  };

  const onLeftClick = () => {
    switch (displayIndex) {
      case 1:
        setDisplayIndex(3);
        break;
      case 2:
        setDisplayIndex(1);
        break;
      default:
        break;
    }
    console.log('onLeftClick');
  };

  const onRightClick = () => {
    switch (displayIndex) {
      case 1:
        setDisplayIndex(2);
        break;
      case 3:
        setDisplayIndex(1);
        break;
      default:
        break;
    }
    console.log('onRightClick');
  };
  const onBeforeWfAction = (action) => {
    return true;
  };

  const onAfterWfAction = (data) => {
    window.close();
  };
  //保存数据
  const onSaveDataClick = () => {
    refform.validateFields().then(() => {
      try {
        wpsExt.apis.saveToRemote({
          url: `http://${location.host}/api/eps/gwgl/fw/upload?fid=${
            editRecord.id
          }&token=${cookie.load('ssotoken')}&type=2&whr=${encodeURI(
            whr,
          )}&whrid=${whrid}&action=${opt}`,
        });
      } catch (error) {
        message.error(`正文上传失败，原因是：${error}`);
        return;
      }
      console.log('editRecord', FwStore.editRecord);
      const { fwrq, whsj, ...values } = FwStore.editRecord;
      if (fwrq && isMoment(fwrq)) {
        values.fwrq = fwrq.format('YYYY-MM-DD');
      }
      if (whsj && isMoment(whsj)) {
        values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
      }
      //流程状态新增为1，之后根据流程审批自动同步字段值
      values.status = '1';
      //edit为1代表允许编辑，为0不可编辑
      values.edit = '1';
      FwStore.saveFWData(opt, values)
        .then((data: any) => {
          if (opt === 'add') {
            initValues(data.wfinst);
          } else {
            initValues(values.wfinst);
          }
          message.success('保存成功！');
        })
        .catch((error) => {
          console.log(error);
          message.error(`请求失败原因是，${error}`);
        });
    });
  };
  /**
   * 归档
   */
  const onGuiDangClick = () => {};

  const handleCloseConfirm = () => {
    window.close();
  };
  const handleDeletecOk = () => {
    FwService.deleteForTable(editRecord)
      .then(() => {
        Modal.confirm({
          title: '信息确认',
          icon: <ExclamationCircleOutlined />,
          content: '此流程已删除，关闭页面',
          okText: '确定',
          okType: 'danger',
          onOk: () => handleCloseConfirm(),
          cancelButtonProps: {
            style: { display: 'none' },
          },
        });
      })
      .catch((error) => {
        message.error(`${error}`);
      });
  };

  /**
   * 删除
   */
  const onClickDelete = () => {
    Modal.confirm({
      title: '确定要删除该流程么?',
      icon: <ExclamationCircleOutlined />,
      content: '流程删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => handleDeletecOk(),
      onCancel: () => Modal.destroyAll(),
    });
  };

  const fjprops = {
    name: 'file',
    action: `/api/eps/gwgl/fw/upload`,
    headers: {
      authorization: 'authorization-text',
    },
    onChange: ({ file, fileList }) => {
      if (file.status === 'done') {
        const data = file.response;
        const values = {
          uid: data.id,
          name: data.filename,
          status: 'done',
          response: 'Server Error 500', // custom error message to show
          url: `/api/eps/gwgl/fw/download/${encodeURI(data.filename)}?fileid=${
            data.id
          }`,
        };
        const list = fileList.slice(0, fileList.length - 1);
        console.log(list, values);
        setFjfileList([...list, values]);
        message.success(`${file.name} 文件上传成功！`);
        return;
      } else if (file.status === 'error') {
        const list = fileList.splice(fileList.length - 1, 1);
        setFjfileList([...list]);
        message.error(`${file.name} 文件上传失败.`);
        return;
      }
      console.log(file, fileList);
      setFjfileList([...fileList]);
    },
    multiple: true,
    onRemove: (file) => {
      FwService.deleteFile(file.uid)
        .then(() => {
          return true;
        })
        .catch((error) => {
          message.error(`删除文件出现错误，原因是：${error}`);
          return false;
        });
    },
    data: { type: '1', fid: editRecord.id, whr: whr, whrid: whrid },
    fileList: fjfileList,
  };
  const onLeftMouseLeave = () => {
    setLeftdisplay('block');
  };
  const onLeftMouseEnter = () => {
    setLeftdisplay('block');
  };
  const onRightMouseLeave = () => {
    console.log('onRightMouseLeave');
    setRightdisplay('block');
  };
  const onRightMouseEnter = () => {
    console.log('onRightMouseEnter');
    setRightdisplay('block');
  };
  //选择事件改变时赋值
  const onSelect = (value, node, extra) => {
    console.log('node', node);
    FwStore.setRecordValue('ngbm', node.title);
  };
  //拟稿人
  const onNGRChange = (value, option) => {
    if (value) {
      FwStore.setRecordValue('ngr', option.yhmc);
    }
  };

  const onChaosongSelect = (value, node, extra) => {
    if (value) {
      FwStore.setRecordValue('chaosong', node.title);
    }
  };

  const onZhusongSelect = (value, node, extra) => {
    if (value) {
      FwStore.setRecordValue('zhusong', node.title);
    }
  };

  const onJdrChange = (value, node, extra) => {
    if (value) {
      FwStore.setRecordValue('jdr', node.title);
    }
  };

  const onDoctypeChange = (value, option) => {
    try {
      if (value) {
        FwStore.setRecordValue('doctypename', option.name);
      }
      if (!option.modulefilename || option.modulefilename === '') {
        message.warning('此公文种类无模板，请先在公文种类功能里上传模板!');
        return;
      }
      wpsExt.apis.openRemoteDoc({
        url: `http://${location.host}/api/eps/gwgl/doctype/download/${encodeURI(
          option.modulefilename,
        )}?id=${option.id}&token=${cookie.load('ssotoken')}`,
      });
      message.success('模板加载成功！');
    } catch (error) {
      message.error('文件打开失败，原因是：' + error);
    }
  };
  const onValuesChange = (value) => {
    const values = { ...editRecord, ...value };
    FwStore.onRecordChange(values);
  };
  const onFwhClick = () => {
    refform.setFieldsValue({ fwh: `FWH-${date}` });
  };
  const zhuluPage = (opt: string) => {
    return (
      <>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div
            className="wf-req-form-left-shrink"
            style={{ display: `${leftdisplay}` }}
            onClick={onLeftClick}
          />
          <div>
            <div className="fwleftnei">
              <Form
                form={refform}
                {...formItemLayout}
                onValuesChange={onValuesChange}
                style={{ backgroundColor: '#fce9e8' }}
              >
                <Row>
                  <Col span={24}>
                    <Form.Item
                      required
                      rules={[{ required: true, message: '请选择紧急程度' }]}
                      label="紧急程度"
                      name="jjcd"
                    >
                      <Radio.Group
                        disabled={opt === 'view'}
                        style={{ backgroundColor: 'white' }}
                      >
                        <Radio value="1">
                          <Tag color="success">正常</Tag>
                        </Radio>
                        <Radio value="2">
                          <Tag color="processing">重要</Tag>
                        </Radio>
                        <Radio value="3">
                          <Tag color="warning">紧急</Tag>
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      {...formItemLayout2}
                      label="公文种类"
                      name="doctypeId"
                      required
                      rules={[{ required: true, message: '请选择公文种类' }]}
                    >
                      <Select
                        placeholder="请选择公文种类"
                        fieldNames={{ label: 'name', value: 'id' }}
                        options={doctypeData}
                        onChange={onDoctypeChange}
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...formItemLayout3}
                      label="校对人"
                      name="jdrid"
                      required
                      rules={[{ required: true, message: '请选择校对人' }]}
                    >
                      <Select
                        placeholder="请选择校对人"
                        options={yhData}
                        fieldNames={{ label: 'yhmc', value: 'id' }}
                        onChange={onJdrChange}
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      required
                      rules={[{ required: true, message: '请输入标题' }]}
                      label="标题"
                      name="title"
                    >
                      <Input
                        placeholder="请输入标题"
                        onChange={onTitleChange}
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      required
                      rules={[{ required: true, message: '请输入发文号' }]}
                      label="发文号"
                      name="fwh"
                    >
                      <Input
                        placeholder="请输入发文号"
                        addonAfter={
                          <Button type="text" onClick={onFwhClick}>
                            重新生成编号
                          </Button>
                        }
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={12}>
                    <Form.Item
                      {...formItemLayout2}
                      required
                      rules={[{ required: true, message: '请选择拟稿部门' }]}
                      label="拟稿部门"
                      name="ngbmid"
                    >
                      <TreeSelect
                        treeDefaultExpandAll
                        onSelect={onSelect}
                        treeData={treeDataBM}
                        fieldNames={{ label: 'title' }}
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...formItemLayout3}
                      label="拟稿人"
                      name="ngrid"
                      required
                      rules={[{ required: true, message: '请选择拟稿人' }]}
                    >
                      <Select
                        placeholder="请选择拟稿人"
                        options={yhData}
                        fieldNames={{ label: 'yhmc', value: 'id' }}
                        onChange={onNGRChange}
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      {...formItemLayout2}
                      label="发文日期"
                      name="fwrq"
                      required
                      rules={[{ required: true, message: '请选择发文日期' }]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...formItemLayout3}
                      label="秘密等级"
                      name="mj"
                      required
                      rules={[{ required: true, message: '请选择密级' }]}
                    >
                      <Select
                        placeholder="请选择秘密等级"
                        onChange={onMjChange}
                        options={mjData}
                        fieldNames={{ label: 'mc', value: 'mc' }}
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="主题词"
                      name="ztc"
                      required
                      rules={[{ required: true, message: '请输入主题词' }]}
                    >
                      <Input
                        placeholder="请输入主题词"
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="拟稿意见"
                      name="ngyj"
                      required
                      rules={[{ required: true, message: '请输入拟稿意见' }]}
                    >
                      <TextArea
                        showCount
                        maxLength={100}
                        onChange={onChange}
                        placeholder="请输入拟稿意见"
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      required
                      label="分发"
                      name="fenfa"
                      rules={[{ required: true, message: '请选择分发' }]}
                    >
                      <TreeSelect
                        placeholder="请选择主送单位"
                        treeDefaultExpandAll
                        treeData={treeDataBM}
                        fieldNames={{ label: 'title' }}
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="主送"
                      name="zhusongbmid"
                      rules={[{ required: true, message: '请选择主送单位' }]}
                    >
                      <TreeSelect
                        placeholder="请选择主送单位"
                        treeDefaultExpandAll
                        treeData={treeDataBM}
                        fieldNames={{ label: 'title' }}
                        onSelect={onZhusongSelect}
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label="抄送" name="chaosongbmid">
                      <TreeSelect
                        placeholder="请选择抄送单位"
                        treeDefaultExpandAll
                        treeData={treeDataBM}
                        fieldNames={{ label: 'title' }}
                        onSelect={onChaosongSelect}
                        disabled={opt === 'view'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label="附件（2G内）">
                      <Upload {...fjprops} disabled={opt === 'view'}>
                        <Button icon={<UploadOutlined />}>上传文件</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              {editRecord.wfinst && (
                <WflwLog
                  wfinst={editRecord.wfinst}
                  wfid={editRecord.wfid}
                  readonly={false}
                  value={FwStore.signcomment}
                  onChange={(v) => FwStore.setSigncomment(v)}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
  const wordPage = () => {
    return (
      <>
        <div className="fwmiddle">
          <div
            className="wf-req-form-right-shrink"
            style={{ display: `${rightdisplay}` }} //`${rightdisplay}`
            onClick={onRightClick}
          />
        </div>
        <div className="fwright">
          <div
            style={{
              width: '100%',
              height: '90vh',
              backgroundColor: 'white',
            }}
          >
            {/* <div style={{ width: '100%', height: '30px' }}>
              <Row>
                <Col>
                  <Button type="primary" onClick={onSaveClick}>
                    保存文件
                  </Button>
                </Col>
              </Row>
            </div> */}
            <div
              id="wpsContainer"
              style={{ height: '100%', position: 'relative', zIndex: 1 }}
            >
              <div
                id="wps"
                style={{
                  width: '100%',
                  height: 'calc(90vh - 30px)',
                  paddingRight: 2,
                  paddingTop: 4,
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  };
  const tabone = (key: string) => {
    return (
      <div
        className="fwmain"
        style={{
          width: key === '1' ? '100%' : 10,
          height: key === '1' ? '90vh' : 5,
        }}
      >
        <div
          className="fwleft"
          style={{
            width: displayIndex === 2 ? '100%' : '48%',
            display: displayIndex === 3 ? 'none' : 'block',
          }}
          onMouseLeave={onLeftMouseLeave}
          onMouseEnter={onLeftMouseEnter}
        >
          {zhuluPage(FwStore.opt)}
        </div>
        <div
          className="fwrightparent"
          onMouseLeave={onRightMouseLeave}
          onMouseEnter={onRightMouseEnter}
          style={{
            width:
              displayIndex === 3 ? '100%' : displayIndex === 1 ? '52%' : 10,
            height: displayIndex === 2 ? 10 : '100%',
            float: displayIndex === 3 ? 'left' : 'right',
          }}
        >
          {wordPage()}
        </div>
      </div>
    );
  };
  const extralActions = {
    left: (
      <div className="gw-logo">
        <Space>
          <ReadOutlined className="gw-tb" />
        </Space>
      </div>
    ),
    right: (
      <div style={{ width: 400 }}>
        <div style={{ marginRight: 20, float: 'right' }}>
          <Dropdown
            overlay={
              <Menu style={{ width: 100 }}>
                {editRecord.status === '1' && (
                  <Menu.Item onClick={onGuiDangClick} className="menu-item">
                    归档
                  </Menu.Item>
                )}
                <Menu.Item className="menu-item" onClick={onClickDelete}>
                  删除
                </Menu.Item>
              </Menu>
            }
            arrow={{ pointAtCenter: true }}
            placement="bottomRight"
          >
            <UnorderedListOutlined className="menuoutb" />
          </Dropdown>
        </div>
        {editRecord.wfinst && (
          <div style={{ marginRight: 10, float: 'right' }}>
            <WflwButtons
              offset={[18, 0]}
              type={wflwType}
              wfid={editRecord.wfid}
              wfinst={editRecord.wfinst}
              onBeforeAction={onBeforeWfAction}
              onAfterAction={onAfterWfAction}
              showmode="tile"
            />
          </div>
        )}
        {opt !== 'view' && (
          <Button
            style={{ float: 'right', marginRight: 10 }}
            type="primary"
            onClick={onSaveDataClick}
          >
            保存
          </Button>
        )}
      </div>
    ),
  };
  const onTabChange = (activeKey: string) => {
    setTabkey(activeKey);
  };
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={extralActions}
        onChange={onTabChange}
      >
        <Tabs.TabPane key="1" tab="  流程表单"></Tabs.TabPane>
        <Tabs.TabPane key="2" tab="流程审批">
          <div style={{ width: '100%', height: '90vh' }}></div>
        </Tabs.TabPane>
      </Tabs>
      <div style={{ display: 'flex', overflow: 'hidden' }}>
        {tabone(tabKey)}
      </div>
    </div>
  );
});
export default Fwstart;
