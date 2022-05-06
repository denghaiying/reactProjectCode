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
  FileAddOutlined,
} from '@ant-design/icons';
import KpiruleService from './Service/KpiruleService';
import ProjectService from './Service/ProjectService';
import { findDOMNode } from 'react-dom';
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
const Kpirule = observer(() => {
  //权限按钮
  const umid = 'DPS005';
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
  //右侧绑定数据
  const [selectData, setSelectData] = useState([]);
  //项目数据
  const [projectData, setProjectData] = useState([]);
  //工序数据
  const [processData, setProcessData] = useState([]);
  const [workcttData, setWorkcttData] = useState([]);
  //弹窗中项目搜索框中项目名称
  const [xmmcData, setXmmcData] = useState('');
  //仅显示我我负责的项目
  const [currentUserIsChecked, setCurrentUserIsChecked] = useState(false);
  //获取当前用户名称
  const whrid = SysStore.getCurrentUser().id;

  const userinfo = SysStore.getCurrentUser();

  useEffect(() => {
    KpiruleService.findAllWorkData().then((data) => {
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

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '工序',
      code: 'processName',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '公式',
      code: 'formula',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '启用',
      code: 'enable',
      align: 'center',
      formType: EpsFormType.Input,
      width: 50,
      render: (text, record, index) => {
        return <Checkbox checked={text === 'Y' ? true : false} />;
      },
      // render: (value) => {
      //     if (value === 'Y') {
      //         return '启用';
      //     } else {
      //         return '关闭';
      //     }
      // },
    },
    {
      title: '备注',
      code: 'remark',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
      render: (value) => value && moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  // 弹窗中项目信息列表
  const tableProp: ITable = {
    searchCode: 'xmmc',
    tableSearch: false,
    disableCopy: true,
    disableAdd: true,
    disableEdit: true,
    disableDelete: !OptrightStore.hasRight(umid, 'SYS104'),
    rowSelection: {
      type: 'radio',
    },
  };
  //绩效规则定义查询按钮
  const onQueryDataClick = () => {
    form.validateFields().then((value) => {
      const tableStore = ref.current?.getTableStore();
      tableStore.findByKey(tableStore.key, 1, tableStore.size, value);
    });
  };

  const onXmidClick = (val) => {
    // proform.setFieldsValue({ mgner: true });
    setProjectVisable(true);
    onProjectDataClick();
  };

  const customAction = () => {
    return [
      <>
        <Form
          name="advanced_search"
          form={form}
          // {...formItemLayout}
          className="ant-advanced-search-form"
        >
          <Row>
            <Col>
              <Form.Item
                name="xmmc"
                label="项目名称："
                // rules={[{ required: true, message: '请选择项目!' }]}
                className="ant-form-item"
              >
                <Input.Search
                  readOnly
                  placeholder="请选项目"
                  style={{ width: 300 }}
                  onSearch={(val) => onXmidClick(val)}
                />
              </Form.Item>
            </Col>
            <Col>
              {OptrightStore.hasRight(umid, 'SYS102') && (
                <Button
                  type="primary"
                  // style={{ marginLeft: 60 }}
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
                  //  style={{ marginLeft: 3 }}
                  onClick={onaddClick}
                >
                  <FileAddOutlined />
                  新建
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
      const tableStore = ref.current?.getTableStore();
      values.projectId = editrecord.projectId;
      if (type === 'add') {
        KpiruleService.findAll({
          projectId: values.projectId,
          processId: values.processId,
        }).then((response) => {
          if (response.status == 200 && response.data.length == 0) {
            KpiruleService.saveByKey(tableStore.key, values).then(() => {
              tableStore.findByKey(tableStore.key, 1, tableStore.size, {});
              setVisable(false);
              addform.resetFields();
            });
          } else {
            message.info('此项目的工序已存在绩效计算公式，无法再次新增！');
          }
        });
      } else {
        values.id = editrecord.id;
        KpiruleService.updateForTable(values).then(() => {
          tableStore.findByKey(tableStore.key, 1, tableStore.size, {});
          setVisable(false);
          addform.resetFields();
        });
      }
    });
  };
  //选中的工作内容
  const ondblclick = (record) => {
    const formula = addform.getFieldValue('formula');
    if (formula) {
      const props = document.getElementById('formulaid');
      if (props) {
        const position = getPositionForInput(props);
        const start = formula.substring(0, position.start);
        const end = formula.substring(position.end);
        const value = start + record.code + end;
        addform.setFieldsValue({ formula: value });
        message.info('替换成功！');
      }
    } else {
      addform.setFieldsValue({ formula: record.code });
    }
  };
  const onRow = (record) => {
    return {
      onDoubleClick: () => ondblclick(record),
    };
  };
  //工序选择框改变
  const onProcessChange = (value) => {
    const workctts = workcttData.filter((f) => f.id == value);
    if (workctts.length > 0) {
      const workctt = workctts[0]['workctt'];
      const datas = workData.filter((f) => workctt.indexOf(f.code) != -1);
      setSelectData(datas);
    }
  };
  const onCustomCancel = () => {
    setVisable(false);
    addform.resetFields();
  };
  const getPositionForInput = (ctrl) => {
    // 获取光标位置
    let CaretPos = {
      start: 0,
      end: 0,
    };
    if (ctrl.selectionStart) {
      // Firefox support
      CaretPos.start = ctrl.selectionStart;
    }
    if (ctrl.selectionEnd) {
      CaretPos.end = ctrl.selectionEnd;
    }
    return CaretPos;
  };

  const customForm = (
    <Modal
      title={`绩效规则定义【${type === 'add' ? '新增' : '编辑'}】`}
      visible={visable}
      onCancel={onCustomCancel}
      onOk={onSave}
      width={800}
    >
      <Form
        name="advanced_search"
        form={addform}
        {...formItemLayout}
        className="ant-advanced-search-form"
      >
        <Row>
          {/* <Col span={12}>
                        <Form.Item rules={[{ required: true, message: '项目编号不允许为空!' }]} name="xmid" label="项目编号：" className="ant-form-item">
                            <Input.Search
                                allowClear
                                onSearch={onXmidClick}
                            />
                        </Form.Item>

                    </Col> */}
          <Col span={12}>
            <Form.Item
              rules={[{ required: true, message: '项目名称不允许为空!' }]}
              name="xmmc"
              label="项目名称："
              className="ant-form-item"
            >
              <Input.Search
                readOnly
                allowClear
                onSearch={(val) => onXmidClick(val)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              rules={[{ required: true, message: '工序不允许为空!' }]}
              name="processId"
              label="工序："
              className="ant-form-item"
            >
              <Select
                allowClear
                options={processData}
                onChange={onProcessChange}
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row>
           
                </Row> */}
        <Row>
          <Col span={12}>
            <Form.Item
              rules={[{ required: true, message: '公式不允许为空!' }]}
              name="formula"
              label="公式："
              className="ant-form-item"
            >
              <Input.TextArea
                id="formulaid"
                style={{ height: 300 }}
                allowClear
                placeholder="例如：[0070]*0.10+[0080]*0.20，0070,0080代表工作内容的编号"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Table
              bordered
              scroll={{ x: 'max-content', y: 260 }}
              rowKey="code"
              dataSource={selectData}
              size="small"
              onRow={onRow}
            >
              <Table.Column
                dataIndex="code"
                title="编号"
                width={100}
                align="center"
              />
              <Table.Column
                dataIndex="name"
                title="名称"
                width={100}
                align="center"
              />
            </Table>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name="remark" label="备注：" className="ant-form-item">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name="whr" label="维护人：" className="ant-form-item">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="whsj" label="维护时间：" className="ant-form-item">
              <DatePicker showTime disabled />
            </Form.Item>
          </Col>
        </Row>
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
  const onaddClick = () => {
    addform.setFieldsValue({
      whr: userinfo.yhmc,
      whrid: userinfo.id,
      whsj: moment(),
    });
    setType('add');
    setSelectData([]);
    setVisable(true);
    setProcessData([]);
  };
  const onEditClick = (record, index, store) => {
    KpiruleService.findAllProcessData({}).then((record) => {
      const list = [];
      record.forEach((element) => {
        list.push({ label: element.name, value: element.id });
      });
      setProcessData(list);
    });
    if (record.whsj) {
      record.whsj = moment(record.whsj);
    }
    addform.setFieldsValue(record);
    setEditrecord(record);
    setType('edit');
    setVisable(true);
  };
  //双击回填值
  const ondprojectblclick = (record) => {
    setProjectVisable(false);
    addform.setFieldsValue({ formula: '' });
    if (visable) {
      const { xmid, xmmc, id } = record;
      addform.setFieldsValue({ xmid, xmmc });
      editrecord.projectId = id;
      setEditrecord(editrecord);
      KpiruleService.findAllProcessData({ worktplId: record.worktplId }).then(
        (data) => {
          const list = [];
          data.forEach((element) => {
            list.push({ label: element.name, value: element.id });
          });
          setProcessData(list);
          setWorkcttData(data);
        },
      );
    } else {
      form.setFieldsValue(record);
    }
    addform.setFieldsValue({ processId: '' });
    setSelectData([]);
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
      className="kpirule"
      title={'项目名称'}
      visible={projectVisable}
      onCancel={() => setProjectVisable(false)}
      width={600}
      bodyStyle={{ height: 500 }}
      footer={false}
    >
      {customActiontk}
      <Table
        id={'modal-table'}
        columns={projectSource}
        bordered
        scroll={{ y: 400 }}
        //  scroll={{ x: 'max-content', y: 300 }}
        rowKey="id"
        dataSource={projectData}
        // size="small"
        onRow={onprojectRow}
      />
    </Modal>
  );

  const customTableAction = (
    text: any,
    record: any,
    index: any,
    store: any,
  ) => {
    return [
      <Tooltip title="编辑">
        {OptrightStore.hasRight(umid, 'SYS103') && (
          <Button
            size="small"
            style={{ fontSize: '12px' }}
            type="primary"
            shape="circle"
            icon={<FundViewOutlined />}
            onClick={() => onEditClick(record, index, store)}
          />
        )}
      </Tooltip>,
    ];
  };

  return (
    <>
      {/* <div> */}
      {/* <div style={{ height: 600 }}> */}
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={KpiruleService} // 右侧表格实现类，必填
        customAction={customAction}
        customTableAction={customTableAction}
        ref={ref}
        formWidth={500}
      />
      {/* </div> */}
      {projectVisable && projectDialog}
      {visable && customForm}
      {/* </div> */}
    </>
  );
});
export default Kpirule;
