import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsRecordPanel from '@/eps/components/panel/EpsRecordPanel';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useState, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Form,
  Input,
  Select,
  message,
  Button,
  Checkbox,
  Modal,
  Row,
  Col,
  InputNumber,
  Card,
} from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import fetch from '../../../utils/fetch';
import ProjectService from './Service/ProjectService';
import EpsTableStore from '@/eps/components/panel/EpsRecordPanel/EpsTableStore';
import './Taskgl.less';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import WorktaskService from './Service/WorktaskService';
import EpsForm from '@/eps/components/form/EpsForm';
import OptrightStore from '@/stores/user/OptrightStore';

/**
 * 加工流程
 */
const Taskgl = observer((props: any) => {
  //权限按钮
  const umid = 'DPS017';
  OptrightStore.getFuncRight(umid);
  useEffect(() => { }, []);

  //搜索区域表单的实例
  const [seachForm] = Form.useForm();

  const [taskOutForm] = Form.useForm();

  //暂存选择的行数据
  const [checkedRows, setCheckedRows] = useState();

  //控制任务分配的确认弹窗是否可见
  const [isVisableTaskOutModal, setIsVisableTaskOutModal] = useState(false);

  //是否启用状态
  const [isEnabledProject, setIsEnabledProject] = useState(true);
  //是否停用状态
  const [isUnabledProject, setIsUnabledProject] = useState(true);
  //是否选择了行,不选择不让点击
  const [isCheckedRow, setIsCheckedRow] = useState(true);

  const [initParamsmx] = useState({});
  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tablePropz: ITable = {
    tableSearch: false,
    disableAdd: true,
    disableCopy: true,
    disableDelete: true,
    disableEdit: true,
    rowSelection: {
      type: 'radio',
    },
  };

  // 表单名称
  const title: ITitle = {
    name: '项目信息',
  };

  const [initParams, setInitParams] = useState({});
  const ref = useRef();
  const refPanel = useRef();

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '项目名称',
      code: 'xmmc',
      align: 'center',
      formType: EpsFormType.Input,
      width: 180,
    },
    {
      title: '工作流程',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '启用',
      code: 'enable',
      align: 'center',
      formType: EpsFormType.Input,
      width: 50,
      render: (text: string, record: any, index: any) => {
        return <Checkbox checked={text === 'Y' ? true : false} />;
      },
    },
    {
      title: '负责人',
      code: 'mgnername',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    // {
    //   title: '备注',
    //   code: 'remark',
    //   align: 'center',
    //   formType: EpsFormType.Input,
    //   width: 180,
    // },
    // {
    //   title: '维护人',
    //   code: 'whr',
    //   align: 'center',
    //   formType: EpsFormType.Input,
    //   width: 100,
    // },
    // {
    //   title: '维护时间',
    //   code: 'whsj',
    //   align: 'center',
    //   formType: EpsFormType.Input,
    //   width: 180,
    // },
  ];

  //搜索按钮点击事件
  const onClickSeach = () => {
    const tableStore = ref.current.getTableStore();
    const param = seachForm.getFieldsValue();
    param['source'] = 'mh'; //id模糊查询参数
    param['enable'] = param['enable'] ? 'Y' : null;
    param['mgner'] = param['mgner'] ? SysStore.getCurrentUser().id : null;
    tableStore.findByKey(tableStore.key, tableStore.page, tableStore.size, param).then(() => {
      //查询后重置按钮状态
      ref.current.clearTableRowClick();
      setIsCheckedRow(true);
      setIsEnabledProject(true);
      setIsUnabledProject(true);
    });
  };

  //上半部分表格行选择事件
  const rowSelectTopTable = (key, row) => {
    setIsCheckedRow(false);
    //单选直接取第一个数据
    if (row['enable'] === 'Y') {
      //项目启用将启用设置ture不可编辑,另一个相反
      setIsEnabledProject(true);
      setIsUnabledProject(false);
    } else {
      setIsEnabledProject(false);
      setIsUnabledProject(true);
    }
    //查询明细表
    const tableStore = refPanel.current.getTableStore();
    tableStore.findByKey(tableStore.key, tableStore.page, tableStore.size, {
      projectId: row.id,
    });
    //将选择的数据暂存
    setCheckedRows(row);
    TaskglStore.findProgroupDataByProjectId(row.id);
  };
  //任务分配的点击事件
  const onClickTaskOut = () => {
    taskOutForm.resetFields();
    if (checkedRows.enable !== 'Y') {
      return message.warn('项目已停用不可以分配任务');
    }

    //在表单项里初始化值,每次切换会延迟,所以在点击分配的时候再设置值
    taskOutForm.setFieldsValue({ "progroupId": TaskglStore.selectProgroupData.length !== 0 ? TaskglStore.selectProgroupData[0]['value'] : undefined, stfs: 50 })
    setIsVisableTaskOutModal(true);
  };
  //任务分配确认
  const onOKTaskOut = () => {
    const taskData = taskOutForm.getFieldsValue();
    taskData['id'] = `${Math.random()}`;
    taskData['projectId'] = checkedRows.id;
    taskData['worktplId'] = checkedRows.worktplId;
    taskData['ystfs'] = 0;
    taskData['stime'] = moment.now();
    taskData['whr'] = SysStore.getCurrentUser().yhmc;
    taskData['whrid'] = SysStore.getCurrentUser().id;
    taskData['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    taskOutForm.validateFields().then(() => {
      TaskglStore.taskOutConfirm(taskData)
        .then((response) => {
          setIsVisableTaskOutModal(false);
          const tableStore = refPanel.current.getTableStore();
          //刷新明细表
          tableStore.findByKey(tableStore.key, tableStore.page, tableStore.size, {
            projectId: checkedRows.id,
          });
          return message.success('分配成功');
        })
        .catch(() => {
          message.error('系统异常');
        });
    });
  };
  const OnClickEnable = () => {
    //获取筛选条件
    const param = seachForm.getFieldsValue();
    param['source'] = 'mh'; //id模糊查询参数
    param['enable'] = param['enable'] ? 'Y' : null;
    param['mgner'] = param['mgner'] ? SysStore.getCurrentUser().id : null;

    //如果是启用
    let enable;
    if (checkedRows.enable === 'Y') {
      enable = 'N';
      ProjectService.updateForTable({ id: checkedRows.id, enable: enable })
        ?.then((response) => {
          if (response.status === 200) {
            setIsEnabledProject(false);
            setIsUnabledProject(true);
            //更新选择行中存储
            checkedRows.enable = 'N';
            //刷新主表
            const tableStore = ref.current.getTableStore();
            tableStore.findByKey(tableStore.key, tableStore.page, tableStore.size, param);
          }
        })
        .catch(() => {
          message.error('系统异常');
        });
    } else {
      enable = 'Y';
      ProjectService.updateForTable({ id: checkedRows.id, enable: enable })
        ?.then((response) => {
          setIsEnabledProject(true);
          setIsUnabledProject(false);
          //更新选择行中存储
          checkedRows.enable = 'Y';
          //刷新主表
          const tableStore = ref.current.getTableStore();
          tableStore.findByKey(tableStore.key, tableStore.page, tableStore.size, param);
        })
        .catch(() => {
          message.error('系统异常');
        });
    }
  };

  //自定义搜索区域
  const customAction = (store, record) => {
    return (
      <Form id="seach-form-page-header" form={seachForm}>
        <Row>
          <Col>
            <Form.Item label="项目名称" name="xmmc">
              <Input style={{ width: '300px' }} />
            </Form.Item>
          </Col>
          <Col>
          {OptrightStore.hasRight(umid,'SYS106') &&
            <Form.Item name="mgner" valuePropName="checked">
              <Checkbox>仅查看我负责的项目</Checkbox>
            </Form.Item>}
          </Col>
          <Col>
          {OptrightStore.hasRight(umid,'SYS107') &&
            <Form.Item name="enable" valuePropName="checked">
              <Checkbox>仅查看启用的项目</Checkbox>
            </Form.Item>}
          </Col>
          <Col>
          {OptrightStore.hasRight(umid,'SYS105') &&
            <Button type="primary" onClick={onClickSeach}>
              查询
            </Button>}
          </Col>
          <Col>
          {OptrightStore.hasRight(umid,'SYS101') && 
            <Button type="primary" disabled={isCheckedRow} onClick={onClickTaskOut}>
              任务分配
            </Button>}
          </Col>
          <Col>
          {OptrightStore.hasRight(umid,'SYS102') && 
            <Button type="primary" disabled={isUnabledProject} onClick={OnClickEnable}>
              停用
            </Button>}
          </Col>
          <Col>
          {OptrightStore.hasRight(umid,'SYS103') && 
            <Button type="primary" disabled={isEnabledProject} onClick={OnClickEnable}>
              启用
            </Button>}
          </Col>
        </Row>
      </Form>
    );
  };

  const TaskglStore = useLocalObservable(() => ({
    //项目组的选择数据
    selectProgroupData: [],
    async findProgroupDataByProjectId(projectId) {
      const response = await fetch.get('/api/eps/dps/progroup/list/', {
        params: { params: { projectId: projectId } },
      });
      if (response.status === 200) {
        if (response.data.length > 0) {
          this.selectProgroupData = response.data.map((item: { id: any; name: any }) => ({
            value: item.id,
            label: item.name,
          }));
        } else {
          this.selectProgroupData = [];
        }
      }
    },
    async findWkProcessByWorkTaskId(worktaskId) {
      return await fetch.get('/api/eps/dps/wkprocess/list/', {
        params: { params: { worktaskId: worktaskId } },
      });
    },

    async taskOutConfirm(data) {
      return await fetch.post('/api/eps/dps/worktask/taskOut', data);
    },
  }));

  // 主表格行点击事件
  const onPanelChange = (record: any) => { };

  // 自定义从组件
  const bottomAction = (store: EpsTableStore, rows: any[]) => {
    // 按钮和查询框区域(新增、编辑、删除按钮)
    const tableProp: ITable = {
      tableSearch: false,
      disableEdit: true,
      disableAdd: true,
      disableCopy: true,
      disableDelete: !OptrightStore.hasRight(umid,'SYS104'),
      onDeleteClick: (data) => {
        return new Promise((resolve, reject) => {
          return TaskglStore.findWkProcessByWorkTaskId(data.id)
            .then((res) => {
              if (res && res.status === 200) {
                if (res.data.length > 0) {
                  return reject('该任务下存在任务进度,不允许删除');
                }
              }
              return resolve(res.data);
            })
            .catch((err) => {
              return reject(err);
            });
        });
      },
    };
    // 表单名称
    const title: ITitle = {
      name: '生产任务信息',
    };
    // 定义明细表table表格字段
    const source: EpsSource[] = [
      {
        title: '项目组',
        code: 'progroupName',
        align: 'center',
        width: 180,
        formType: EpsFormType.Input,
      },
      {
        title: '实体领取份数',
        code: 'stfs',
        align: 'center',
        width: 150,
        formType: EpsFormType.Input,
      },
      {
        title: '已完成份数',
        code: 'ystfs',
        align: 'center',
        width: 150,
        formType: EpsFormType.Input,
      },
      {
        title: '开始时间',
        code: 'stime',
        align: 'center',
        width: 180,
        formType: EpsFormType.Input,
      },
      {
        title: '结束时间',
        code: 'etime',
        align: 'center',
        width: 180,
        formType: EpsFormType.Input,
      },
    ];
    const customAction = () => {
      return (
        <Card className="bottom-table-card" bordered={false}>
          任务明细
        </Card>
      );
    };
    const customTableAction = (text: any, record: any, index: any, store: any) => {
      return <span>删除</span>;
    };
    return (
      <>
        <EpsPanel
          title={title} // 组件标题，必填
          source={source}
          initParams={initParamsmx} // 组件元数据，必填
          tableProp={tableProp} // 右侧表格设置属性，选填
          tableService={WorktaskService} // 右侧表格实现类，必填
          ref={refPanel} // 获取组件实例，选填
          tableAutoLoad={false}
          customAction={customAction}
        // customTableAction={customTableAction}
        ></EpsPanel>
      </>
    );
  };
  return (
    <>
      <EpsRecordPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tablePropz}
        initParams={initParams} // 右侧表格设置属性，选填
        tableService={ProjectService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        bottomAction={(store, record) => bottomAction(store, record)}
        customAction={customAction} //自定义搜索区域
        onTabChange={(key, store, checkedRows) => {
          rowSelectTopTable(key, checkedRows[0]);
        }}
      ></EpsRecordPanel>

      <Modal
        title="任务分配"
        visible={isVisableTaskOutModal}
        width="400px"
        onOk={() => {
          onOKTaskOut();
        }}
        onCancel={() => {
          setIsVisableTaskOutModal(false);
        }}
      >
        <Form labelCol={{ span: 8 }} form={taskOutForm} id="task-out-form" className='task-out-form'>
          <Form.Item
            label="项目组"
            name="progroupId"
            required
            rules={[{ required: true, message: '请选择项目组' }]}

          >
            <Select options={TaskglStore.selectProgroupData} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item
            label="实体领取份数"
            name="stfs"
            required
            rules={[
              { required: true, message: '请输入领取份数' },
              { pattern: new RegExp(/^[1-9]*[1-9][0-9]*$/, 'g'), message: '请输入整数' },
            ]}
          >
            <InputNumber style={{ width: 200 }} min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default Taskgl;
