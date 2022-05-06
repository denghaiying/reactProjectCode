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

import axios from 'axios';
{
  /* <p className="bottom-text"><span style={{ marginRight: '15px' }}>智慧城市</span><span>万物互联</span></p> */
}

const hnnySso = observer((props) => {
  const location = props.location;
  const loginParams = location.query;


  useEffect(() => {
    HnnyLoginStore.findXTname();
    HnnyLoginStore.findVscode();
    const location = props.location;
    const loginParams = location.query;
    console.log("hnny-code",loginParams.code);
    if(loginParams.code==null){
     // window.location.href=('http://219.156.150.148:30057/oauth2/authorize?client_id=N7pG8e5YT7yK-TwsnPW98A&response_type=code&redirect_uri=http://192.168.3.217:8000/runWfunc/hnny-login');
      HnnyLoginStore.getCode();
    }
    if(loginParams.code!=null){
      HnnyLoginStore.ssoLogin(loginParams.code);
    }
    

  }, []);
  return <></>;
});

export default hnnySso;
