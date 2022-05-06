import React, { useEffect, useState } from 'react';
import {
  Table,
  message,
  Form,
  Tooltip,
  Modal,
  Button,
  Select,
  Input,
  TreeSelect,
} from 'antd';
import SysStore from '../../../stores/system/SysStore';
import {
  ExclamationCircleOutlined,
  SettingOutlined,
  FileAddOutlined,
} from '@ant-design/icons';
import { observer, useLocalObservable } from 'mobx-react';
import moment from 'moment';
import './index.less';
import fetch from '../../../utils/fetch';

const settingEEP = observer((props) => {
  const FormItem = Form.Item;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const [visible, setVisible] = useState(false);
  const [opt_visible, setOptVisible] = useState(false);
  const [opt_status, setOptStatus] = useState('');
  const EepjgStore = useLocalObservable(() => ({
    eepjgloading: false,
    opt: '',
    optname: '',
    jgdata: [],
    // jgTreeData:{},
    async setopt(opt) {
      this.opt = opt;
    },
    async findJbByMb(params) {
      this.eepjgloading = true;
      const response = await fetch.get(
        '/api/eps/e9eep/eepjg/getJgTree',
        params,
      );
      if (response && response.status === 200) {
        // this.jgTreeData = sjData;
        this.jgdata = response.data;
        this.eepjgloading = false;
      }
    },
    async deleteForId(id) {
      debugger;
      const response = await fetch.delete(`/api/eps/e9eep/eepjg/${id}`);
      if (response) {
        EepjgStore.findJbByMb({ params: { jgcontentid: props.record.id } });
        Modal.destroyAll();
      }
    },
    async saveData(values) {
      debugger;
      let response;
      if (EepjgStore.opt === 'edit') {
        response = await fetch.put(`/api/eps/e9eep/eepjg/${values.id}`, values);
      } else {
        response = await fetch.post('/api/eps/e9eep/eepjg/', values);
      }
      if (response && response.status === 201) {
        message.success('数据添加成功');
        setOptVisible(false);
        EepjgStore.findJbByMb({ params: { jgcontentid: props.record.id } });
      } else if (response && response.status === 200) {
        message.success('数据修改成功');
        setOptVisible(false);
        EepjgStore.findJbByMb({ params: { jgcontentid: props.record.id } });
      } else {
        message.error('数据添加失败!');
      }
    },
  }));
  // 点击后初始化页面
  const click = () => {
    // 显示弹框页面
    setVisible(true);
    EepjgStore.findJbByMb({ params: { jgcontentid: props.record.id } });
  };
  // 初始化加载数据
  useEffect(() => {}, []);
  const handleOk = (id) => {
    debugger;
    EepjgStore.deleteForId(id);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };
  const onAddAction = (opt) => {
    debugger;
    // 显示新增包结构弹框页面
    if (opt === 'add') {
      EepjgStore.opt = opt;
      EepjgStore.optname = '新增';
    }
    setOptVisible(true);
    form.resetFields();
    form.setFieldsValue({
      jgmbid: props.record.contentmbid,
      jgcontentid: props.record.id,
    });
  };
  const onEditAction = (record, opt) => {
    // 显示新增包结构弹框页面
    if (opt === 'edit') {
      EepjgStore.opt = opt;
      EepjgStore.optname = '编辑';
    }
    setOptVisible(true);
    form.setFieldsValue({
      id: record.id,
      jgmbid: record.jgmbid,
      jgcontentid: record.jgcontentid,
      jgfid: record.jgfid,
      jgtype: record.jgtype,
      jgname: record.jgname,
      jgcorritem: record.jgcorritem,
      jgisedit: record.jgisedit,
    });
  };
  // 配置包结构行删除事件
  const onDeleteAction = (record) => {
    // 显示新增包结构弹框页面
    if (record.children != null && record.children.length > 0) {
      message.warning('请先删除子节点包结构！');
      return;
    }
    handleOk(record.id);
  };

  const handlePZBJGCancel = () => {
    setVisible(false);
  };
  const eepjgcolumns = [
    {
      title: '名称',
      dataIndex: 'jgname',
      width: '40%',
      key: 'jgname',
    },
    {
      title: '结构类型',
      dataIndex: 'jgtype',
      width: '100px',
      key: 'jgtype',
      render: (text, record, index) => {
        if (text === '0') {
          return '文件';
        }
        if (text === '1') {
          return '文件夹';
        }
      },
    },
    {
      title: '对应项',
      dataIndex: 'jgcorritem',
      width: '100px',
      key: 'jgcorritem',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '100px',
      render: (_, record) => {
        if (record.jgisedit === '1') {
          return (
            <span>
              <a
                href="javascript:;"
                onClick={(event) => {
                  event.nativeEvent.stopImmediatePropagation();
                  event.stopPropagation();
                  onDeleteAction(record);
                }}
                style={{
                  marginRight: 8,
                  color: '#F00',
                }}
              >
                删除
              </a>
            </span>
          );
        }
        if (record.jgisedit === '0') {
          return (
            <span>
              <a
                href="javascript:;"
                onClick={(event) => {
                  event.nativeEvent.stopImmediatePropagation();
                  event.stopPropagation();
                  onEditAction(record, 'edit');
                }}
                style={{
                  marginRight: 8,
                }}
              >
                编辑
              </a>
              <a
                href="javascript:;"
                onClick={(event) => {
                  event.nativeEvent.stopImmediatePropagation();
                  event.stopPropagation();
                  onDeleteAction(record);
                }}
                style={{
                  marginRight: 8,
                  color: '#F00',
                }}
              >
                删除
              </a>
            </span>
          );
        }
      },
    },
  ];
  const handlEepjgOk = () => {
    form.validateFields().then((values) => {
      const json = {};
      const { entries } = Object;
      entries(values).forEach(([key, value]) => {
        if (value) {
          json[key] = value;
        }
      });
      json.whrid = SysStore.getCurrentUser().id;
      json.whr = SysStore.getCurrentUser().yhmc;
      json.whsj = moment().format('YYYY-MM-DD HH:mm:ss');
      EepjgStore.saveData(json);
    });
  };

  const handleEepjgCancel = () => {
    setOptVisible(false);
    form.resetFields();
  };
  return (
    <>
      <Tooltip title="配置包结构">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<SettingOutlined />}
          onClick={(event) => {
            event.nativeEvent.stopImmediatePropagation();
            event.stopPropagation();
            click();
          }}
        />
      </Tooltip>
      <Modal
        title={<span className="m-title">配置包结构</span>}
        visible={visible}
        onCancel={(event) => {
          event.nativeEvent.stopImmediatePropagation();
          event.stopPropagation();
          handlePZBJGCancel();
        }}
        footer={null}
        width="40%"
      >
        <Button
          type="primary"
          style={{ fontSize: '12px' }}
          onClick={(event) => {
            event.nativeEvent.stopImmediatePropagation();
            event.stopPropagation();
            onAddAction('add');
          }}
        >
          <FileAddOutlined />
          新建
        </Button>
        <Table
          columns={eepjgcolumns}
          dataSource={EepjgStore.jgdata}
          pagination={false}
          className="record-bottomtable"
          loading={EepjgStore.eepjgloading}
          expandable={{ defaultExpandAllRows: true }}
          onRow={(record) => {
            return {
              onClick: (event) => {
                event.nativeEvent.stopImmediatePropagation();
                event.stopPropagation();
                console.log(record);
              },
            };
          }}
        />
      </Modal>
      <Modal
        title={<span className="m-title">{EepjgStore.optname}包结构</span>}
        visible={opt_visible}
        onOk={(event) => {
          event.nativeEvent.stopImmediatePropagation();
          event.stopPropagation();
          handlEepjgOk();
        }}
        onCancel={(event) => {
          event.nativeEvent.stopImmediatePropagation();
          event.stopPropagation();
          handleEepjgCancel();
        }}
        width="450px"
      >
        <div>
          <Form form={form} component={false}>
            <Form.Item
              label="上级结构:"
              name="jgfid"
              required
              rules={[{ required: true, message: '请选择上级结构' }]}
            >
              <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={EepjgStore.jgdata}
                placeholder="请选择上级结构"
                treeDefaultExpandAll
              />
            </Form.Item>
            <Form.Item
              label="结构名称:"
              name="jgname"
              required
              rules={[{ required: true, message: '请输入结构名称' }]}
            >
              <Input
                allowClear
                style={{ width: 300 }}
                placeholder="请输入结构名称"
              />
            </Form.Item>
            <Form.Item
              label="结构类型:"
              name="jgtype"
              required
              rules={[{ required: true, message: '请选择结构类型' }]}
            >
              <Select style={{ width: 300 }} placeholder="请选择结构类型">
                <option value="0">文件</option>
                <option value="1">文件夹</option>
              </Select>
            </Form.Item>
            <Form.Item
              label="&nbsp;对&nbsp;应&nbsp;项&nbsp;:"
              name="jgcorritem"
              required
              rules={[{ required: true, message: '请输入对应项' }]}
            >
              <Input
                allowClear
                style={{ width: 300 }}
                placeholder="请输入对应项"
              />
            </Form.Item>
            <Form.Item
              label="编辑状态:"
              name="jgisedit"
              required
              rules={[{ required: true, message: '请选择编辑状态' }]}
            >
              <Select style={{ width: 300 }} placeholder="请选择编辑状态">
                <option value="1">不可以编辑</option>
                <option value="0">可以编辑</option>
              </Select>
            </Form.Item>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="jgmbid" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="jgcontentid" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="jgxmllx" hidden>
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
});

export default settingEEP;
