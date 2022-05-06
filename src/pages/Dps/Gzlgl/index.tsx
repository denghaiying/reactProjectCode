import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import { useEffect, useRef, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Button,
  Card,
  InputNumber,
} from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import GzlglService from '../Gzlgl/Service/GzlglService';
import moment from 'moment';
import fetch from '../../../utils/fetch';
import Search from 'antd/lib/input/Search';
import SysStore from '@/stores/system/SysStore';
import ProjectService from './Service/ProjectService';
import OptrightStore from '@/stores/user/OptrightStore';
import { FileAddOutlined } from '@ant-design/icons';
import './index.less';
import EpsForm from '@/eps/inner/form/EpsForm';
import EpsFormType from '@/eps/commons/EpsFormType';

/**
 * 工作量管理
 */
const Gzlgl = observer((props) => {
  //权限按钮
  const umid = 'DPS012';
  OptrightStore.getFuncRight(umid);
  //主页上方的搜索表单
  const [seachForm] = Form.useForm();
  //自定义新增按钮的表单
  const [addForm] = Form.useForm();
  //是否为新增
  const [isAdd, setIsAdd] = useState(false);
  //是否为编辑
  const [isEdit, setIsEdit] = useState(false);
  //控制项目弹框
  const [xmVisible, setxmvisible] = useState(false);
  //获取当前用户名称
  const whrid = SysStore.getCurrentUser().id;
  //项目数据
  const [projectData, setProjectData] = useState([]);
  //仅显示我我负责的项目
  const [currentUserIsChecked, setCurrentUserIsChecked] = useState(false);
  //弹窗中输入框项目名称
  const [xmmcData, setXmmcData] = useState('');
  //form表单值
  const [fm, setFm] = useState();
  //控制定义的新增表单是否可见
  const [addModalIsVisable, setAddModalIsVisable] = useState(false);

  // 工作量管理store
  const GzlglStore = useLocalObservable(() => ({
    yhAllData: [],
    yhLoginData: [],
    projectAllData: [],
    projectIdData: [],
    wkprocessData: [],
    processData: [],
    workContentSelectData: [],
    SKsDate: '',
    SJsDate: '',
    selectProcessdata: [],
    // 获取用户数据
    async findYhData(params) {
      const response = await fetch.get(
        '/api/eps/control/main/yh/queryForList',
        { params },
      );
      if (response.status === 200) {
        if (response.data.length >= 1) {
          this.yhAllData = response.data;
          // 取出用户登录名单独存放
          this.yhLoginData = response.data.map(
            (item: { id: any; bh: any }) => ({
              value: item.id,
              label: item.bh,
            }),
          );
        }
      }
    },

    // 获取工序数据
    async findProcessData(params) {
      const response = await fetch.get('/api/eps/dps/process/list/', {
        params: { params: params },
      });
      if (response.status === 200) {
        if (response.data.length >= 1) {
          this.processData = response.data;
          this.selectProcessdata = response.data.map(
            (item: { id: any; yhmc: any }) => ({
              value: item.id,
              label: item.name,
            }),
          );
        } else {
          this.processData = [];
        }
      }
    },
    //获取工作内容数据
    async findWorkcontentData() {
      const response = await fetch.get('/api/eps/dps/work/list/');
      if (response.status === 200) {
        if (response.data.length >= 1) {
          this.workContentSelectData = response.data.map(
            (item: { code: any; name: any }) => ({
              value: item.code,
              label: item.name,
            }),
          );
        }
      }
    },
    // 获取任务进度数据
    async findWkprocessData(params) {
      return await fetch.get('/api/eps/dps/wkprocess/findWorkProcess/', {
        params: params,
      });
    },
  }));
  // 按钮和查询框区域(编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: false,
    disableAdd: true,
    disableCopy: true,
    searchCode: 'xmmc',
    // disableAdd: !OptrightStore.hasRight(umid, 'SYS101'),
    disableEdit: !OptrightStore.hasRight(umid, 'SYS102'),
    disableDelete: !OptrightStore.hasRight(umid, 'SYS103'),
    onEditClick: (form, data) => {
      data.date = data.date ? moment(data.date, 'YYYY-MM-DD HH:ss:mm') : '';
      data.stime = data.stime ? moment(data.stime, 'YYYY-MM-DD HH:ss:mm') : '';
      data.etime = data.etime ? moment(data.etime, 'YYYY-MM-DD HH:ss:mm') : '';
      data.whsj = data.whsj ? moment(data.whsj, 'YYYY-MM-DD HH:ss:mm') : '';
      setIsAdd(false);
      setIsEdit(true);
      setFm(form);
      GzlglStore.SJsDate = data.etime;
      GzlglStore.SKsDate = data.stime;
      GzlglStore.findProcessData({ worktplId: data.worktplId });
    },
  };

  //页面初始化
  useEffect(() => {
    GzlglStore.findWorkcontentData();
    ProjectService.findAllProjectData({}).then((data) => {
      setProjectData(data);
    });
  }, []);

  //   自定义弹框表单
  const customForm = (form, tableStore) => {
    //工序选择改变事件
    const onChangeProcess = (record) => {
      if (isAdd) {
        //新增时
        const projectId = addForm?.getFieldValue('projectId')
          ? addForm?.getFieldValue('projectId')
          : '99999999999';
        const processId = addForm?.getFieldValue('processId')
          ? addForm?.getFieldValue('processId')
          : '99999999999';
        GzlglStore.findWkprocessData({
          projectId: projectId,
          processId: processId,
        }).then((response) => {
          if (response.status === 200) {
            if (response.data.length >= 1) {
              const result = response.data.filter(
                (item) => item.processId === addForm.getFieldValue('processId'),
              );
              if (result.length > 0) {
                addForm.setFieldsValue({
                  wkprocessId: result[0].id,
                  yhId: result[0].yhId,
                  login: result[0].login,
                  mc: result[0].xm,
                });
              }
            } else {
              addForm?.setFieldsValue({
                wkprocessId: undefined,
                yhId: undefined,
                login: undefined,
                mc: undefined,
              });
            }
            setFm(form);
          }
        });

        return;
      }
      //编辑时
      const projectId = form?.getFieldValue('projectId')
        ? form?.getFieldValue('projectId')
        : '99999999999';
      const processId = form?.getFieldValue('processId')
        ? form?.getFieldValue('processId')
        : '99999999999';
      GzlglStore.findWkprocessData({
        projectId: projectId,
        processId: processId,
      }).then((response) => {
        if (response.status === 200) {
          if (response.data.length >= 1) {
            const result = response.data.filter(
              (item) => item.processId === form.getFieldValue('processId'),
            );
            if (result.length > 0) {
              form.setFieldsValue({
                wkprocessId: result[0].id,
                yhId: result[0].yhId,
                login: result[0].login,
                mc: result[0].xm,
              });
            }
          } else {
            form?.setFieldsValue({
              wkprocessId: '',
              yhId: '',
              login: '',
              mc: '',
            });
          }
        }
        setFm(form);
      });
    };
    const SPstimeChange = (record) => {
      GzlglStore.SKsDate = record;
    };
    //实际结束时间
    const SPetimeChange = (record) => {
      GzlglStore.SJsDate = record;
    };

    const SPstdisabledDate = (current) => {
      return current >= moment(GzlglStore.SJsDate);
    };
    const SPetdisableDate = (current) => {
      return current <= moment(GzlglStore.SKsDate);
    };
    // 自定义表单
    return (
      <>
        <Form.Item hidden name="id" />
        <Row>
          <Col span={12}>
            <Form.Item hidden label="项目id" name="projectId">
              <Input />
            </Form.Item>
            <Form.Item hidden label="项目编号:" name="xmid">
              <Input />
            </Form.Item>
            <Form.Item
              label="项目名称:"
              name="xmmc"
              validateFirst
              required
              rules={[{ required: true, message: '请选择项目' }]}
            >
              <Input.Search
                allowClear
                readOnly
                placeholder="请输入项目名称"
                onSearch={(val) => onAddProjectSearch(val)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="工序" name="processId">
              <Select
                onChange={(record) => onChangeProcess(record)}
                showSearch
                options={GzlglStore.selectProcessdata}
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item hidden label="任务进度" name="wkprocessId">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item hidden name="yhId" />
          <Col span={12}>
            <Form.Item label="用户名:" name="login">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="姓名:" name="mc">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="工作内容:"
              name="code"
              rules={[{ required: true, message: '请选择工作内容' }]}
              style={{ height: 28 }}
            >
              <Select
                allowClear
                showArrow
                //可搜索下拉框
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                options={GzlglStore.workContentSelectData}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="工作详情:"
              name="content"
              rules={[{ required: true, message: '请输入工作详情' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="开始时间:"
              name="stime"
              required
              rules={[{ required: true, message: '请选择开始时间' }]}
            >
              <DatePicker
                allowClear
                showTime
                onChange={SPstimeChange}
                disabledDate={SPstdisabledDate}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="结束时间:"
              name="etime"
              required
              rules={[{ required: true, message: '请选择结束时间' }]}
            >
              <DatePicker
                allowClear
                showTime
                onChange={SPetimeChange}
                disabledDate={SPetdisableDate}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="工作量:"
              name="qty"
              rules={[
                {
                  required: true,
                  message: '请输入工作量',
                },
              ]}
            >
              <InputNumber min={0} controls={false} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="计量单位:"
              name="jldw"
              required
              rules={[{ required: true, message: '请选择计量单位' }]}
            >
              <Select allowClear placeholder="请选择计量单位:">
                <Select.Option value="天">天</Select.Option>
                <Select.Option value="时">时</Select.Option>
                <Select.Option value="盒">盒</Select.Option>
                <Select.Option value="卷">卷</Select.Option>
                <Select.Option value="件">件</Select.Option>
                <Select.Option value="页">页</Select.Option>
                <Select.Option value="条">条</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="日期:"
              name="date"
              required
              rules={[{ required: true, message: '请输选择日期' }]}
            >
              <DatePicker allowClear showToday />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="来源:" name="source">
              <Select showArrow={false} defaultValue="02" disabled>
                <Select.Option value="01">系统生成</Select.Option>
                <Select.Option value="02">手动登记</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  //定义table表格字段 ---项目信息
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'xmmc',
      align: 'center',
      width: 100,
    },
  ];
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
  //主页的项目查询按钮
  const onProjectSearch = (val) => {
    setIsAdd(false);
    setIsEdit(false);
    setxmvisible(true);
  };
  //新增弹窗中给的项目查询
  const onAddProjectSearch = (val) => {
    setxmvisible(true);
  };
  //双击项目选择确认
  const onProjectConfirm = (record) => {
    if (isAdd) {
      addForm.setFieldsValue({
        xmmc: record.xmmc,
        xmid: record.xmid,
        projectId: record.id,
      });
      addForm.setFieldsValue({
        processId: undefined,
        wkprocessId: undefined,
        yhId: undefined,
        login: undefined,
        mc: undefined,
      });
      GzlglStore.findProcessData({ worktplId: record.worktplId });
    } else if (isEdit) {
      fm.setFieldsValue({
        xmmc: record.xmmc,
        xmid: record.xmid,
        projectId: record.id,
      });
      fm.setFieldsValue({
        processId: '',
        wkprocessId: '',
        yhId: '',
        login: '',
        mc: '',
      });
      GzlglStore.findProcessData({ worktplId: record.worktplId });
    } else {
      seachForm.setFieldsValue({
        xmmc: record.xmmc,
        xmid: record.xmid,
        projectId: record.id,
      });
    }
    setxmvisible(false);
  };

  // 主页表单名称
  const title: ITitle = {
    name: '工作量管理',
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '项目名称',
      code: 'xmmc',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
    {
      title: '日期',
      code: 'date',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '用户名',
      code: 'login',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '姓名',
      code: 'mc',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '工作内容',
      code: 'code',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
      render: (text: any, record: any, index: any) => {
        const a: any[] = [];
        GzlglStore.workContentSelectData.forEach((w) => {
          if (text === w.value) {
            a.push(w.label);
          }
        });
        return a;
      },
    },
    {
      title: '详情',
      code: 'content',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
    {
      title: '开始时间',
      code: 'stime',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '结束时间',
      code: 'etime',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '工作量',
      code: 'qty',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '计量单位',
      code: 'jldw',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '来源',
      code: 'source',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text: string, record: any, index: any) => {
        if (text === '02') {
          return '手工登记';
        }
        if (text === '01') {
          return '系统生成';
        }
        return (text = '未知');
      },
      width: 80,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
  ];
  //弹窗搜索区域
  const modalCustomAction = (
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
              readOnly
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
  //新增点击
  const onAddClick = () => {
    GzlglStore.SJsDate = '';
    GzlglStore.SKsDate = '';
    setIsAdd(true);
    setIsEdit(false);
    addForm.resetFields();
    setAddModalIsVisable(true);
  };
  //主页搜索区域
  const customAction = (store, record) => {
    //主页搜索按钮
    const onClickSeach = () => {
      seachForm.validateFields().then(() => {
        store.findByKey(store.key, store.page, store.size, {
          projectId: seachForm.getFieldValue('projectId')
            ? seachForm.getFieldValue('projectId')
            : null,
        });
      });
    };
    //新增确定
    const addWorkLoad = () => {
      addForm.validateFields().then(() => {
        store.service
          .saveByKey(store.key, addForm.getFieldsValue())
          .then((response) => {
            if (response.status === 201) {
              setAddModalIsVisable(false);
              //刷新数据
              store.findByKey(store.key, store.page, store.size, store.params);
              message.success('添加成功');
            } else {
              message.error('添加失败');
            }
          });
      });
    };
    return (
      <div id="table-seach-coustom-001">
        <Form id="seach-form-page-header" form={seachForm}>
          <Row style={{ marginTop: 20 }}>
            <Col>
              <Form.Item hidden label="项目关键字" name="projectId">
                <Input />
              </Form.Item>
              <Form.Item hidden label="项目编号" name="xmid">
                <Input style={{ width: 300 }} disabled />
              </Form.Item>
              <Form.Item label="项目名称" name="xmmc">
                <Input.Search
                  readOnly
                  allowClear
                  placeholder="请选择项目"
                  style={{ width: 300 }}
                  onSearch={(val) => onProjectSearch(val)}
                />
              </Form.Item>
            </Col>
            <Col>
              <Button type="primary" onClick={onClickSeach}>
                查询
              </Button>
            </Col>
            <Col>
              <Button type="primary" onClick={onAddClick}>
                <FileAddOutlined />
                新建
              </Button>
            </Col>
          </Row>
        </Form>

        <Modal
          className="gzlgl-add-modal"
          style={{ padding: 24 }}
          title="工作量登记"
          visible={addModalIsVisable}
          onCancel={() => setAddModalIsVisable(false)}
          onOk={addWorkLoad}
          centered
        >
          <EpsForm
            modal="add"
            form={addForm}
            source={props.source}
            data={[]}
            customForm={customForm}
          ></EpsForm>
        </Modal>
      </div>
    );
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={GzlglService} // 右侧表格实现类，必填
        formWidth={800}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customAction={customAction}
      />
      <Modal
        title="项目信息"
        zIndex={1001}
        forceRender={true} //  强制渲染modal
        visible={xmVisible}
        onCancel={() => setxmvisible(false)}
        width={600}
        bodyStyle={{ height: 500 }}
        footer={false}
      >
        {modalCustomAction}
        <Table
          id={'modal-table'}
          dataSource={projectData}
          scroll={{ y: 400 }}
          columns={columns}
          rowKey={'id'}
          bordered
          onRow={(record) => {
            return {
              onDoubleClick: () => onProjectConfirm(record),
            };
          }}
        />
      </Modal>
    </>
  );
});

export default Gzlgl;
