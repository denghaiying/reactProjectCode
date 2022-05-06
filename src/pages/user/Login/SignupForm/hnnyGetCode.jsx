/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Message } from '@alifd/next';
import util from '@/utils/util';
import GVerify from './verify';
import PtinfoStore from '../../../../stores/system/PtinfoStore';
import HnnyLoginStore from '../../../../stores/system/HnnyLoginStore';
import { Form, Input, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import './loginFormD.less';
import leftBgPng from './images/left-bg.png';
import lightPng from './images/light.png';
import qrCodePng from './images/qr-code.png';
import loginBackPng from './images/login-back.png';
import accountPng from './images/account-icon.png';
import passwordPng from './images/password-icon.png';

{
  /* <p className="bottom-text"><span style={{ marginRight: '15px' }}>智慧城市</span><span>万物互联</span></p> */
}

const hnnyGetCode = observer((props) => {
    debugger;
  const location = props.location;
  console.log("code")
  console.log(location)
  const loginParams = location.query;
  console.log("cxode")
  console.log(loginParams)


  useEffect(() => {
debugger;

    HnnyLoginStore.findXTname();
    HnnyLoginStore.findVscode();
    //HnnyLoginStore.ssoLogin(loginParams.loginCode, loginParams.password);
  }, []);
  return <></>;
});

export default hnnyGetCode;
