import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { Form, Input, Checkbox, Message } from '@alifd/next';
import Identify from '../../../../components/common/identify.js';
import PtinfoStore from '../../../../stores/system/PtinfoStore';
import LoginStore from '../../../../stores/system/LoginStore';
import './loginFormYellow.less';

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
      <div className="login-form-yellow">
        <div className="logo">
          <img src={PtinfoStore.record.ptinfoLogo || [require('@/styles/img/left-logo.png')]}
            width="36px"
            style={{ verticalAlign: 'middle' }}
            alt=""
          />
          {PtinfoStore.record.ptinfoName || formatMessage({ id: 'e9.main.title' })}
        </div>
        <div className="form-content">
          <div className="form-header">
            <div className="form-title">{formatMessage({ id: 'e9.login.title' })}</div>
            <div className="form-code">
              <img
                src={isScan ? [require('@/styles/img/erweima_white.png')] : [require('@/styles/img/back_white.png')]}
                width="24px"
                onClick={() => LoginStore.showScan()}
                alt=""
              />
            </div>
          </div>
          <Form {...formItemLayout} size="large" labelAlign="inset">
            <FormItem
              className="login-form-item"
              label={<i className="logn-icon iconfont iconuser1" />}
            >
              <Input placeholder={formatMessage({ id: 'e9.login.loginname' })} defaultValue={loginrec.loginname} name="loginname" />
            </FormItem>
            <FormItem
              className="login-form-item"
              label={<i className="logn-icon iconfont iconlock" />}
            >
              <Input htmlType="password" name="password" placeholder={formatMessage({ id: 'e9.login.password' })} />
            </FormItem>
            <FormItem
              className="login-form-item"
              label={<i className="logn-icon iconfont iconecurityCode" />}
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
              <Form.Submit
                validate
                type="primary"
                onClick={(v, e) => handleSubmit(v, e)}
                style={{
                  margin: '0',
                  background: 'linear-gradient(262deg,rgba(248,145,50,1),rgba(251,206,164,1))',
                }}
                loading={props.loading}
              >
                {formatMessage({ id: 'e9.login.submit' })}
              </Form.Submit>
            </FormItem>
          </Form>
        </div>
        {/* {isCodeShow ? <div className="code-div" onClick={this.handleChangeCodeShow}></div> :
        <div className="code-back" onClick={this.handleChangeCodeShow}></div>} */}
        {isScan && <div className="qrcode" style={{ opacity: 1 }} />}
      </div>
    </div>);
});

export default injectIntl(LoginForm);
