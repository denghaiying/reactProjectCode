/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Message } from '@alifd/next';
import util from '@/utils/util';
import GVerify from '../verify';
import PtinfoStore from '@/stores/system/PtinfoStore';
import LoginStore from '@/stores/system/LoginStore';
import { Form, Input, Modal } from 'antd';
import { useIntl } from 'umi';

{
  /* <p className="bottom-text"><span style={{ marginRight: '15px' }}>智慧城市</span><span>万物互联</span></p> */
}

const LoginFormD = observer((props) => {
  const location = props.location;
  const loginParams = location.query;
  debugger;

  useEffect(() => {
    LoginStore.findXTname();
    LoginStore.findVscode();
    LoginStore.ssoLogin(loginParams.loginCode, loginParams.password);
  }, []);
  return <></>;
});

export default LoginFormD;
