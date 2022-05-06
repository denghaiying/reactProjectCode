import React, { useEffect, useRef, useState } from 'react';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import { observer } from 'mobx-react';
import {
  Checkbox,
  Col,
  Tooltip,
  DatePicker,
  Form,
  Input,
  Table,
  message,
  Modal,
  Button,
  Row,
  Select,
} from 'antd';
import {
  SmileOutlined,
  FundViewOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import MonkpimngService from './Service/MonkpimngService';
import ProjectService from './Service/ProjectService';
import './index.scss';
import moment from 'moment';
import SysStore from '@/stores/system/SysStore';
import OptrightStore from '@/stores/user/OptrightStore';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
/**
 * @author tyq
 * @description 绩效计算规则定义
 */
const Monkpimng = observer(() => {
  //权限按钮
  const umid = 'DPS024';
  OptrightStore.getFuncRight(umid);
  //绩效计算规则定义查询表单
  const ref = useRef();
  const [form] = Form.useForm();
  const [addform] = Form.useForm();
  const [proform] = Form.useForm();
  const [projectVisable, setProjectVisable] = useState(false);
  const [editrecord, setEditrecord] = useState({});
  //主页面新增、编辑框
  const [visable, setVisable] = useState(false);
  const [type, setType] = useState('add');
  //工作内容数据
  const [workData, setWorkData] = useState([]);
  //项目数据
  const [projectData, setProjectData] = useState([]);
  //工序数据
  const [processData, setProcessData] = useState([]);
  //弹窗中项目搜索框中项目名称
  const [xmmcData, setXmmcData] = useState('');
  //仅显示我我负责的项目
  const [currentUserIsChecked, setCurrentUserIsChecked] = useState(false);
  //获取当前用户名称
  const whrid = SysStore.getCurrentUser().id;
  //用户数据
  const [yhData, setYhData] = useState([]);
  const [source, setSource] = useState([]);

  const userinfo = SysStore.getCurrentUser();

  useEffect(() => {
    MonkpimngService.findYhAll({}).then((data) => {
      if (data) {
        setYhData(data);
      }
    });
    MonkpimngService.findAllWorkData().then((data) => {
      setWorkData(data);
    });
    ProjectService.findAllProjectData({}).then((data) => {
      setProjectData(data);
    });
  }, []);

  // 表单名称
  const title: ITitle = {
    name: '绩效计算规则定义',
  };

  // 弹窗中项目信息列表
  const tableProp: ITable = {
    searchCode: 'xmmc',
    tableSearch: false,
    disableCopy: true,
    disableAdd: true,
    disableEdit: true,
    disableDelete: true,
    disableIndex: false,
  };
  //绩效规则定义查询按钮
  const onQueryDataClick = () => {
    form.validateFields().then((value) => {
      const tableStore = ref.current?.getTableStore();
      tableStore
        .findByKey(tableStore.key, 1, tableStore.size, value)
        .then((data) => {});
    });
  };

  const onXmidClick = () => {
    // proform.setFieldsValue({ mgner: true });
    setProjectVisable(true);
    onProjectDataClick();
  };
  //计算按钮事件
  const onJsClick = () => {
    addform.setFieldsValue({
      whr: userinfo.yhmc,
      whrid: userinfo.id,
      whsj: moment(),
    });
    setVisable(true);
  };

  const customAction = () => {
    return [
      <>
        <Form
          name="advanced_search"
          form={form}
          //  {...formItemLayout}
          className="ant-advanced-search-form"
        >
          <Row>
            <Col>
              <Form.Item
                name="xmmc"
                label="项目名称："
                rules={[{ required: true, message: '请选择项目!' }]}
                className="ant-form-item"
              >
                <Input.Search
                  allowClear
                  style={{ width: 300 }}
                  onSearch={onXmidClick}
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                rules={[{ required: true, message: '年度不允许为空!' }]}
                name="year"
                label="年度："
                className="ant-form-item"
              >
                <Input allowClear style={{ width: 100 }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                rules={[{ required: true, message: '月份不允许为空!' }]}
                name="month"
                label="月份："
                className="ant-form-item"
              >
                <Input allowClear style={{ width: 100 }} />
              </Form.Item>
            </Col>

            <Col>
              {OptrightStore.hasRight(umid, 'SYS102') && (
                <Button
                  type="primary"
                  style={{ fontSize: '12px', marginLeft: 10 }}
                  icon={<SmileOutlined />}
                  onClick={onQueryDataClick}
                >
                  查询
                </Button>
              )}
            </Col>
            <Col>
              {OptrightStore.hasRight(umid, 'SYS101') && (
                <Button
                  type="primary"
                  //  style={{ fontSize: '12px', marginLeft: 10 }}
                  icon={<SmileOutlined />}
                  onClick={onJsClick}
                >
                  计算
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </>,
    ];
  };
  //新增、编辑保存
  const onSave = () => {
    addform.validateFields().then((values) => {
      values.projectId = editrecord.projectId;
      MonkpimngService.saveByKey(values)
        .then((res) => {
          if (res.status == 201) {
            message.info('计算成功！');
            BindingProcessData(res.data.worktplId);
            form.setFieldsValue(values);
            onQueryDataClick();
          }
        })
        .catch((reason) => {
          if (reason.response && reason.response.status == 400) {
            message.error('出现错误：' + reason.response.data);
          } else {
            message.error('出现错误：' + reason);
          }
        });
      setVisable(false);
      addform.resetFields();
    });
  };
  const customForm = (
    <Modal
      title={`绩效管理`}
      visible={visable}
      onCancel={() => setVisable(false)}
      onOk={onSave}
      width={500}
      bodyStyle={{ height: 180 }}
    >
      <Form
        name="advanced_search"
        labelCol={{ span: 6 }}
        form={addform}
        className="ant-advanced-search-form"
      >
        <Col>
          <Form.Item
            rules={[{ required: true, message: '项目名称不允许为空!' }]}
            name="xmmc"
            label="项目名称："
            className="ant-form-item"
          >
            <Input.Search
              readOnly
              allowClear
              onSearch={onXmidClick}
              style={{ width: 300 }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            rules={[{ required: true, message: '年度不允许为空!' }]}
            name="year"
            label="年度："
            className="ant-form-item"
          >
            <Input allowClear style={{ width: 300 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            rules={[{ required: true, message: '月份不允许为空!' }]}
            name="month"
            label="月份："
            className="ant-form-item"
          >
            <Input allowClear style={{ width: 300 }} />
          </Form.Item>
        </Col>
        <Col hidden>
          <Form.Item
            hidden
            name="whr"
            label="维护人："
            className="ant-form-item"
          >
            <Input disabled style={{ width: 300 }} />
          </Form.Item>
        </Col>
        <Col hidden>
          <Form.Item
            hidden
            name="whsj"
            label="维护时间："
            className="ant-form-item"
          >
            <DatePicker showTime disabled style={{ width: 300 }} />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );

  // 定义table表格字段
  const projectSource = [
    {
      title: '项目名称',
      dataIndex: 'xmmc',
      align: 'center',
      width: 100,
    },
  ];
  /**
   * 项目数据查询
   */
  const onProjectDataClick = () => {
    const params = {};
    proform.validateFields().then((values) => {
      if (values.xmmc) {
        params['xmmc'] = values.xmmc;
      }
      if (values.mgner) {
        params['mgner'] = userinfo.id;
      }
      ProjectService.findAllProjectData(params).then((data) => {
        setProjectData(data);
      });
    });
  };
  //弹窗中项目搜索
  const onxmtableSearch = (value) => {
    ProjectService.findAllProjectData({
      mgner: currentUserIsChecked ? whrid : null,
      xmmc: value,
    }).then((data) => {
      setProjectData(data);
    });
  };
  //仅显示我负责的项目
  const fzxmOnchange = (record) => {
    if (record.target.checked) {
      setCurrentUserIsChecked(true);
      ProjectService.findAllProjectData({ mgner: whrid, xmmc: xmmcData }).then(
        (data) => {
          setProjectData(data);
        },
      );
    } else {
      setCurrentUserIsChecked(false);
      ProjectService.findAllProjectData({ xmmc: xmmcData }).then((data) => {
        setProjectData(data);
      });
    }
  };

  //弹窗搜索表单
  const customActiontk = (
    <Form id="modal-table-seach-form">
      <Row>
        <Col>
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => onxmtableSearch(val)}
              onChange={(record) => {
                setXmmcData(record.target.value);
              }}
              style={{ width: 300 }}
              placeholder="请输入项目名称"
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Checkbox onChange={(record) => fzxmOnchange(record)}>
              仅显示我负责的项目
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
  //双击回填值
  const ondprojectblclick = (record) => {
    setProjectVisable(false);
    ///弹窗查询
    if (visable) {
      const { xmid, xmmc, id } = record;
      addform.setFieldsValue({ xmid, xmmc });
      editrecord.projectId = id;
      setEditrecord(editrecord);
    } else {
      //主页面查询
      form.setFieldsValue(record);
      BindingProcessData(record.worktplId);
    }
  };

  const BindingProcessData = (worktplId) => {
    MonkpimngService.findAllProcessData({ worktplId }).then((data) => {
      const list = [
        {
          title: '名称',
          code: 'yhmc',
          align: 'center',
          formType: EpsFormType.Input,
          width: 100,
          render: (text: string) => {
            console.log(text.replace('"', '').replace('"', ''));
            return yhData[text.replace('"', '').replace('"', '')] || text;
          },
        },
      ];
      data.forEach((element) => {
        list.push({
          title: element.name,
          code: element.id,
          align: 'center',
          formType: EpsFormType.Input,
          width: 100,
        });
      });
      setProcessData(data);
      setSource(list);
    });
  };

  const onprojectRow = (record) => {
    return {
      onDoubleClick: () => ondprojectblclick(record),
    };
  };
  /**
   * 查询弹窗
   */
  const projectDialog = (
    <Modal
      className="monkpimng"
      title={'项目名称'}
      visible={projectVisable}
      onCancel={() => setProjectVisable(false)}
      width={600}
      bodyStyle={{ height: 500 }}
      footer={false}
    >
      {customActiontk}
      <Table
        columns={projectSource}
        bordered
        scroll={{ y: 400 }}
        // scroll={{ x: 'max-content', y: 300 }}
        rowKey="id"
        dataSource={projectData}
        // size="small"
        onRow={onprojectRow}
      />
    </Modal>
  );

  return (
    <>
      {/* <div> */}
      {/* <div style={{ height: 600 }}> */}
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={MonkpimngService} // 右侧表格实现类，必填
        customAction={customAction}
        ref={ref}
        tableAutoLoad={false}
      />
      {/* </div> */}
      {projectVisable && projectDialog}
      {visable && customForm}
      {/* </div> */}
    </>
  );
});
export default Monkpimng;
