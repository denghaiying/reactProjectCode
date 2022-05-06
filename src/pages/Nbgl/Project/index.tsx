import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useRef, useState } from 'react';
import { Form, Input, Modal, message, Table } from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import ProjectService from './ProjectService';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import fetch from '../../../utils/fetch';
import WldwService from '../Wldw/WldwService';
import YhService from './YhService';
import './index.less';
/**
 * 内部管理---项目管理
 */

const Project = observer((props) => {
  const ref = useRef();

  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');
  //form表单值
  const [fm, setFm] = useState();
  //客户数据
  const [khTableData, setKhTableData] = useState([]);
  //用户数据
  const [yhTableData, setYhTableData] = useState([]);
  //控制销售员或销售经理弹框是否可见
  const [yhVisible, setYhvisible] = useState(false);
  //控制弹窗时选择销售眼还是销售经理
  const [type, setType] = useState('');
  //控制客户信息弹框是否可见
  const [khVisible, setKhvisible] = useState(false);
  // 项目维护的本地store
  const ProjectStore = useLocalObservable(() => ({
    //表单项目编号验证
    codeData: [],
    //表单项目名称验证
    nameData: [],
    //用户数据源
    yhData: [],
    //客户数据源
    khData: [],

    //查询用户数据
    async findYhData(params) {
      return await fetch.get('/api/eps/control/main/yh/queryForList', {
        params,
      });
    },
    //查询客户数据(往来单位)
    async findKhData(params) {
      return await fetch.get('/api/eps/nbgl/wldw/list/', {
        params: { params: params },
      });
    },
  }));
  useEffect(() => {
    ProjectStore.findYhData({}).then((response) => {
      if (response.status === 200) {
        if (response.data.length > 0) {
          ProjectStore.yhData = response.data;
          setYhTableData(response.data);
        }
      }
    });
    ProjectStore.findKhData({ wldwkh: '1' }).then((response) => {
      if (response && response.status === 200) {
        if (response.data.length > 0) {
          ProjectStore.khData = response.data;
          setKhTableData(response.data);
        }
      }
    });
  }, []);

  //按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    searchCode: 'projectName',
    disableCopy: true,
    onEditClick: (form, record) => {
      ProjectStore.codeData = record.projectCode;
      ProjectStore.nameData = record.projectName;
      const kh = ProjectStore.khData?.filter((item) => item.id === record.khId);
      form?.setFieldsValue({ khName: kh[0]['wldwname'] });
      const xsy = ProjectStore.yhData?.filter(
        (item) => item.id === record.projectXsyid,
      );
      form?.setFieldsValue({ projectXsyname: xsy[0]['yhmc'] });
      const xmjl = ProjectStore.yhData?.filter(
        (item) => item.id === record.projectXmjlid,
      );
      form?.setFieldsValue({ projectXmjlname: xmjl[0]['yhmc'] });
    },
    onAddClick: (form) => {
      ProjectStore.codeData = [];
      ProjectStore.nameData = [];
    },
  };

  //表单名称
  const title: ITitle = {
    name: '项目管理',
  };

  //定义table表格字段
  const source: EpsSource[] = [
    {
      title: '客户',
      code: 'khId',
      align: 'center',
      formType: EpsFormType.Input,
      width: 240,
      render: (text, record, index) => {
        const result = ProjectStore.khData?.filter((item) => item.id === text);
        return result[0] ? result[0]['wldwname'] : '';
      },
    },
    {
      title: '项目编号',
      code: 'projectCode',
      align: 'center',
      formType: EpsFormType.Input,
      width: 160,
    },
    {
      title: '项目名称',
      code: 'projectName',
      align: 'center',
      formType: EpsFormType.Input,
      width: 300,
    },
    {
      title: '销售员',
      code: 'projectXsyid',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
      render: (text, record, index) => {
        const result = ProjectStore.yhData?.filter((item) => item.id === text);
        return result[0] ? result[0]['yhmc'] : '';
      },
    },
    {
      title: '项目经理',
      code: 'projectXmjlid',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
      render: (text, record, index) => {
        const result = ProjectStore.yhData?.filter((item) => item.id === text);
        return result[0] ? result[0]['yhmc'] : '';
      },
    },
    {
      title: '备注',
      code: 'projectRemark',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 160,
    },
  ];

  //弹出中用户字段
  const yhModalTableColumns = [
    {
      title: '用户编码',
      dataIndex: 'bh',
      align: 'center',
      width: 80,
    },
    {
      title: '用户名称',
      dataIndex: 'yhmc',
      align: 'center',
      width: 120,
    },
  ];
  //定义客户弹窗table表格字段 --- 客户信息
  const khModalTableColumns = [
    {
      title: '客户编码',
      dataIndex: 'wldwcode',
      align: 'center',
      width: 80,
    },
    {
      title: '客户名称',
      dataIndex: 'wldwname',
      align: 'center',
      width: 120,
    },
  ];
  //客户弹窗中模糊搜索
  const khModalSearch = (val) => {
    ProjectStore.findKhData({ wldwkh: '1', wldwname: val }).then((response) => {
      if (response.status === 200) {
        if (response.data.length > 0) {
          setKhTableData(response.data);
        } else {
          setKhTableData([]);
        }
      }
    });
  };
  //用户弹窗中模糊搜索
  const yhModalSearch = (val) => {
    ProjectStore.findYhData({ yhmc: val }).then((response) => {
      if (response.status === 200) {
        if (response.data.length > 0) {
          setYhTableData(response.data);
        } else {
          setYhTableData([]);
        }
      }
    });
  };
  //客户信息弹框中的双击确认
  const onkhDoubleClickConfirm = (record) => {
    setKhvisible(false);
    fm?.setFieldsValue({
      khId: record.id,
      khName: record.wldwname,
    });
  };

  //用户双击确认选择
  const onYhDoubleClickConfirm = (record) => {
    setYhvisible(false);
    if (type === '1') {
      fm?.setFieldsValue({ projectXsyid: record.id });
      fm?.setFieldsValue({ projectXsyname: record.yhmc });
    } else {
      fm?.setFieldsValue({ projectXmjlid: record.id });
      fm?.setFieldsValue({ projectXmjlname: record.yhmc });
    }
  };

  // 自定义弹框表单
  const customForm = (text, form) => {
    let khId = '';
    khId = text.getFieldValue('khId');
    const onKhChange = (value) => {
      khId = value;
    };

    //客户的查询按钮
    const onKhSearch = (value) => {
      setKhvisible(true);
      setFm(text);
    };

    //销售员或销售经理的查询按钮
    const onYhSearch = (value, type) => {
      setType(type);
      setYhvisible(true);
      setFm(text);
    };

    return (
      <>
        <Form.Item label="客户:" name="khId" hidden>
          <Input allowClear style={{ width: 250 }} onChange={onKhChange} />
        </Form.Item>
        <Form.Item
          label="客户:"
          name="khName"
          rules={[{ required: true, message: '请选择客户' }]} 
        >
          <Input.Search
            allowClear
            readOnly
            placeholder={'请选择客户'}
            style={{ width: 250 }}
            onSearch={(val) => onKhSearch(val)}
          />
        </Form.Item>
        <Form.Item
          label="项目编号:"
          name="projectCode"
          validateFirst
          rules={[
            { required: true, message: '请输入项目编号' },
            { max: 20, message: '编号长度不能大于20个字符' },
            {
              async validator(_, value) {
                if (ProjectStore.codeData === value) {
                  return Promise.resolve();
                }
                const param = {
                  params: { projectCode: value, khId: khId, source: 'add' },
                };
                await fetch
                  .get('/api/eps/nbgl/project/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('同一客户下项目编号已存在，请重新输入!'),
                      );
                    }
                  });
              },
            },
          ]}
        >
          <Input allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          label="项目名称:"
          name="projectName"
          validateFirst
          rules={[
            { required: true, message: '请输入项目名称' },
            {
              async validator(_, value) {
                if (ProjectStore.nameData === value) {
                  return Promise.resolve();
                }
                const param = {
                  params: { projectName: value, source: 'add', khId: khId },
                };
                await fetch
                  .get('/api/eps/nbgl/project/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('同一客户下项目名称已存在，请重新输入!'),
                      );
                    }
                  });
              },
            },
          ]}
        >
          <Input allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="销售员:" name="projectXsyid" hidden>
          <Input.Search allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          label="销售员:"
          name="projectXsyname"
          rules={[{ required: true, message: '请选择销售员' }]}
        >
          <Input.Search
            placeholder={'请选择销售员'}
            allowClear
            readOnly
            style={{ width: 250 }}
            onSearch={(val, type) => onYhSearch(val, '1')}
          />
        </Form.Item>
        <Form.Item label="项目经理:" name="projectXmjlid" hidden>
          <Input.Search allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          label="项目经理:"
          name="projectXmjlname"
          rules={[{ required: true, message: '请选择项目经理' }]}
        >
          <Input.Search
            allowClear
            readOnly
            placeholder={'请选择项目经理'}
            style={{ width: 250 }}
            onSearch={(val, type) => onYhSearch(val, '2')}
          />
        </Form.Item>
        <Form.Item label="备注:" name="projectRemark">
          <Input.TextArea allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="维护人:" name="whr">
          <Input
            allowClear
            disabled
            defaultValue={whr}
            style={{ width: 250 }}
          />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj">
          <Input
            allowClear
            defaultValue={whsj}
            disabled
            style={{ width: 250 }}
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
        tableService={ProjectService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={500}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      />
      <Modal
        title="客户信息"
        zIndex={1001}
        forceRender={true} //  强制渲染modal
        visible={khVisible}
        onCancel={() => setKhvisible(false)}
        width={1000}
        bodyStyle={{ height: 500 }}
        footer={false}
      >
        <Form id="kh-modal-table-seach-form">
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => khModalSearch(val)}
              style={{ width: 300 }}
              placeholder="请输入客户名称"
            />
          </Form.Item>
        </Form>
        <Table
          id={'kh-modal-table'}
          dataSource={khTableData}
          scroll={{ y: 400 }}
          columns={khModalTableColumns}
          rowKey={'id'}
          bordered
          onRow={(record) => {
            return {
              onDoubleClick: () => onkhDoubleClickConfirm(record),
            };
          }}
        />
      </Modal>
      <Modal
        title="用户信息"
        zIndex={1001}
        forceRender={true} //  强制渲染modal
        visible={yhVisible}
        onCancel={() => setYhvisible(false)}
        width={1000}
        bodyStyle={{ height: 500 }}
        footer={false}
      >
        <Form id="yh-modal-table-seach-form">
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => yhModalSearch(val)}
              style={{ width: 300 }}
              placeholder="请输入用户名称"
            />
          </Form.Item>
        </Form>
        <Table
          id={'yh-modal-table'}
          dataSource={yhTableData}
          scroll={{ y: 400 }}
          columns={yhModalTableColumns}
          rowKey={'id'}
          bordered
          onRow={(record) => {
            return {
              onDoubleClick: () => onYhDoubleClickConfirm(record),
            };
          }}
        />
      </Modal>
    </>
  );
});

export default Project;
