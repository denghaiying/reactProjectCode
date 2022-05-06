import React, { useEffect, useCallback, useState } from 'react';
import {
  FormOutlined,
  LogoutOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tabs,
} from 'antd';
import { useLocalObservable } from 'mobx-react';
import { history } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import util from '@/utils/util';
import SysStore from '@/stores/system/SysStore';
import HnnyLoginStore from '../../stores/system/HnnyLoginStore';
import fetch from '@/utils/fetch';
import Yhpxxx from '../../pages/sys/Yhpxxx/index';
import type { MenuInfo } from 'rc-menu/lib/interface';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { isMoment } from 'moment';
import moment from 'moment';
export type GlobalHeaderRightProps = {
  menu?: boolean;
};
const { TabPane } = Tabs;
/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  // await outLogin();
  util.clearLStorage('mtoken');
  util.clearLStorage('menuData');
  util.clearLStorage('currentUser');
  HnnyLoginStore.hnnylogout();

  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  // const { initialState, setInitialState } = useModel('@@initialState');
  const [uppwdvisible, setUpPwdVisible] = useState(false);
  const [yhxxvisible, setYhxxVisible] = useState(false);
  const [yhxxopenvisible, setYhxxopenVisible] = useState(false);
  const [form] = Form.useForm();
  const [yhform] = Form.useForm();
  const currentUser = SysStore.getCurrentUser();
  const yhmc = currentUser.yhmc;

  //获取当前用户ID
  const yhid = currentUser.id;

  const onMenuClick = useCallback((event: MenuInfo) => {
    const { key } = event;
    if (key === 'logout') {
      //  setInitialState({ ...initialState, currentUser: undefined });

      loginOut();
      return;
    }
    // history.push(`/account/${key}`);
    if (key === 'updatePwd') {
      setUpPwdVisible(true);
    }
    if (key == 'updateYhxx') {
      setYhxxVisible(true);
    }
  }, []);

  const AvatarStore = useLocalObservable(() => ({
    yhxxaction: 'add',
    yhData: {},
    yhxxid: '',

    async getUserOption(code) {
      console.log('-----------------getUserOption------------');
      const url =
        '/api/eps/control/main/params/getParamsDevOption?code=' +
        code +
        '&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);

      if (response.status === 200) {
        setYhxxopenVisible(response.data == 'Y');
        return response.data;
      } else {
        return;
      }
    },
    async queryYxx() {
      const response = await fetch.post(
        `/api/eps/control/main/amsyhxx/queryForId?code=` + currentUser.bh,
      );
      if (response.status === 200) {
        if (response.data == null) {
          this.yhData = {
            name: currentUser.yhmc,
            code: currentUser.bh,
            phone: currentUser.sjh,
            sex: currentUser.xb,
            dep: '',
            depcode: '',
          };
          this.yhxxaction = 'add';
          this.yhxxid = '';
          setYhxxVisible(true);
        } else {
          response.data.hdzjsj = moment(response.data.hdzjsj);
          response.data.sgsj = moment(response.data.sgsj);
          response.data.rssj = moment(response.data.rssj);
          this.yhData = response.data;
          this.yhxxid = response.data.id;
          this.yhxxaction = 'update';
        }
      } else {
        return;
      }
    },
    async update(values) {
      let url = `/api/eps/control/main/amsyhxx/` + this.yhxxaction;
      values.id = this.yhxxid;
      const { hdzjsj, rssj, sgsj } = values;
      if (isMoment(hdzjsj)) {
        values.hdzjsj = hdzjsj.format('YYYY-MM-DD HH:mm:ss');
      }
      if (isMoment(rssj)) {
        values.rssj = rssj.format('YYYY-MM-DD HH:mm:ss');
      }
      if (isMoment(sgsj)) {
        values.sgsj = sgsj.format('YYYY-MM-DD HH:mm:ss');
      }
      const response = await new HttpRequest('').get({
        url: url,
        params: values,
      });
      if (response && response.status === 200) {
        if (response.data.success === false) {
          message.error(`保存失败!`);
        } else {
          message.success(`保存成功!`);
        }
      }
    },
  }));
  useEffect(() => {
    // SearchStore.queryDw();
    AvatarStore.getUserOption('CONTROLYHXX').then((res) => {
      if (res === 'Y') {
        AvatarStore.queryYxx();
      }
    });
    // setFormData(props.data)
  }, []);
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {/* {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )} */}
      {/* {menu && <Menu.Divider />} */}
      {yhxxopenvisible && (
        <Menu.Item key="settings" onClick={() => setYhxxVisible(true)}>
          <UserOutlined />
          用户信息
        </Menu.Item>
      )}
      <Menu.Item key="updatePwd" onClick={() => setUpPwdVisible(true)}>
        <FormOutlined />
        修改密码
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  const onFinish = (values: any) => {
    if (yhid.length <= 0) {
      message.error('用户没有登陆无法修改密码！');
    }
    form
      .validateFields()
      .then(async (data) => {
        // const pwdResult = values.pwd;
        const pwdResult = window.btoa(values.pwd);
        const oldpwd = window.btoa(values.oldpassword);
        let url =
          '/api/eps/control/main/yh/changepassword?yhid=' +
          yhid +
          '&btoaPassword=' +
          pwdResult +
          '&yhmc=' +
          yhmc +
          '&oldpassword=' +
          oldpwd;
        const response = await fetch.post(url);
        if (response && response.status === 200) {
          if (response.data.success == false) {
            message.error(response.data.message);
            //    message.error(`修改密码失败!`);
            //     this.openNotification('修改密码失败', 'warning');
          } else {
            message.success(`修改密码成功!`);
            setUpPwdVisible(false);
            //  message.success(`修改密码成功!`);
            //  this.openNotification('修改密码成功', 'warning');
          }
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };
  const closeYhxxModal = () => {
    if (AvatarStore.yhxxaction === 'update') {
      setYhxxVisible(false);
    } else {
      message.error(
        '档案管理员（公司级或各单位的）第一次登录必须填写完整才可以开展工作！',
      );
    }
  };
  const updateYhxx = (values: any) => {
    console.log('updateYhxx');
    if (yhid.length <= 0) {
      message.error('用户没有登陆无法修改密码！');
    }
    yhform
      .validateFields()
      .then(async (data) => {
        AvatarStore.update(values).then((res) => {
          AvatarStore.queryYxx();
        });
      })
      .catch((err) => {
        message.error(err);
      });
  };
  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: '请填写!',
      },
    ],
  };
  const span = 12;
  const _width = 350;
  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Space size={5}>
            <Avatar
              size="small"
              className={styles.avatar}
              src={currentUser.headphoto}
              alt="avatar"
            />
            <span className={`${styles.name} anticon`}>{currentUser.yhmc}</span>
          </Space>
        </span>
      </HeaderDropdown>

      <Modal
        title="修改密码"
        centered
        visible={uppwdvisible}
        onCancel={() => setUpPwdVisible(false)}
        footer={null}
        width={500}
      >
        <div>
          <Space direction="vertical">
            <div style={{ width: 460 }}>
              <Form form={form} onFinish={onFinish} name="form1">
                <Row gutter={12}>
                  <Col span={24}>
                    <Form.Item
                      name="yhmc"
                      label="用户名称："
                      initialValue={yhmc}
                    >
                      <Input disabled style={{ width: _width }} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="旧密码:"
                      name="oldpassword"
                      required
                      rules={[{ required: true, message: '请输入旧密码!' }]}
                    >
                      <Input.Password style={{ width: _width }} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="新密码:"
                      name="pwd"
                      required
                      rules={[{ required: true, message: '请输入新密码！' }]}
                    >
                      <Input.Password style={{ width: _width }} />
                    </Form.Item>
                  </Col>
                  {/* <Col span={24}>
                    <Form.Item name="id" initialValue={yhid} hidden>
                      <Input hidden />
                    </Form.Item>
                  </Col> */}
                </Row>
                <div
                  className="btns"
                  style={{
                    textAlign: 'right',
                    height: '30px',
                    marginTop: '10px',
                    marginRight: '10px',
                    padding: ' 0 20px',
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ fontSize: '12px' }}
                    icon={<SaveOutlined />}
                  >
                    提交
                  </Button>
                  &nbsp; &nbsp; &nbsp;
                  <Button
                    type="primary"
                    onClick={() => setUpPwdVisible(false)}
                    style={{ fontSize: '12px' }}
                    icon={<SaveOutlined />}
                  >
                    取消
                  </Button>
                </div>
              </Form>
            </div>
          </Space>
        </div>
      </Modal>
      <Modal
        title="用户信息"
        centered
        visible={yhxxvisible}
        onCancel={() => closeYhxxModal()}
        footer={null}
        width={1100}
      >
        <Tabs tabPosition={'left'}>
          <TabPane tab="人员基本信息" key="1">
            <div
              style={{ height: '100%', overflowX: 'hidden', overflowY: 'auto' }}
            >
              <br />

              <Form
                name="yhform"
                form={yhform}
                initialValues={AvatarStore.yhData}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={updateYhxx}
                style={{ marginTop: '-15px' }}
              >
                <div style={{ marginTop: '0px' }}>
                  &nbsp;&nbsp;
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                  >
                    保存
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                </div>
                <div className="ant-form">
                  <Divider orientation="left" plain>
                    账号信息
                  </Divider>
                  <Row gutter={20}>
                    <Col span={span}>
                      <Form.Item label="姓名" name="name">
                        <Input
                          disabled
                          style={{ width: _width }}
                          className="ant-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={span}>
                      <Form.Item label="工号" name="code">
                        <Input
                          disabled
                          style={{ width: _width }}
                          className="ant-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={span}>
                      <Form.Item label="性别" name="sex">
                        <Select
                          style={{ width: _width }}
                          className="ant-select"
                        >
                          <option value="1">男</option>
                          <option value="2">女</option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={span}>
                      <Form.Item label="年龄" name="age">
                        <Input
                          style={{ width: _width }}
                          className="ant-input"
                        />
                        {/* <DatePicker disabled  format="YYYY-MM-DD" style={{width:  _width}}  /> */}
                      </Form.Item>
                    </Col>
                    <Col span={span}>
                      <Form.Item
                        required
                        label="部门"
                        name="dep"
                        rules={[{ required: true, message: '请输入部门！' }]}
                      >
                        <Input
                          style={{ width: _width }}
                          className="ant-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={span}>
                      <Form.Item
                        required
                        label="部门编码"
                        name="depcode"
                        rules={[
                          { required: true, message: '请输入部门编码！' },
                        ]}
                      >
                        <Input
                          style={{ width: _width }}
                          className="ant-input"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={span}>
                      <Form.Item label="手机号" name="phone">
                        <Input
                          style={{ width: _width }}
                          className="ant-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={span}>
                      <Form.Item
                        required
                        label="学历"
                        name="education"
                        rules={[{ required: true, message: '请输入学历！' }]}
                      >
                        <Input
                          style={{ width: _width }}
                          className="ant-input"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={span}>
                      <Form.Item
                        required
                        label="专业"
                        name="major"
                        rules={[{ required: true, message: '请输入专业！' }]}
                      >
                        <Input
                          style={{ width: _width }}
                          className="ant-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={span}>
                      <Form.Item
                        required
                        label="具有档案资格证"
                        name="sfjyzyzgzs"
                        rules={[{ required: true, message: '请输入！' }]}
                      >
                        <Select
                          style={{ width: _width }}
                          className="ant-select"
                        >
                          <option value="Y" defaultChecked>
                            是
                          </option>
                          <option value="N">否</option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={span} style={{ height: 52 }}>
                      <Form.Item label="获得证件时间" name="hdzjsj">
                        <DatePicker
                          placeholder="获得证件时间"
                          style={{ width: _width }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={span} style={{ height: 52 }}>
                      <Form.Item
                        required
                        label="入司时间"
                        name="rssj"
                        rules={[
                          { required: true, message: '请输入入司时间！' },
                        ]}
                      >
                        <DatePicker
                          placeholder="入司时间"
                          style={{ width: _width }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={span}>
                      <Form.Item label="上岗时间" name="sgsj">
                        <DatePicker
                          placeholder="上岗时间"
                          style={{ width: _width }}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={span}>
                      <Form.Item
                        label="专/兼职"
                        name="zjz"
                        rules={[{ required: true, message: '请输入专/兼职！' }]}
                      >
                        <Select
                          style={{ width: _width }}
                          className="ant-select"
                        >
                          <option value="1" defaultChecked>
                            专档
                          </option>
                          <option value="2">兼档</option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Form>
            </div>
          </TabPane>
          <TabPane tab="档案培训记录" key="2">
            <Yhpxxx yhxxid={AvatarStore.yhxxid} />
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default AvatarDropdown;
