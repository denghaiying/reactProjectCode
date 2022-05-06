import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { Form, Input, Checkbox, Message } from '@alifd/next';
import Identify from '../../../../components/common/identify.js';
import PtinfoStore from '../../../../stores/system/PtinfoStore';
import LoginStore from '../../../../stores/system/LoginStore';
import './loginForm.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const LoginForm = observer(props => {
  const { intl: { formatMessage } } = props;
  const { isScan, loginrec } = LoginStore;
  const [identifyValue, setIdentifyValue] = useState(false);

  useEffect(() => {
    LoginStore.getRemember();
  }, []);

  const getIdentifyValue = (e) => {
    setIdentifyValue(e);
  };

  const handleSubmit = (v) => {
    if (!v.loginname) {
      Message.error(`${formatMessage({ id: 'e9.login.loginname' })} ${formatMessage({ id: 'e9.info.data.require' })}`);
      return;
    }
    if (!v.identify) {
      Message.error(`${formatMessage({ id: 'e9.login.vericode' })} ${formatMessage({ id: 'e9.info.data.require' })}`);
      return;
    }
    if (!_.isEqual(v.identify, identifyValue.join().replace(/,/g, ''))) {
      Message.error(`${formatMessage({ id: 'e9.login.err.vc' })}`);
      return;
    }
    LoginStore.login(v.loginname, v.password, v.rememberlogin);
  };

  return (
    <div className="login-content">
      <div className="light-icon" />
      <div className="login-form">
        <p className="logo"><img src={PtinfoStore.record.ptinfoLogo || [require('@/styles/img/left-logo.png')]}  alt="" /></p>
        <p className="title">{PtinfoStore.record.ptinfoName || formatMessage({ id: 'e9.main.title' })}</p>
        <Form {...formItemLayout} size="large" >
          <FormItem
            className="login-form-item"
            label={<i className="logn-icon iconfont iconuser" />}
          >
            <Input defaultValue={loginrec.loginname} placeholder={formatMessage({ id: 'e9.login.loginname' })} name="loginname" />
          </FormItem>
          <FormItem
            className="login-form-item"
            label={<i className="logn-icon iconfont iconlock" />}
          >
            <Input htmlType="password" name="password" placeholder={formatMessage({ id: 'e9.login.password' })} />
          </FormItem>
          <FormItem
            className="login-form-item"
            label={<i className="logn-icon iconfont iconsecurity" />}
          >
            <Input placeholder={formatMessage({ id: 'e9.login.vericode' })}
              name="identify"
              innerAfter={<Identify getIdentifyValue={getIdentifyValue} />}
            />
          </FormItem>
          <FormItem>
            <Checkbox name="rememberlogin" defaultChecked={loginrec.rememberlogin}>{formatMessage({ id: 'e9.login.rememberlogin' })}</Checkbox>
          </FormItem>
          <FormItem style={{ marginTop: 24 }}>
            <Form.Submit validate
              type="primary"
              onClick={(v, e) => handleSubmit(v, e)}
              style={{ margin: '0', backgroundColor: '#2d88f8' }}
              loading={props.loading}
            >{formatMessage({ id: 'e9.login.submit' })}
            </Form.Submit>
          </FormItem>
        </Form>
        {!isScan ?
          <div className="code-div" onClick={() => LoginStore.showScan()} /> :
          <div className="code-back" onClick={() => LoginStore.showScan()} />}
        {isScan ? <div className="qrcode" style={{ opacity: 1 }} /> : ''}
      </div>
      <div className="water-area">
        <div className="point point-dot" />
        <div className="point point-1" />
        <div className="point point-2" />
      </div>
    </div>);
});

export default injectIntl(LoginForm);
