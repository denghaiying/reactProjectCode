/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Message } from '@alifd/next';
import util from '@/utils/util';
import GVerify from './verify';
import PtinfoStore from '../../../../stores/system/PtinfoStore';
import LoginStore from '../../../../stores/system/LoginStore';
import { Form, Input, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';

import './loginFormComp.less';
import leftBgPng from './images/left-bg.png';
import lightPng from './images/light.png';
import qrCodePng from './images/qr-code.png';
import loginBackPng from './images/login-back.png';
import accountPng from './images/account-icon.png';
import passwordPng from './images/password-icon.png';
import icon_user from './images/other/icon_user.png';
import icon_password from './images/other/icon_password.png';

{
  /* <p className="bottom-text"><span style={{ marginRight: '15px' }}>智慧城市</span><span>万物互联</span></p> */
}

const LoginFormComp = observer((props) => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const [identifyValue, setIdentifyValue] = useState('');
  const [value, setValue] = useState({});
  const [gvid, setGvid] = useState(util.uuid());
  const [form] = Form.useForm();

  useEffect(() => {
    LoginStore.findXTname();
    LoginStore.findVscode();

    // util.setLStorage('loginPath', props.location.pathname);
    LoginStore.getRemember().then(() => {
      setValue(LoginStore.loginrec);
      // LoginStore.findPicture().then(() => {
      //   document.getElementById("ss").src = window.URL.createObjectURL(new Blob([LoginStore.picture]));
      // });
    });
  }, []);

  const getIdentifyValue = (e) => {
    setIdentifyValue(e);
  };
  const keyupadditem = (e) => {
    if (e.which !== 13) return;
    console.log('你按了回车键...');
    doSubmit();
  };
  const doSubmit = () => {
    debugger;
    if (!value.loginname) {
      Message.error(
        `${formatMessage({ id: 'e9.login.loginname' })} ${formatMessage({
          id: 'e9.info.data.require',
        })}`,
      );
      return;
    }
    if (!value.password) {
      Message.error(
        `${formatMessage({ id: 'e9.login.password' })} ${formatMessage({
          id: 'e9.info.data.require',
        })}`,
      );
      return;
    }
    if (LoginStore.vscodebloon) {
      if (!value.vericode) {
        Message.error(
          `${formatMessage({ id: 'e9.login.vericode' })} ${formatMessage({
            id: 'e9.info.data.require',
          })}`,
        );
        return;
      }
      if (
        !_.isEqual(value.vericode.toLowerCase(), identifyValue.toLowerCase())
      ) {
        Message.error(`${formatMessage({ id: 'e9.login.err.vc' })}`);
        setGvid(util.uuid());
        return;
      }
    }
    LoginStore.login(value.loginname, value.password, value.rememberlogin)
      .then(() => {
        if (LoginStore.dlmeg) {
          Message.error(LoginStore.dlmeg);
        }
      })
      .catch((err) => {
        Message.error(err.message);
        setGvid(util.uuid());
      });
  };

  const closeModal = (e) => {
    LoginStore.setMmdoalVisible(false);
  };

  const changepasswordSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        LoginStore.changepassword(
          values.yhid,
          values.password,
          values.oldpassword,
        )
          .then((respons) => {})
          .catch((err) => {
            Message.error(err.message);
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <div className="login-page">
      <div></div>
      <div className="container">
        titleList
        <p className="title">
          <span></span>
          <span>{props.title}</span>
        </p>
        <div className="white">
          <p className="title-login">用户登录</p>
          <div className="input">
            <img src={icon_user} alt="" />
            <input
              type="text"
              className="my-input"
              placeholder={formatMessage({ id: 'e9.login.loginname' })}
              value={value.loginname || ''}
              onChange={(obj) => {
                const { ...v } = value;
                v.loginname = obj.target.value;
                setValue(v);
              }}
              onKeyPress={keyupadditem}
            />
          </div>
          <div className="input">
            <img src={icon_password} alt="" />
            <input
              type="password"
              className="my-input"
              placeholder={formatMessage({ id: 'e9.login.password' })}
              value={value.password || ''}
              onChange={(obj) => {
                const { ...v } = value;
                v.password = obj.target.value;
                setValue(v);
              }}
              onKeyPress={keyupadditem}
            />
          </div>

          <div className="control">
            <div className="left">
              <input type="checkbox" checked onChange={() => {}}></input>
              自动登录
            </div>
          </div>
          <div
            className="login-btn"
            onClick={() => {
              doSubmit();
            }}
          >
            登 录
          </div>
        </div>
      </div>
    </div>
  );
});

export default LoginFormComp;
