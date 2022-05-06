import React, { useEffect, useState } from 'react';
import {
  Form,
  Pagination,
  Input,
  Select,
  Tooltip,
  Button,
  Modal,
  message,
  Row,
  Col,
  Divider,
  List,
  Avatar,
  Space,
  Badge,
} from 'antd';
import {
  MessageTwoTone,
  MailTwoTone,
  MessageFilled,
  SmileTwoTone,
  SafetyCertificateTwoTone,
  BellOutlined,
  CommentOutlined,
} from '@ant-design/icons';

import SysStore from '@/stores/system/SysStore';
import fetch from '../../utils/fetch';
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';
import './msg.less';
const { Search } = Input;
const { Option } = Select;

const msg = observer((props) => {
  const [modalHeight, setModalHeight] = useState(0);

  const msgStore = useLocalObservable(() => ({
    //获取当前用户名称
    yhmc: SysStore.getCurrentUser().yhmc,

    //获取当前默认单位id
    dwid: SysStore.getCurrentUser().dwid,
    //获取当前默认用户的角色
    roleCode: SysStore.getCurrentUser().golbalrole,
    //获取当前时间
    getDate: moment().format('YYYY-MM-DD HH:mm:ss'),

    //获取当前用户ID
    yhid: SysStore.getCurrentUser().id,
    state: '',
    yhcode: '',
    yhname: '',
    rqb: '',
    rqe: '',
    msg: '',
    pageIndex: 1,
    pageSize: 50,
    sortField: '',
    sortOrder: '',
    msgType: '',
    //获取消息list
    msgDataList: [],
    //获取消息类型list
    msgTypeList: [],
    msgDataTotal: 0,
    ids: '',
    zt: '',
    count: 0,

    async changeState() {
      var formData = new FormData();
      formData.append('ids', msgStore.ids);
      formData.append('state', msgStore.zt);
      const response = await fetch.post(
        `/eps/dsrw/pagemsg/changeState`,
        formData,
      );
      if (response.status === 200) {
        msgStore.zt = '';
        return;
      }
    },

    add_yhid: '',
    add_umid: '',
    add_umparams: '',
    add_msg: '',
    add_msgType: '',
    add_state: '',
    add_whsj: '',

    async addMsg() {
      var formData = new FormData();
      formData.append('yhid', msgStore.add_yhid);
      formData.append('umid', msgStore.add_umid);
      formData.append('umparams', msgStore.add_umparams);
      formData.append('msg', msgStore.add_msg);
      formData.append('msgType', msgStore.add_msgType);
      formData.append('state', msgStore.add_state);
      formData.append('whsj', msgStore.add_whsj);
      const response = await fetch.post(`/eps/dsrw/pagemsg/add`, formData);
      if (response.status === 200) {
        msgStore.queryCount();
        return;
      }
    },

    async queryCount() {
      const response = await fetch.post(`/eps/dsrw/pagemsg/queryCount?state=0`);
      if (response.status === 200) {
        this.count = response.data.results;
        return;
      }
    },

    async queryForPage() {
      // var formData = new FormData();
      // formData.append('data', value);
      const response = await fetch.get(
        `/eps/dsrw/pagemsg/queryForPage?yhid=${this.yhid}&state=${
          this.state
        }&yhcode=${this.yhcode}&yhname=${this.yhname}&rqb=${this.rqb}&rqe=${
          this.rqe
        }&msg=${this.msg}&msgType=${this.msgType}&pageIndex=${
          this.pageIndex - 1
        }&pageSize=${this.pageSize}&page=${this.pageIndex - 1}&limit=${
          this.pageSize
        }`,
      );
      if (response.status === 200) {
        this.msgDataList = response.data.results;
        this.msgDataTotal = response.data.total;
        msgStore.msgType = '';
      }
    },

    async queryByMsgType(values) {
      const response = await fetch.get(
        `/eps/dsrw/pagemsg/queryByMsgType?msgType=${values}`,
      );
      if (response.status === 200) {
        if (response.data.results && response.data.results.length > 0) {
          this.msgTypeList = response.data.results;
        }
        return;
      }
    },
  }));
  //初始化数据
  useEffect(() => {
    setModalHeight(window.innerHeight - 300);
    msgStore.queryCount();
  }, []);

  const [examine_visible, setExamineVisible] = useState(false);

  /**
   * 审核前的校验
   * @param value
   */
  const onOpenExamine_visible = async () => {
    await msgStore.queryForPage();
    await msgStore.queryByMsgType();
    await msgStore.queryCount();

    setExamineVisible(true);
  };

  /**
   * 根据搜索框名称查询
   * @param value
   */
  const onSearch = async (value) => {
    await msgStore.queryByMsgType(value);
  };

  const onSearchMsg = async (value) => {
    msgStore.msgType = value;
    msgStore.pageIndex = 1;
    //msgStore.state="";
    await msgStore.queryForPage();
  };

  const onPageChange = async (param, param2) => {
    console.log('param, param2', param, param2);
    msgStore.pageIndex = param;
    msgStore.pageSize = param2;
    await msgStore.queryForPage();
  };

  const changeState = async (id, zt) => {
    msgStore.ids = id;
    msgStore.zt = zt;
    await msgStore.changeState();
    await msgStore.queryForPage();
    await msgStore.queryCount();
  };

  const changeStateSelect = async (val: any) => {
    if (val) {
      msgStore.state = val;
      await msgStore.queryForPage();
    } else {
      msgStore.state = '';
      await msgStore.queryForPage();
    }
  };

  const changeAllState = async () => {
    if (msgStore.msgDataList.length > 0) {
      var ids = [];
      for (var i = 0; i < msgStore.msgDataList.length; i++) {
        ids.push(msgStore.msgDataList[i].id);
      }
      msgStore.ids = ids.toString();
      msgStore.zt = '1';
      await msgStore.changeState();
      await msgStore.queryForPage();
      await msgStore.queryCount();
    }
  };

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
  const style = { padding: '8px 0' };

  const getState = (value) => {
    if (value === '0') {
      return <font color="red">未读</font>;
    } else {
      return <font color="green">已读</font>;
    }
  };

  return (
    <>
      <Tooltip title="消息">
        {/* <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle"    icon={<MessageTwoTone />} onClick={() => onOpenExamine_visible()} /> */}
        <a onClick={() => onOpenExamine_visible()}>
          <Badge count={msgStore.count ? msgStore.count : 0} size="small">
            <img
              src={require('../../styles/assets/img/icon_message.png')}
              className="right-img"
              alt=""
            />
          </Badge>{' '}
        </a>
      </Tooltip>

      <Modal
        title={<span className="m-title">消息管理</span>}
        visible={examine_visible}
        onCancel={() => setExamineVisible(false)}
        footer={null}
        width="1300px"
        style={{ top: 50 }}
      >
        <div style={{ maxHeight: '600px', height: '600px' }}>
          <Row gutter={[8, 8]}>
            <Col span={6}>
              <div style={style}>
                <Search
                  placeholder="请输入名称"
                  allowClear
                  onSearch={onSearch}
                  style={{ width: 257 }}
                />
              </div>
              <div style={style}>
                <List
                  header={<a onClick={() => onSearchMsg('')}>全部</a>}
                  bordered
                  dataSource={msgStore.msgTypeList}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <a onClick={() => onSearchMsg(item.msgType)}>
                            {item.msgType ? item.msgType : '暂无分类'}
                          </a>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            </Col>

            <Col span={18}>
              <div style={style}>
                {' '}
                &nbsp; &nbsp;
                <Select
                  defaultValue=""
                  style={{ width: 120 }}
                  onChange={changeStateSelect}
                >
                  <Option value="">全部</Option>
                  <Option value="0">未读</Option>
                  <Option value="1">已读</Option>
                </Select>
                &nbsp; &nbsp; &nbsp;
                <Button type="primary" onClick={() => changeAllState()}>
                  全部标记为已读
                </Button>
              </div>
              <div className="list">
                <List
                  split
                  //bordered
                  dataSource={msgStore.msgDataList}
                  rowKey={(item) => item.id}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id}
                      actions={[
                        <IconText
                          icon={MailTwoTone}
                          text={getState(item.state)}
                          key="list-vertical-message"
                        />,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Badge count={item.state == '0' ? '新' : ''}>
                            <Avatar
                              style={{ backgroundColor: 'transparent' }}
                              icon={
                                <MessageTwoTone style={{ fontSize: '25px' }} />
                              }
                            />
                          </Badge>
                        }
                        title={
                          <a
                            onClick={() =>
                              changeState(item.id, item.state == 0 ? 1 : 0)
                            }
                          >
                            {item.msg}
                          </a>
                        }
                        description={item.whsj}
                      />
                    </List.Item>
                  )}
                />
              </div>
              <div className="div-right">
                <Pagination
                  showQuickJumper
                  showTotal={(total) => `共 ${total} 条信息`}
                  total={msgStore.msgDataTotal}
                  current={msgStore.pageIndex}
                  pageSize={msgStore.pageSize}
                  onChange={onPageChange}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
});
export default msg;
