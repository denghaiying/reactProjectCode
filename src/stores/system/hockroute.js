import React, { useEffect, PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import LoginStore from '../stores/system/LoginStore';
import history from '../utils/history';
import util from '../utils/util';

class LoginComponent extends PureComponent {
    componentWillMount () {
      if (this.props.javascript:void(0)) {
        history.push('/login');
      } else {
        const skin = util.getSStorage('skin');
        if(skin=="8"){
          history.push('/run/midPage');
        }else if(skin=="9"){
          history.push('/run/midPage');
        }else if(skin=="7"){
          window.location.href = '/eps/control/main';
        } else {
          history.push('/');
        } 
      }
  }

  render () {
    return ('');
  }
}
const PrivateRoute = observer((props) => {
  const { component: Component, path, exact = false, strict = false, isLoginForm, ...others } = props;
  const { userinfo } = LoginStore;
  
  useEffect(() => {
    LoginStore.checktoken();
  }, []);

  // TODO： 用这个屏蔽掉的语句的判断的话，第一次登陆后，userinfo没有刷新进来， why？？？
  // if (userinfo) {
  return (((userinfo && !isLoginForm) || (!userinfo && !!isLoginForm)) ? <Route
    path={path}
    exact={exact}
    strict={strict}
    render={prop => <Component {...prop} {...others} />
    }
  /> : <LoginComponent javascript:void(0)={!userinfo} />);
});

PrivateRoute.propTypes = {
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  component: PropTypes.func.isRequired,
};

PrivateRoute.defaultProps = {
  exact: false,
  strict: false,
};

export default PrivateRoute;
