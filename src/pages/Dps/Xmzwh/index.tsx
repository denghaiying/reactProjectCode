import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useRef, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Checkbox, Col, Form, Input, message, Modal, Row, Table } from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import XmzwhService from '../Xmzwh/Service/XmzwhService';
import ProjectService from './Service/ProjectService';
import SysStore from '@/stores/system/SysStore';
import fetch from '../../../utils/fetch';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import './index.less';
/**
 * 项目组维护
 */
const Xmzwh = observer((props) => {
  //权限按钮
  const umid = 'DPS018';
  OptrightStore.getFuncRight(umid);
  const ref = useRef();
  //控制项目弹框
  const [xmVisible, setxmvisible] = useState(false);
  //form表单值
  const [fm, setFm] = useState();
  //获取当前用户名称
  const whrid = SysStore.getCurrentUser().id;

  //控制负责人弹框
  const [fzrVisible, setfzrvisible] = useState(false);
  //项目数据
  const [projectData, setProjectData] = useState([]);
  //仅显示我我负责的项目
  const [currentUserIsChecked, setCurrentUserIsChecked] = useState(false);
  //弹窗中项目搜索框中项目名称
  const [xmmcData, setXmmcData] = useState('');

  useEffect(() => {
    XmzwhStore.findYhData('');
    ProjectService.findAllProjectData({}).then((data) => {
      setProjectData(data);
    });
  }, []);

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableCopy: true,
    searchCode: 'projectName',
    disableAdd: !OptrightStore.hasRight(umid, 'SYS101'),
    disableEdit: !OptrightStore.hasRight(umid, 'SYS102'),
    disableDelete: !OptrightStore.hasRight(umid, 'SYS103'),
    onAddClick: (form) => {
      XmzwhStore.xzname = [];
      XmzwhStore.xgData = false;
      setFm(form);
    },
    onEditClick: (form, data) => {
      XmzwhStore.xzname = data.name;
      setFm(form);
      return new Promise((resolve, reject) => {
        return XmzwhStore.findXmzcy(data.id)
          .then((res) => {
            if (res.data.length === 0) {
              return XmzwhStore.findWokrTask(data.id).then((res) => {
                if (res.data.length === 0) {
                  return XmzwhStore.xgData = false;
                }
                return XmzwhStore.xgData = true;
              });
            }
            return XmzwhStore.xgData = true;
          })
          .catch((err) => {
            return reject(err);
          });
      });
    },
    onDeleteClick: (data) => {
      return new Promise((resolve, reject) => {
        return XmzwhStore.findXmzcy(data.id)
          .then((res) => {
            if (res.data.length === 0) {
              return XmzwhStore.findWokrTask(data.id).then((res) => {
                if (res.data.length === 0) {
                  return resolve(res.data);
                }
                return reject('该数据已被使用,不允许删除');
              });
            }
            return reject('该数据已被使用,不允许删除');
          })
          .catch((err) => {
            return reject(err);
          });
      });
    },
  };

  //外出管理store
  const XmzwhStore = useLocalObservable(() => ({
    fzrData: [],
    xzname: [],
    xgData: false,
    async findXmzcy(progroupId) {
      return await fetch.get('/api/eps/dps/promem/list/', {
        params: { params: { progroupId: progroupId } },
      });
    },
    async findWokrTask(progroupId) {
      return await fetch.get('/api/eps/dps/worktask/list/', {
        params: { params: { progroupId: progroupId } },
      });
    },

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
  }));

  // 表单名称
  const title: ITitle = {
    name: '项目组维护',
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '项目名称',
      code: 'projectName',
      align: 'center',
      formType: EpsFormType.Input,
    },

    {
      title: '小组名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '负责人',
      code: 'fzr',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '备注',
      code: 'remark',
      align: 'center',
      formType: EpsFormType.Input,
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

  //项目弹框的确认按钮
  const onxm = (record) => {
    fm?.setFieldsValue({ projectId: record.id });
    fm?.setFieldsValue({ projectName: record.xmmc });
    setxmvisible(false);
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
  //弹窗中负责人搜索
  const onfzrtableSearch = (value) => {
    XmzwhStore.findYhData({ yhmc: value });
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
              placeholder="请输入负责人名称"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
  // 项目双击选择
  const onfzr = (record) => {
    setfzrvisible(false);
    fm?.setFieldsValue({ fzr: record.yhmc });
    fm?.setFieldsValue({ fzrid: record.id });
  };
  // //定义table表格字段 ---负责人信息
  const fzrcolumns = [
    {
      title: '负责人账户',
      dataIndex: 'bh',
      align: 'center',
      width: 100,
    },
    {
      title: '负责人名称',
      dataIndex: 'yhmc',
      align: 'center',
      width: 100,
    },
  ];

  // 自定义弹框表单
  const customForm = (text, form) => {
    //表单项目的查询按钮
    const onxmSearch = (value) => {
      setxmvisible(true);
    };

    //表单负责人的查询按钮
    const onfzrSearch = (value) => {
      setfzrvisible(true);
    };

    // 自定义表单
    return (
      <>
        <Form.Item label="负责人id:" name="fzrid" hidden></Form.Item>
        <Form.Item label="项目名称:" name="projectId" hidden></Form.Item>

        <Form.Item
          label="项目名称:"
          name="projectName"
          required
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input.Search
            allowClear
            onSearch={(val) => onxmSearch(val)}
            style={{ width: 300 }}
            readOnly
            disabled={XmzwhStore.xgData}
          />
        </Form.Item>
        <Form.Item
          hidden
          initialValue={`${moment().format('YYYYMMDDHHmmssSSS')}`}
          label="小组编号:"
          name="code"
          required
        >
          <Input allowClear style={{ width: 300 }} disabled={XmzwhStore.xgData} />
        </Form.Item>
        <Form.Item
          label="小组名称:"
          required
          name="name"
          validateFirst
          rules={[
            { required: true, message: '请输入小组名称' },
            { max: 20, message: '小组名称过长' },
            {
              async validator(_, value) {
                if (!text.getFieldValue('projectId')) {
                  return Promise.reject(new Error('请先选择项目'));
                }
                if (XmzwhStore.xzname === value) {
                  return Promise.resolve();
                }
                const param = {
                  params: {
                    projectId: text.getFieldValue('projectId'),
                    name: value, source: 'jq',
                  },
                };
                await fetch
                  .get('/api/eps/dps/progroup/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else if (res.data.length != 0) {
                      return Promise.reject(new Error('项目内小组名称已使用'));
                    }
                  });
              },
            },
          ]}
        >
          <Input allowClear style={{ width: 300 }} disabled={XmzwhStore.xgData} />
        </Form.Item>
        <Form.Item label="负责人:" name="fzr">
          <Input.Search
            allowClear
            onSearch={(val) => onfzrSearch(val)}
            style={{ width: 300 }}
            readOnly
            disabled={XmzwhStore.xgData}
          />
        </Form.Item>
        <Form.Item label="备注:" name="remark">
          <Input.TextArea
            allowClear
            showCount
            maxLength={500}
            style={{ height: '10px', width: '300px' }}
            disabled={XmzwhStore.xgData}
          />
        </Form.Item>
      </>
    );
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
  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={XmzwhService} // 右侧表格实现类，必填
        formWidth={500}
        ref={ref}
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
        title="负责人信息"
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
          dataSource={XmzwhStore.fzrData}
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

export default Xmzwh;
