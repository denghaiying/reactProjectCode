import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import PtinfoStore from '@/stores/system/PtinfoStore';
import LoginForm from './loginForm';
import LoginFormYellow from './loginFormYellow';
import LoginFormD from './loginFormD';
import './login.less';

const Login = observer((props) => {
  const {
    intl: { formatMessage },
  } = props;

  useEffect(() => {
    PtinfoStore.find();
  }, []);

  return (
    <div
      className={
        PtinfoStore.theme === 'orange'
          ? 'login-wrap-orange'
          : 'login-wrap-defalut'
      }
    >
      {PtinfoStore.theme === 'orange' ? <LoginFormYellow /> : <LoginFormD />}
      {/* <div className="theme-icon" onClick={onChangeTheme}>
        <img src={[require('../../../../styles/img/change-login.png')]} width="30px" alt="" />
      </div> */}
    </div>
  );
});

export default Login;
