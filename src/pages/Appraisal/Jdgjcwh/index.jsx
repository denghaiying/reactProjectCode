import React, { useEffect, useState } from 'react';
import { Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import EmptyData from '@/components/EmptyData';
import LoginStore from '../../../stores/system/LoginStore';
import './index.less';
import fetch from '../../../utils/fetch';
import { useIntl, FormattedMessage } from 'umi';
import { observer, useLocalObservable } from 'mobx-react';
import { runInAction } from 'mobx';
import SysStore from '@/stores/system/SysStore';
import {
  InputNumber,
  Input,
  Form,
  Select,
  Table,
  Button,
  DatePicker,
  Modal,
  Row,
  Col,
  message,
  Checkbox,
} from 'antd';
import { SearchOutlined, FileAddOutlined } from '@ant-design/icons';
import { Left } from '@icon-park/react';
import { values } from 'lodash';

/**
 * @Author: dfw
 * @Date: 2021/1/11
 * @Version: 9.0
 */
const Jdgjcwh = observer((props) => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const [field] = Form.useForm();
  const [addform] = Form.useForm();
  const [bjform] = Form.useForm();
  const [deleteform] = Form.useForm();

  const [visable, setVisable] = useState(false);
  const [editVisible, seteditVisible] = useState(false);
  const [deleteVisible, setdeleteVisible] = useState(false);

  const whrid = SysStore.getCurrentUser().id;
  const userinfo = SysStore.getCurrentUser();
  const form = React.createRef();

  useEffect(() => {
    JdgjcwhStore.findGjc();
  }, []);

  const JdgjcwhStore = useLocalObservable(() => ({
    gjcData: [],
    loading: false,
    newData: [],
    gcjKword: [],
    dataW: [],
    jsonData: [],
    listData: [],
    deleteData: [],
    setfieldcolumns: [
      {
        colSpan: 5,
        title: '关键词',
        dataIndex: 'kword1',
        width: 200,
        align: 'cneter',
      },
      {
        dataIndex: 'kword2',
        width: 200,
      },
      {
        dataIndex: 'kword3',
        width: 200,
      },
      {
        dataIndex: 'kword4',
        width: 200,
      },
      {
        dataIndex: 'kword5',
        width: 200,
      },
    ],

    afterQueryDataW(data) {
      const id = 'id';
      const kword = 'kword';
      const list = [];
      const a = data;
      if (a.length >= 1) {
        for (let i = 0; i < a.length; i += 5) {
          const tabledata = {};
          let length = a.length - i;
          if (length > 5) {
            length = 5;
          }
          for (let index = 1; index <= length; index++) {
            tabledata[id + index] = a[i + index - 1].id;
            tabledata[kword + index] = a[i + index - 1].kword;
          }
          list.push(tabledata);
        }
      }
      return list;
    },
    async findGjc(params) {
      this.loading = true;
      const response = await fetch.post(
        `/api/eps/control/main/jdgjcwh/queryForList`,
        {},
        { params },
      );
      if (response && response.data.success === true) {
        runInAction(() => {
          this.gjcData = response.data.results;
          this.dataW = this.afterQueryDataW(this.gjcData);
          this.loading = false;
        });
      } else if (response.data.success === false) {
        message.error(response.data.message);
        this.gjcData = [];
        this.loading = false;
      }
    },

    async insertGjc(params) {
      this.loading = true;
      const response = await fetch.post(
        `/api/eps/control/main/jdgjcwh/add`,
        {},
        { params },
      );
      if (response && response.data.success === true) {
        message.success('添加成功');
        this.loading = false;
      } else if (response.data.success === false) {
        message.error(response.data.message);
        this.loading = false;
      }
    },

    async updateGjc(params) {
      this.loading = true;
      params = this.beforeSaveData(params);
      const response = await fetch.post(
        `/api/eps/control/main/jdgjcwh/update`,
        params,
      );
      if (response && response.data.success === true) {
        message.success('修改成功');
        this.loading = false;
      } else if (response.data.success === false) {
        message.error(response.data.message);
      }
    },
    async deleteGjc(params) {
      this.loading = true;
      params = this.beforeSaveData(params);
      const response = await fetch.post(
        `/api/eps/control/main/jdgjcwh/delete`,
        params,
      );
      if (response && response.data.success === true) {
        message.success('删除成功');
        this.loading = false;
      } else if (response.data.success === false) {
        message.error(response.data.message);
      }
    },
    beforeSaveData(value) {
      const id = 'id';
      const kword = 'kword';
      const list = [];
      for (let index = 1; index <= 5; index++) {
        const mp1 = id + index;
        const mp2 = kword + index;
        if (value.hasOwnProperty(mp1) && value[mp1] !== null) {
          list.push({ id: value[mp1], kword: value[mp2] });
        }
      }
      return list;
    },
  }));
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = () => {
    field.validateFields().then((values) => {
      JdgjcwhStore.findGjc(values);
    });
  };

  const onaddClick = (values) => {
    addform.resetFields();
    addform.setFieldsValue({
      whr: userinfo.yhmc,
      whrid: userinfo.id,
      whsj: moment(),
    });
    setVisable(true);
  };
  const onCustomCancel = () => {
    setVisable(false);
    addform.resetFields();
  };

  const oneditFormCancel = () => {
    seteditVisible(false);
    bjform.resetFields();
  };
  const deleteFormCancel = () => {
    setdeleteVisible(false);
    deleteform.resetFields();
  };
  const onSave = async () => {
    addform.validateFields().then((values) => {
      JdgjcwhStore.insertGjc(values).then(() => {
        JdgjcwhStore.findGjc().then(() => {
          setVisable(false);
        });
      });
    });
  };

  const oneditSave = () => {
    bjform.validateFields().then((values) => {
      JdgjcwhStore.updateGjc(values).then(() => {
        JdgjcwhStore.findGjc().then(() => {
          seteditVisible(false);
        });
      });
    });
  };
  const deleteSave = () => {
    deleteform.validateFields().then((values) => {
      JdgjcwhStore.deleteGjc(values).then(() => {
        JdgjcwhStore.findGjc().then(() => {
          setdeleteVisible(false);
        });
      });
    });
  };

  const onEditAction = (record) => {
    edit(record);
  };
  const onDeleteAction = (record) => {
    deleteAction(record);
  };

  const deleteAction = (record) => {
    setdeleteVisible(true);
    const id = 'id';
    const disabled = 'disabled';
    for (let i = 2; i <= 5; i++) {
      const mp = id + i;
      if (record.hasOwnProperty(mp)) {
        JdgjcwhStore[disabled + i] = false;
      } else {
        JdgjcwhStore[disabled + i] = true;
      }
    }
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
      JdgjcwhStore.jsonData = json;
    });
    deleteform.setFieldsValue({
      kword1: json.kword1,
      kword2: json.kword2,
      kword3: json.kword3,
      kword4: json.kword4,
      kword5: json.kword5,
      id1: null,
      id2: null,
      id3: null,
      id4: null,
      id5: null,
    });
  };
  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = (record) => {
    seteditVisible(true);
    const id = 'id';
    const disabled = 'disabled';
    for (let i = 2; i <= 5; i++) {
      const mp = id + i;
      if (record.hasOwnProperty(mp)) {
        JdgjcwhStore[disabled + i] = false;
      } else {
        JdgjcwhStore[disabled + i] = true;
      }
    }
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
      JdgjcwhStore.jsonData = json;
    });
    bjform.setFieldsValue({
      kword1: json.kword1,
      kword2: json.kword2,
      kword3: json.kword3,
      kword4: json.kword4,
      kword5: json.kword5,
      id1: json.id1,
      id2: json.id2,
      id3: json.id3,
      id4: json.id4,
      id5: json.id5,
    });
  };
  const onid1Change = (record) => {
    if (record.target.checked == true) {
      deleteform.setFieldsValue({ id1: JdgjcwhStore.jsonData.id1 });
    } else {
      deleteform.setFieldsValue({ id1: null });
    }
  };
  const onid2Change = (record) => {
    if (record.target.checked == true) {
      deleteform.setFieldsValue({ id2: JdgjcwhStore.jsonData.id2 });
    } else {
      deleteform.setFieldsValue({ id1: null });
    }
  };
  const onid3Change = (record) => {
    if (record.target.checked == true) {
      deleteform.setFieldsValue({ id3: JdgjcwhStore.jsonData.id3 });
    } else {
      deleteform.setFieldsValue({ id1: null });
    }
  };
  const onid4Change = (record) => {
    if (record.target.checked == true) {
      deleteform.setFieldsValue({ id4: JdgjcwhStore.jsonData.id4 });
    } else {
      deleteform.setFieldsValue({ id1: null });
    }
  };
  const onid5Change = (record) => {
    if (record.target.checked == true) {
      deleteform.setFieldsValue({ id5: JdgjcwhStore.jsonData.id5 });
    } else {
      deleteform.setFieldsValue({ id1: null });
    }
  };

  const renderTableCell = (value, index, record) => {
    return (
      <div>
        <a href="javascript:;" onClick={() => onEditAction(value)}>
          编辑
        </a>
        <a
          href="javascript:;"
          onClick={() => onDeleteAction(value)}
          style={{ marginLeft: '10px' }}
        >
          删除
        </a>
      </div>
    );
  };

  const customForm = (
    <Modal
      title={'关键词【新增】'}
      visible={visable}
      onCancel={onCustomCancel}
      onOk={onSave}
      width={350}
      centered
    >
      <Form form={addform} labelCol={{ span: 5 }}>
        <Col>
          <Form.Item
            name="kword"
            label="关键词"
            rules={[{ required: true, message: '请输入关键词!' }]}
          >
            <Input allowClear style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="whr" label="维护人：">
            <Input disabled style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item hidden name="whrid" label="维护人：">
            <Input disabled style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="whsj" label="维护时间：" initialValue={moment()}>
            <DatePicker showTime disabled style={{ width: 200 }} />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
  const editForm = (
    <Modal
      title={'关键词【编辑】'}
      visible={editVisible}
      onCancel={oneditFormCancel}
      onOk={oneditSave}
      width={350}
      centered
    >
      <Form form={bjform} labelCol={{ span: 5 }}>
        <Col>
          <Form.Item name="kword1" label="关键词1">
            <Input style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="kword2"
            label="关键词2"
            hidden={JdgjcwhStore.disabled2}
          >
            <Input style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="kword3"
            label="关键词3"
            hidden={JdgjcwhStore.disabled3}
          >
            <Input style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="kword4"
            label="关键词4"
            hidden={JdgjcwhStore.disabled4}
          >
            <Input style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="kword5"
            label="关键词5"
            hidden={JdgjcwhStore.disabled5}
          >
            <Input style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Form.Item name="id1" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="id2" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="id3" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="id4" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="id5" hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
  const dForm = (
    <Modal
      title={'关键词【删除】'}
      visible={deleteVisible}
      onCancel={deleteFormCancel}
      onOk={deleteSave}
      centered
      width={350}
    >
      <Form form={deleteform} labelCol={{ span: 5 }}>
        <Col>
          <Checkbox name="cid1" onChange={onid1Change}>
            <Form.Item name="kword1" label="关键词1">
              <Input style={{ width: 200 }} disabled />
            </Form.Item>
          </Checkbox>
        </Col>
        <Col hidden={JdgjcwhStore.disabled2}>
          <Checkbox name="cid2" onChange={onid2Change}>
            <Form.Item name="kword2" label="关键词2">
              <Input style={{ width: 200 }} disabled />
            </Form.Item>
          </Checkbox>
        </Col>
        <Col hidden={JdgjcwhStore.disabled3}>
          <Checkbox name="cid3" onChange={onid3Change}>
            <Form.Item name="kword3" label="关键词3">
              <Input style={{ width: 200 }} disabled />
            </Form.Item>
          </Checkbox>
        </Col>
        <Col onChange={onid4Change} hidden={JdgjcwhStore.disabled4}>
          <Checkbox name="cid4">
            <Form.Item name="kword4" label="关键词4">
              <Input style={{ width: 200 }} disabled />
            </Form.Item>
          </Checkbox>
        </Col>
        <Col onChange={onid5Change} hidden={JdgjcwhStore.disabled5}>
          <Checkbox name="cid5">
            <Form.Item name="kword5" label="关键词5">
              <Input style={{ width: 200 }} disabled />
            </Form.Item>
          </Checkbox>
        </Col>
        <Form.Item name="id1" hidden>
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="id2" hidden>
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="id3" hidden>
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="id4" hidden>
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="id5" hidden>
          <Input style={{ width: 200 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
  return (
    <div className="hall-regist-Jdgjcwh">
      <div className="control">
        <Form form={field} layout="inline" colon={false}>
          <Form.Item label="关键词" name="kword">
            <Input
              style={{ width: 200 }}
              className="input"
              hasClear
              placeholder="请输入关键词"
            />
          </Form.Item>
          <Button
            type="primary"
            style={{ paddingLeft: 10 }}
            onClick={doSearchAction}
          >
            <SearchOutlined />
            查询
          </Button>
        </Form>
        <Button type="primary" style={{ marginLeft: 5 }} onClick={onaddClick}>
          <FileAddOutlined />
          新建
        </Button>
      </div>
      <div>
        <div>
          <Table
            bordered
            rowKey="id"
            dataSource={JdgjcwhStore.dataW}
            scroll={{ y: 'calc(100vh - 180px)' }}
            loading={JdgjcwhStore.loading}
            pagination={false}
          >
            {JdgjcwhStore.setfieldcolumns.map((col) => (
              <Table.Column
                align="left"
                ellipsis
                key={col.dataIndex}
                {...col}
              />
            ))}
            <Table.Column
              render={renderTableCell}
              align="cneter"
              width="100px"
            />
          </Table>
        </div>
      </div>
      {visable && customForm}
      {editVisible && editForm}
      {deleteVisible && dForm}
    </div>
  );
});

export default Jdgjcwh;
