import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import {
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import { EpsSource, ITable, ITitle, ITree } from '@/eps/commons/declare';
import { observer, useLocalObservable } from 'mobx-react';
import fetch from '../../../utils/fetch';
import XmzcywhService from './Service/XmzcywhService';
import ProjectService from './Service/ProjectService';
import ProcessService from './Service/ProcessService';
import SysStore from '@/stores/system/SysStore';
import OptrightStore from '@/stores/user/OptrightStore';
import './index.less';

/**
 * 项目组成员维护
 */
const Xmzcywh = observer((props) => {
  const ref = useRef();
  //权限按钮
  const umid = 'DPS004';
  OptrightStore.getFuncRight(umid);
  //控制项目弹框
  const [xmVisible, setxmvisible] = useState(false);
  //控制工序弹框
  const [gxVisible, setgxvisible] = useState(false);
  //form表单值
  const [fm, setFm] = useState();
  //获取当前用户名称
  const whrid = SysStore.getCurrentUser().id;
  //项目数据
  const [projectData, setProjectData] = useState([]);
  //弹窗中项目搜索框中项目名称
  const [xmmcData, setXmmcData] = useState('');
  //仅显示我我负责的项目
  const [currentUserIsChecked, setCurrentUserIsChecked] = useState(false);
  //控制人员弹框
  const [fzrVisible, setfzrvisible] = useState(false);

  useEffect(() => {
    XmzcywhStore.findYhData('');
    // XmzcywhStore.findxmzData();
    XmzcywhStore.findgxData('');
    ProjectService.findAllProjectData({}).then((data) => {
      setProjectData(data);
    });
  }, []);
  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    searchCode: 'progroupname',
    disableCopy: true,
    disableAdd: !OptrightStore.hasRight(umid, 'SYS101'),
    disableEdit: !OptrightStore.hasRight(umid, 'SYS102'),
    disableDelete: !OptrightStore.hasRight(umid, 'SYS103'),
    onEditClick: (form, data) => {
      data.isfzr = data.isfzr === 'Y' ? true : false;
      setFm(form);
      XmzcywhStore.findxmzData({ projectId: data.projectId });
      XmzcywhStore.xmzdiableData = false;
    },
    onAddClick: (form) => {
      setFm(form);
      const tableStore = ref.current?.getTableStore();
      //不选择组key为"",选择的是项目时根据key查询不到数据
      if (tableStore.key !== '') {
        XmzcywhStore.findXmzDataById(tableStore.key).then((response) => {
          if (response.status === 200) {
            form.setFieldsValue({
              progroupId: response.data.id,
              progroupName: response.data.name,
              projectId: response.data.projectId,
              projectName: response.data.projectName,
            });
          }
        });
      }
      XmzcywhStore.xmzdiableData = true;
    },
  };

  //外出管理store
  const XmzcywhStore = useLocalObservable(() => ({
    //项目数据源
    projectData: [],
    //人员数据源
    yhData: [],
    yhSelectData: [],
    xmmcData: '',
    whrData: false,

    fzrData: [],
    xmzData: [],
    xmzdiableData: true,
    gxData: [],
    //查询全部用户数据
    async findYhData(params: any) {
      const response = await fetch.get(
        '/api/eps/control/main/yh/queryForList',
        { params },
      );
      if (response.status === 200) {
        this.fzrData = response.data;
      }
    },
    async findXmzDataById(id) {
      return await fetch.get(`/api/eps/dps/progroup/${id}`);
    },
    //查询项目组数据
    async findxmzData(values) {
      const params = { params: values };
      const response = await fetch.get('/api/eps/dps/progroup/list/', {
        params: params,
      });
      if (response.status === 200) {
        this.xmzData = response.data.map((item: { id: any; name: any }) => ({
          value: item.id,
          label: item.name,
        }));
      }
    },

    //工序查询
    async findgxData(values) {
      const params = { params: values };
      const response = await fetch.get('/eps/dps/process/list/', {
        params: params,
      });
      if (response.status === 200) {
        this.gxData = response.data;
      }
    },
  }));

  //树形搜索
  const treeProps: ITree = {
    treeSearch: true,
    treeCheckAble: false,
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '项目名称',
      code: 'projectName',
      align: 'center',
      formType: EpsFormType.Input,
      width: 300,
    },
    {
      title: '项目组',
      code: 'progroupName',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '工序',
      code: 'processName',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '工序长',
      code: 'isfzr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
      render: (text, record, index) => {
        return <Checkbox checked={text === 'Y' ? true : false} />;
      },
    },
    {
      title: '人员',
      code: 'yhName',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '备注',
      code: 'remark',
      align: 'center',
      formType: EpsFormType.Input,
      width: 300,
    },
  ];
  // 表单名称
  const title: ITitle = {
    name: '项目组成员维护',
  };

  //定义table表格字段 ---工序信息
  const gxcolumns = [
    {
      title: '加工流程',
      dataIndex: 'worktplName',
      align: 'center',
      width: 100,
    },
    {
      title: '工序名称',
      dataIndex: 'name',
      align: 'center',
      width: 100,
    },
  ];

  // //定义table表格字段 ---人员信息
  const fzrcolumns = [
    {
      title: '人员账户',
      dataIndex: 'bh',
      align: 'center',
      width: 100,
    },
    {
      title: '人员名称',
      dataIndex: 'yhmc',
      align: 'center',
      width: 100,
    },
  ];
  // 项目双击选择
  const onfzr = (record) => {
    setfzrvisible(false);
    fm?.setFieldsValue({ yhName: record.yhmc });
    fm?.setFieldsValue({ yhId: record.id });
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
  const customAction = (
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

  //项目弹框的确认按钮
  const onxm = (record) => {
    XmzcywhStore.xmzdiableData = false;
    XmzcywhStore.findxmzData({ projectId: record.id });
    fm?.setFieldsValue({ progroupName: '' });
    setxmvisible(false);
    fm?.setFieldsValue({ projectId: record.id });
    fm?.setFieldsValue({ projectName: record.xmmc });
  };

  //项目组下拉onchange
  const onxmzOnchange = (option) => {
    fm?.setFieldsValue({ progroupId: option });
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

  //弹窗中人员搜索
  const onfzrtableSearch = (value) => {
    XmzcywhStore.findYhData({ yhmc: value });
  };
  const fzrcustomAction = (
    <Form id="modal-table-seach-form">
      <Row>
        <Col>
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => onfzrtableSearch(val)}
              style={{ width: 300 }}
              placeholder="请输入人员名称"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
  const ongxtableSearch = (value) => {
    XmzcywhStore.findgxData({ name: value });
  };
  //工序弹窗中的搜索
  const gxAction = (
    <Form id="modal-table-seach-form">
      <Row>
        <Col>
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => ongxtableSearch(val)}
              style={{ width: 300 }}
              placeholder="请输入工序名称"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  //工序弹框的确认按钮
  const ongx = (record) => {
    setgxvisible(false);
    fm?.setFieldsValue({ processName: record.name });
    fm?.setFieldsValue({ processId: record.id });
  };

  // 自定义弹框表单
  const customForm = (text, form) => {
    //表单项目的查询按钮
    const onxmSearch = (value) => {
      setxmvisible(true);
    };
    //表单工序的查询按钮
    const ongxSearch = (value) => {
      setgxvisible(true);
    };
    //表单人员的查询按钮
    const onfzrSearch = (value) => {
      setfzrvisible(true);
    };

    // 自定义表单
    return (
      <>
        <Form.Item label="项目id:" name="projectId" hidden></Form.Item>
        <Form.Item label="项目组id:" name="progroupId" hidden></Form.Item>
        <Form.Item label="工序Id:" name="processId" hidden></Form.Item>
        <Form.Item label="人员Id:" name="yhId" hidden></Form.Item>
        <Form.Item
          label="项目名称:"
          name="projectName"
          required
          rules={[{ required: true, message: '请选择项目名称' }]}
        >
          <Input.Search
            allowClear
            onSearch={(val) => onxmSearch(val)}
            style={{ width: 300 }}
            readOnly
          />
        </Form.Item>
        <Form.Item
          label="项目组:"
          name="progroupName"
          required
          rules={[{ required: true, message: '请选择项目组' }]}
        >
          <Select
            allowClear
            showArrow
            disabled={XmzcywhStore.xmzdiableData}
            style={{ width: 300 }}
            //可搜索下拉框
            showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            options={XmzcywhStore.xmzData}
            onChange={onxmzOnchange}
          ></Select>
        </Form.Item>
        <Form.Item
          label="人员:"
          name="yhName"
          required
          rules={[{ required: true, message: '请选择人员' }]}
        >
          <Input.Search
            readOnly
            allowClear
            onSearch={(val) => onfzrSearch(val)}
            style={{ width: 300 }}
          />
        </Form.Item>
        <Form.Item label="工序:" name="processName">
          <Input.Search
            allowClear
            readOnly
            onSearch={(val) => ongxSearch(val)}
            onBlur={(record) => {
              if (record.target.value === '') {
                text.setFieldsValue({ processId: null });
              }
            }}
            style={{ width: 300 }}
          />
        </Form.Item>
        <Form.Item
          label="工序长:"
          name="isfzr"
          valuePropName="checked"
          rules={[
            {
              async validator(_, value) {
                //勾选时判断工序是否选择
                if (value && !text.getFieldValue('processId')) {
                  return Promise.reject(new Error('请先选择工序'));
                }
                if (!value) {
                  //取消选择无需验证
                  return Promise.resolve();
                }
                const param = {
                  params: {
                    projectId: text.getFieldValue('projectId'),
                    progroupId: text.getFieldValue('progroupId'),
                    processId: text.getFieldValue('processId'),
                    isfzr: 'Y',
                  },
                };
                await fetch
                  .get('/api/eps/dps/promem/list/', { params: param })
                  .then((res) => {
                    //是否存在工序长
                    if (res.data.length > 0) {
                      return Promise.reject('该项目组和工序已经指定过工序长');
                    }
                    return Promise.resolve();
                  })
                  .catch((err) => {
                    return Promise.reject(err);
                  });
              },
            },
          ]}
        >
          <Checkbox />
        </Form.Item>

        <Form.Item label="备注:" name="remark">
          <Input.TextArea
            allowClear
            showCount
            maxLength={500}
            style={{ height: '10px', width: '300px' }}
          />
        </Form.Item>
      </>
    );
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={XmzcywhService} // 右侧表格实现类，必填
        treeProp={treeProps} // 左侧树 设置属性,可选填
        treeService={XmzcywhService} // 左侧树 实现类，必填
        formWidth={500}
        ref={ref}
        tableAutoLoad={false}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      ></EpsPanel>

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
        {customAction}
        <Table
          id={'modal-table'}
          dataSource={projectData}
          scroll={{ y: 400 }}
          columns={columns}
          bordered
          rowKey={'id'}
          onRow={(record) => {
            return {
              onDoubleClick: () => onxm(record),
            };
          }}
        />
      </Modal>

      <Modal
        title="工序信息"
        zIndex={1001}
        centered
        forceRender={true} //  强制渲染modal
        visible={gxVisible}
        onOk={() => {
          ongx();
        }}
        onCancel={() => setgxvisible(false)}
        width={600}
        bodyStyle={{ height: 500 }}
        footer={false}
      >
        {gxAction}
        <Table
          id={'modal-table'}
          dataSource={XmzcywhStore.gxData}
          scroll={{ y: 400 }}
          columns={gxcolumns}
          bordered
          rowKey={'id'}
          onRow={(record) => {
            return {
              onDoubleClick: () => ongx(record),
            };
          }}
        />
      </Modal>

      <Modal
        title="人员信息"
        zIndex={1001}
        forceRender={true} //  强制渲染modal
        visible={fzrVisible}
        onCancel={() => setfzrvisible(false)}
        width={600}
        bodyStyle={{ height: 500 }}
        footer={false}
      >
        {fzrcustomAction}
        <Table
          id={'modal-table'}
          dataSource={XmzcywhStore.fzrData}
          scroll={{ y: 400 }}
          columns={fzrcolumns}
          bordered
          rowKey={'id'}
          onRow={(record) => {
            return {
              onDoubleClick: () => onfzr(record),
            };
          }}
        />
      </Modal>
    </>
  );
});

export default Xmzcywh;
