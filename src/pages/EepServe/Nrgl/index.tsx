import EpsRecordPanel from '@/eps/components/panel/EpsRecordPanel';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useState, useRef } from 'react';
import { FileAddOutlined, ImportOutlined } from '@ant-design/icons';
import {
  observer,
  useLocalObservable,
  useObserver,
  runInAction,
} from 'mobx-react';
import {
  Table,
  Form,
  Input,
  InputNumber,
  message,
  Col,
  Select,
  Typography,
  Button,
  Modal,
  TreeSelect,
  Checkbox,
} from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import moment from 'moment';
import fetch from '../../../utils/fetch';
import NrglService from './service/NrglService';
import ComxmlService from './service/ComxmlService';
import FilexmlService from './service/FilexmlService';
import MetaxmlService from './service/MetaxmlService';
import SysStore from '../../../stores/system/SysStore';
import './index.less';
import SettingEEP from './settingEEP';
import AjDeploy from './ajDeploy';

const FormItem = Form.Item;
const { Option } = Select;
/**
 * 数据包服务---EEP内容管理，上面是内容管理，下面是三个具体详细XML
 *
 */
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {/* {inputNode} */}
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const Nrgl = observer((props) => {
  const [form] = Form.useForm();
  const [add_form] = Form.useForm();
  const [mb_form] = Form.useForm();
  const [qparams, setQparams] = useState({});
  const [pageno, setBottomPageno] = useState();
  const [pagesize, setBottomPagesize] = useState();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const [opt_visible, setOptVisible] = useState(false);
  const [mb_visible, setMbVisible] = useState(false);
  const [sffgchecked, setSffgchecked] = useState(false);

  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');
  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
    disableDelete: true,
    disableAdd: true,
  };

  // 表单名称
  const title: ITitle = {
    name: '内容管理',
  };
  // 上半部分store
  const NrglStore = useLocalObservable(() => ({
    mbdata: [],
    mbSelectdata: [],
    mbtype: '0',
    mbenable: '0',
    mbeepjg: '0',
    // 查询模版数据
    async findMb() {
      // const params = { params: { mbenable: "0" } };
      const response = await fetch.get('/api/eps/e9eep/eepmb/getmblist', {
        params: { mbenable: '0' },
      });
      if (response.status === 200) {
        if (response.data.length !== 0) {
          this.mbdata = response.data;
          this.mbSelectdata = response.data.map(
            (item: { id: any; mbname: any }) => ({
              value: item.id,
              label: item.mbname,
              key: item.id,
              title: item.mbname,
            }),
          );
        }
      }
    },
  }));
  // 下半部分store
  const XmlTreeStore = useLocalObservable(() => ({
    xmlloading: false,
    pageno: 1,
    pagesize: 50,
    xmldata: [],
    mbdata: [],
    isMHidden: true,
    mpid: '',
    mbeepjg: '',
    // 根据主表点击行传的参数查询XML树形数据源
    async findXmlById(params) {
      this.xmlloading = true;
      setQparams(params);
      const response = await fetch.get(
        '/api/eps/e9eep/eepcontent/getEepcontentTree',
        params,
      );
      if (response && response.status === 200) {
        this.xmldata = response.data;
        this.xmlloading = false;
      }
    },
    // 根据单位查询模版树形数据源
    async findMbByDw(params) {
      const response = await fetch.get(
        '/api/eps/control/main/mb/queryAll',
        params,
      );
      if (response && response.status === 200) {
        if (response.data.length > 0) {
          this.mbdata = response.data.map((o) => ({
            id: o.id,
            label: o.mc,
            value: o.id,
            key: o.id,
            title: o.mc,
          }));
        }
      }
    },
    // 下半部分XML内容新增保存
    async saveData(values) {
      let data = {};
      const { entries } = Object;
      if (values.lx === '0') {
        // 普通XML
        entries(values).forEach(([key, value]) => {
          if (key === 'name') {
            data['comxmlkey'] = value;
          } else if (key === 'fid') {
            data['comxmlfid'] = value;
          } else if (key === 'isupdate') {
            data['comxmlisedit'] = value;
          } else if (key === 'corritem') {
            data['comxmlcorritem'] = value;
          } else if (key === 'type') {
            data['comxmltype'] = value;
          } else {
            data[key] = value;
          }
        });
        data['comxmlmpid'] = XmlTreeStore.mpid;
        const response = await fetch.post(`/api/eps/e9eep/comxml/`, data);
        if (response && response.status === 201) {
          message.success('数据添加成功');
          setOptVisible(false);
          XmlTreeStore.isMHidden = true;
          const params = {
            params: { mpid: XmlTreeStore.mpid, type: XmlTreeStore.mbeepjg },
          };
          XmlTreeStore.findXmlById(params);
        } else {
          message.error('数据添加失败!');
          setOptVisible(false);
          XmlTreeStore.isMHidden = true;
        }
      } else if (values.lx === '1') {
        // 文件XML
        entries(values).forEach(([key, value]) => {
          if (key === 'name') {
            data['filexmlkey'] = value;
          } else if (key === 'fid') {
            data['filexmlcomxmlid'] = value;
          } else if (key === 'isupdate') {
            data['filexmlisedit'] = value;
          } else if (key === 'corritem') {
            data['filexmlcorritem'] = value;
          } else {
            data[key] = value;
          }
        });
        data['filexmlmpid'] = XmlTreeStore.mpid;
        const response = await fetch.post(`/api/eps/e9eep/filexml/`, data);
        if (response && response.status === 201) {
          message.success('数据添加成功');
          setOptVisible(false);
          XmlTreeStore.isMHidden = true;
          const params = {
            params: { mpid: XmlTreeStore.mpid, type: XmlTreeStore.mbeepjg },
          };
          XmlTreeStore.findXmlById(params);
        } else {
          message.error('数据添加失败!');
          setOptVisible(false);
          XmlTreeStore.isMHidden = true;
        }
      } else if (values.lx === '2') {
        // 元数据XML
        entries(values).forEach(([key, value]) => {
          if (key === 'name') {
            data['metaxmlkey'] = value;
          } else if (key === 'fid') {
            data['metaxmlfid'] = value;
          } else if (key === 'isupdate') {
            data['metaxmlisedit'] = value;
          } else if (key === 'mcode') {
            data['metaxmlmcode'] = value;
          } else if (key === 'corritem') {
            data['metaxmlcorritem'] = value;
          } else {
            data[key] = value;
          }
        });
        data['metaxmlmpid'] = XmlTreeStore.mpid;
        const response = await fetch.post(`/api/eps/e9eep/metaxml/`, data);
        if (response && response.status === 201) {
          message.success('数据添加成功');
          setOptVisible(false);
          XmlTreeStore.isMHidden = true;
          const params = {
            params: { mpid: XmlTreeStore.mpid, type: XmlTreeStore.mbeepjg },
          };
          XmlTreeStore.findXmlById(params);
        } else {
          message.error('数据添加失败!');
          setOptVisible(false);
          XmlTreeStore.isMHidden = true;
        }
      }
    },
    // 根据id删除普通XML记录
    async deleteComxmlForId(id) {
      const response = await fetch.delete(`/api/eps/e9eep/comxml/${id}`);
      if (response) {
        console.log(XmlTreeStore);
        const params = {
          params: { mpid: XmlTreeStore.mpid, type: XmlTreeStore.mbeepjg },
        };
        XmlTreeStore.findXmlById(params);
      }
    },
    // 根据id删除文件XML记录
    async deleteFilexmlForId(id) {
      const response = await fetch.delete(`/api/eps/e9eep/filexml/${id}`);
      if (response) {
        const params = {
          params: { mpid: XmlTreeStore.mpid, type: XmlTreeStore.mbeepjg },
        };
        XmlTreeStore.findXmlById(params);
      }
    },
    // 根据id删除元数据XML记录
    async deleteMetaxmlForId(id) {
      const response = await fetch.delete(`/api/eps/e9eep/metaxml/${id}`);
      if (response) {
        const params = {
          params: { mpid: XmlTreeStore.mpid, type: XmlTreeStore.mbeepjg },
        };
        XmlTreeStore.findXmlById(params);
      }
    },
    // 根据id删除文件XML记录
    async importformbzlx(param) {
      debugger;
      const response = await fetch.post(
        '/api/eps/e9eep/eepcontent/importForMbzlx',
        param,
      );
      if (response && response.status === 201) {
        message.success('从模版导入著录项成功');
        debugger;
        XmlTreeStore.findXmlById({
          params: { mpid: XmlTreeStore.mpid, type: XmlTreeStore.mbeepjg },
        });
        setMbVisible(false);
        setSffgchecked(false);
      }
    },
  }));
  const [initParams, setInitParams] = useState({});
  const ref = useRef();
  useEffect(() => {
    NrglStore.findMb();
  }, []);
  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '数据包名称',
      code: 'contentname',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '所属模版',
      code: 'contentmbid',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
      render: (text, record, index) => {
        for (let i = 0; i < NrglStore.mbdata.length; i++) {
          const mb = NrglStore.mbdata[i];
          if (mb.id === text) {
            return mb.mbname;
          }
        }
      },
    },
    {
      title: '模版结构',
      code: 'contentmbeepjg',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
      render: (text, record, index) => {
        if (text === '0') {
          return '一文一件';
        }
        if (text === '1') {
          return '案卷';
        }
        if (text === '2') {
          return '党政机关一文一件';
        }
        if (text === '3') {
          return '会计档案一文一件';
        }
        if (text === '4') {
          return '财务档案案卷';
        }
        if (text === '5') {
          return '苏州地铁案卷';
        }
        if (text === '6') {
          return '中交二公局一文一件';
        }
        if (text === '7') {
          return '溧水档案馆一文一件';
        }
        if (text === '8') {
          return '申万宏源案卷';
        }
        if (text === '9') {
          return '申万宏源合同类一文一件';
        }
        if (text === '10') {
          return '申万宏源流程类一文一件';
        }
      },
    },
    {
      title: '包说明',
      code: 'contentremarks',
      align: 'center',
      width: 230,
      formType: EpsFormType.Input,
    },
  ];
  // 高级搜索框
  const searchFrom = () => {
    return (
      <>
        <FormItem label="模版" className="form-item" name="contentmbid">
          <Select
            style={{ width: 300 }}
            placeholder="请选择模版"
            options={NrglStore.mbSelectdata}
          />
        </FormItem>
        <FormItem label="数据包名称" className="form-item" name="contentname">
          <Input style={{ width: 300 }} placeholder="请输入数据包名称" />
        </FormItem>
      </>
    );
  };
  // 自定义弹框表单
  const customForm = (text, form) => {
    // 自定义表单
    return (
      <>
        <Form.Item
          label="数据包名称:"
          name="contentname"
          required
          rules={[{ required: true, message: '数据包名称' }]}
        >
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          label="模版:"
          name="contentmbid"
          required
          rules={[{ required: true, message: '请选择模版' }]}
        >
          <Select
            disabled
            style={{ width: 300 }}
            placeholder="请选择模版"
            options={NrglStore.mbSelectdata}
          />
        </Form.Item>
        <Form.Item
          label="模版结构:"
          name="contentmbeepjg"
          required
          rules={[{ required: true, message: '请选择模版结构' }]}
        >
          <Select disabled style={{ width: 300 }} placeholder="请选择模版结构">
            <option value="0">一文一件</option>
            <option value="1">案卷</option>
          </Select>
        </Form.Item>
        <Form.Item label="包说明:" name="contentremarks">
          <Input.TextArea
            allowClear
            showCount
            maxLength={500}
            style={{ height: '10px', width: '300px' }}
          />
        </Form.Item>
        <Form.Item label="维护人:" name="whr">
          <Input disabled defaultValue={whr} style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj">
          <Input disabled defaultValue={whsj} style={{ width: 300 }} />
        </Form.Item>
      </>
    );
  };
  // 主表格行点击事件
  const onPanelChange = (record: any) => {
    const params = { params: { mpid: record.id, type: record.contentmbeepjg } };
    XmlTreeStore.mpid = record.id;
    XmlTreeStore.mbeepjg = record.contentmbeepjg;
    XmlTreeStore.findXmlById(params);
    XmlTreeStore.findMbByDw({ params: { dw: '', notree: 'Y' } });
  };
  // 行编辑编辑按钮事件
  const editBottom = (record) => {
    form.setFieldsValue({
      key: '',
      name: '',
      mcode: '',
      corritem: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  // 行编辑取消按钮事件
  const cancelBottom = () => {
    setEditingKey('');
  };
  // 行编辑确定保存按钮事件
  const saveBottom = async (record) => {
    console.log(record);
    const row = await form.validateFields();
    let data = {};
    if (record.lx === '0') {
      data.id = record.key;
      data.comxmlkey = row.name;
      data.comxmlcorritem = row.corritem;
      ComxmlService.updateForTable(data).then(() => {
        XmlTreeStore.findXmlById(qparams);
      });
    } else if (record.lx === '1') {
      data.id = record.key;
      data.filexmlkey = row.name;
      data.filexmlcorritem = row.corritem;
      FilexmlService.updateForTable(data).then(() => {
        XmlTreeStore.findXmlById(qparams);
      });
    } else if (record.lx === '2') {
      data.id = record.key;
      data.metaxmlkey = row.name;
      data.metaxmlmcode = row.mcode;
      data.metaxmlcorritem = row.corritem;
      MetaxmlService.updateForTable(data).then(() => {
        XmlTreeStore.findXmlById(qparams);
      });
    }
    setEditingKey('');
  };
  // 下半部分列表操作列删除事件
  const onDeleteXmlAction = (record) => {
    if (record.children != null && record.children.length > 0) {
      message.warning('请先删除子节点XML！');
      return;
    }
    if (record.lx === '0') {
      XmlTreeStore.deleteComxmlForId(record.key);
    } else if (record.lx === '1') {
      XmlTreeStore.deleteFilexmlForId(record.key);
    } else if (record.lx === '2') {
      XmlTreeStore.deleteMetaxmlForId(record.key);
    }
  };
  // 下半部分表头及操作列
  const zcolumns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: '42%',
      editable: true,
    },
    {
      title: '编码',
      dataIndex: 'mcode',
      width: '10%',
      editable: false,
    },
    {
      title: '对应项',
      dataIndex: 'corritem',
      width: '42%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => {
        if (record.isupdate === '0') {
          return (
            <Typography.Link
              onClick={(event) => {
                event.nativeEvent.stopImmediatePropagation();
                event.stopPropagation();
                onDeleteXmlAction(record);
              }}
            >
              &nbsp;<span style={{ marginRight: 8, color: '#F00' }}>删除</span>
            </Typography.Link>
          );
        }
        if (record.isupdate === '1') {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <a
                href="javascript:;"
                onClick={(event) => {
                  event.nativeEvent.stopImmediatePropagation();
                  event.stopPropagation();
                  saveBottom(record);
                }}
                style={{
                  marginRight: 8,
                }}
              >
                确定
              </a>
              <a
                href="javascript:;"
                onClick={(event) => {
                  event.nativeEvent.stopImmediatePropagation();
                  event.stopPropagation();
                  cancelBottom();
                }}
                style={{
                  marginRight: 8,
                }}
              >
                取消
              </a>
            </span>
          ) : (
            <>
              <Typography.Link
                disabled={editingKey !== ''}
                onClick={(event) => {
                  event.nativeEvent.stopImmediatePropagation();
                  event.stopPropagation();
                  editBottom(record);
                }}
              >
                编辑
              </Typography.Link>
              <Typography.Link
                disabled={editingKey !== ''}
                onClick={(event) => {
                  event.nativeEvent.stopImmediatePropagation();
                  event.stopPropagation();
                  onDeleteXmlAction(record);
                }}
              >
                &nbsp;
                <span style={{ marginRight: 8, color: '#F00' }}>删除</span>
              </Typography.Link>
            </>
          );
        }
      },
    },
  ];
  //
  const mergedColumns = zcolumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        // inputType: col.dataIndex === 'age' ? 'number' : 'text',
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  /**
   * 分页器，切换页数/每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onBottomPageSizeChange = (page, pageSize) => {
    setBottomPageno(page);
    setBottomPagesize(pageSize);
  };
  // 下半部分新增按钮事件
  const onAddAction = () => {
    if (XmlTreeStore.xmldata.length === 0) {
      message.warning('请先选择一条内容记录！');
      return;
    }
    console.log(XmlTreeStore.xmldata);
    XmlTreeStore.isMHidden = true;
    setOptVisible(true);
    add_form.resetFields();
    add_form.setFieldsValue({ isupdate: '1' });
  };
  const onMbAction = () => {
    if (XmlTreeStore.xmldata.length === 0) {
      message.warning('请先选择一条内容记录！');
      return;
    }
    console.log(XmlTreeStore.xmldata);
    setMbVisible(true);
    mb_form.resetFields();
  };
  // XML新增页确定操作事件
  const handlXmlOk = () => {
    add_form.validateFields().then((values) => {
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
      XmlTreeStore.saveData(json);
    });
  };
  // 关闭XML新增页
  const handleXmlCancel = () => {
    setOptVisible(false);
    XmlTreeStore.isMHidden = true;
    form.resetFields();
  };
  // 用于XML新增页上级节点树形下拉框选中切换值时联动赋值预以及控制M编码录入项显不显示
  const onXmlTreeChange = (value, label, extra) => {
    const currentXml = extra.triggerNode.props;
    add_form.setFieldsValue({ type: currentXml.type, lx: currentXml.lx });
    if (currentXml.lx === '2') {
      XmlTreeStore.isMHidden = false;
    } else {
      XmlTreeStore.isMHidden = true;
    }
  };
  const onLxChange = (value, label) => {
    if (value === '2') {
      XmlTreeStore.isMHidden = false;
    } else {
      XmlTreeStore.isMHidden = true;
    }
  };
  // 从模版导入
  const handlMbOk = () => {
    mb_form.validateFields().then((values) => {
      const json = {};
      const { entries } = Object;
      entries(values).forEach(([key, value]) => {
        if (value) {
          json[key] = value;
        }
      });
      json.eepcontentid = XmlTreeStore.mpid;
      json.whrid = SysStore.getCurrentUser().id;
      json.whr = SysStore.getCurrentUser().yhmc;
      json.whsj = moment().format('YYYY-MM-DD HH:mm:ss');
      debugger;
      XmlTreeStore.importformbzlx(json).catch(() => {
        message.warning('从模板导入著录项失败！');
      });
    });
  };
  const handleMbCancel = () => {
    setMbVisible(false);
    form.resetFields();
    setSffgchecked(false);
  };

  const handleMbChange = (value, option) => {
    mb_form.setFieldsValue({ dambid: value, dambmc: option.children });
  };
  const onMbXmlTreeChange = (value, label, extra) => {
    debugger;
    const currentXml = extra.triggerNode.props;
    mb_form.setFieldsValue({ type: currentXml.type, lx: currentXml.lx });
  };
  const onSffgChange = (e) => {
    if (e.target.checked) {
      setSffgchecked(true);
      mb_form.setFieldsValue({ sffg: 'Y' });
    } else {
      setSffgchecked(false);
      mb_form.setFieldsValue({ sffg: 'N' });
    }
  };
  // 自定义从组件
  const bottomAction = (store, rows) => {
    return (
      <>
        <Button.Group style={{ paddingTop: '10px', paddingBottom: '10px' }}>
          <Button
            type="primary"
            style={{ fontSize: '12px' }}
            onClick={(event) => {
              event.nativeEvent.stopImmediatePropagation();
              event.stopPropagation();
              onAddAction();
            }}
          >
            <FileAddOutlined />
            新建
          </Button>
          <Button
            type="primary"
            style={{ fontSize: '12px' }}
            onClick={(event) => {
              event.nativeEvent.stopImmediatePropagation();
              event.stopPropagation();
              onMbAction();
            }}
          >
            <ImportOutlined />
            从模版导入
          </Button>
        </Button.Group>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={XmlTreeStore.xmldata}
            columns={mergedColumns}
            rowClassName="editable-row"
            className="record-bottomtable"
            expandable={{
              defaultExpandAllRows: true,
            }}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              defaultCurrent: XmlTreeStore.pageno,
              defaultPageSize: XmlTreeStore.pagesize,
              pageSize: pagesize,
              current: pageno,
              onChange: onBottomPageSizeChange,
              showTotal: (total, range) => `共 ${total} 条数据`,
            }}
            loading={XmlTreeStore.xmlloading}
          />
        </Form>
        <Modal
          title={<span className="m-title">新增XML节点</span>}
          visible={opt_visible}
          onOk={(event) => {
            event.nativeEvent.stopImmediatePropagation();
            event.stopPropagation();
            handlXmlOk();
          }}
          onCancel={(event) => {
            event.nativeEvent.stopImmediatePropagation();
            event.stopPropagation();
            handleXmlCancel();
          }}
          width="450px"
        >
          <div>
            <Form form={add_form} component={false}>
              <Form.Item
                label="上级节点:"
                name="fid"
                required
                rules={[{ required: true, message: '请选择上级节点' }]}
              >
                <TreeSelect
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                  treeData={XmlTreeStore.xmldata}
                  placeholder="请选择上级节点"
                  onChange={onXmlTreeChange}
                  treeDefaultExpandAll
                />
              </Form.Item>
              <Form.Item
                label="节点名称:"
                name="name"
                required
                rules={[{ required: true, message: '请输入节点名称' }]}
              >
                <Input
                  allowClear
                  style={{ width: 300 }}
                  placeholder="请输入节点名称"
                />
              </Form.Item>
              <Form.Item
                label="XML类型:"
                name="lx"
                required
                rules={[{ required: true, message: '请选择XML类型' }]}
              >
                <Select
                  style={{ width: 300 }}
                  placeholder="请选择XML类型"
                  onChange={onLxChange}
                >
                  <option value="0">普通xml</option>
                  <option value="1">文件xml</option>
                  <option value="2">元数据xml</option>
                </Select>
              </Form.Item>
              <Form.Item
                label="&emsp;M&nbsp;编&nbsp;码&nbsp;:"
                name="mcode"
                hidden={XmlTreeStore.isMHidden}
              >
                <Input
                  allowClear
                  style={{ width: 300 }}
                  placeholder="请输入M编码"
                />
              </Form.Item>
              <Form.Item
                label="&emsp;对&nbsp;应&nbsp;项&nbsp;:"
                name="corritem"
              >
                <Input
                  allowClear
                  style={{ width: 300 }}
                  placeholder="请输入对应项"
                />
              </Form.Item>
              <Form.Item
                label="编辑状态:"
                name="isupdate"
                required
                rules={[{ required: true, message: '请选择编辑状态' }]}
              >
                <Select style={{ width: 300 }} placeholder="请选择编辑状态">
                  <option value="0">不可以编辑</option>
                  <option value="1">可以编辑</option>
                </Select>
              </Form.Item>
              <Form.Item name="type" hidden>
                <Input />
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <Modal
          title={<span className="m-title">从模版导入</span>}
          visible={mb_visible}
          onOk={(event) => {
            event.nativeEvent.stopImmediatePropagation();
            event.stopPropagation();
            handlMbOk();
          }}
          onCancel={(event) => {
            event.nativeEvent.stopImmediatePropagation();
            event.stopPropagation();
            handleMbCancel();
          }}
          width="450px"
        >
          <div>
            <Form form={mb_form} component={false}>
              <Form.Item
                label="上级节点:"
                name="xmlfid"
                required
                rules={[{ required: true, message: '请选择上级节点' }]}
              >
                <TreeSelect
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                  treeData={XmlTreeStore.xmldata}
                  placeholder="请选择上级节点"
                  onChange={onMbXmlTreeChange}
                  treeDefaultExpandAll
                />
              </Form.Item>
              <Form.Item
                label="所属模版:"
                name="dambid"
                required
                rules={[{ required: true, message: '请选择所属模版' }]}
              >
                <Select
                  style={{ width: 300 }}
                  placeholder="所属模版"
                  onChange={handleMbChange}
                >
                  {XmlTreeStore.mbdata.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <FormItem label="是否覆盖:" name="sffg">
                <Checkbox
                  checked={sffgchecked}
                  onChange={onSffgChange}
                ></Checkbox>
              </FormItem>
              <Form.Item name="dambmc" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="type" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="lx" hidden>
                <Input />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </>
    );
  };

  const customTableAction = (text, record, index, store) => {
    const res: any[] = [];
    res.push(
      <SettingEEP record={record} key={'SettingEEP' + index} store={store} />,
    );
    if (
      record.contentmbeepjg === '1' ||
      record.contentmbeepjg === '4' ||
      record.contentmbeepjg === '8'
    ) {
      res.push(
        <AjDeploy record={record} key={'AjDeploy' + index} store={store} />,
      );
    }
    return res;
  };
  return (
    <>
      <EpsRecordPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp}
        initParams={initParams} // 右侧表格设置属性，选填
        tableService={NrglService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={500}
        searchForm={searchFrom} // 高级搜索查询框
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        bottomAction={(store, record) => bottomAction(store, record)}
        tableRowClick={(record) => onPanelChange(record)}
        customTableAction={customTableAction}
      ></EpsRecordPanel>
    </>
  );
});

export default Nrgl;
