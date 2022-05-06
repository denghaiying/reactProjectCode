import { observable, action, runInAction, makeObservable } from 'mobx';
import UserService from '../../services/user/HnnyUserService';
import util from '../../utils/util';
import fetch from '../../utils/fetch';
import { fetchMenuInfo } from '@/utils/menuUtils';
import diagest from '../../utils/diagest';
import { history } from 'umi';
import PtinfoStore from './PtinfoStore';
import paramsManageStore from './ParamsManageStore';
import UserMenuStore from './UserMenuStore';
import SysStore from './SysStore';
import OptrightStore from '../user/OptrightStore';
import cookie from 'react-cookies';
import { queryCmp, setCmpSession } from '@/services/ant-design-pro/api';
import { P } from '@antv/g2plot';
import { base64encode, utf16to8 } from '@/utils/EpsUtils';

import axios from 'axios';
import { message } from 'antd';


export class UserInfo {
  id: String;
  bh: String;
  yhmc: String;
  dwid: String;
}

class LoginStore {
  @observable userinfo: UserInfo = null;
  @observable isScan = false;
  @observable loginrec = {};
  @observable systems = [];
  @observable loginerr = false;
  @observable identifyValue = '';
  @observable menutype = 'M';
  @observable token = '';
  //	系统图名称
  @observable xtname = '';
  @observable picture = '';
  @observable xt = {};
  @observable vscodebloon = false;
  @observable mmxgModalVisible = false;
  @observable dlmeg = '';

  constructor() {
    makeObservable(this);
  }

  @action showScan = async () => {
    runInAction(() => {
      // this.isScan = !this.isScan; // 还未启用流程，启用后放开即可
      if (this.isScan) {
        // 生成二维码
      }
    });
  };

  @action getRemember = async () => {
    const loginname = util.getLStorage('lastusername');
    runInAction(() => {
      if (loginname != null) {
        this.loginrec = { loginname, rememberlogin: true };
      } else {
        this.loginrec = {};
      }
    });
  };

  @action changeMenuType = async (menutype) => {
    this.menutype = menutype;
    this.userinfo.userMenutype = menutype;
    UserService.updatesome(this.userinfo.id, { userMenutype: menutype });
  };

  @action setMmdoalVisible = async (modalvisible) => {
    this.mmxgModalVisible = modalvisible;
  };

  @action login = async (loginname, password, rememberlogin = false) => {
    try {
      //
      const passwordHash = base64encode(utf16to8(password));
      const token = await UserService.login(loginname, passwordHash);
      if (token == '密码已经失效，请修改密码') {
        this.mmxgModalVisible = true;
        this.dlmeg = token;
      } else {
        const userinfo = await UserService.checktoken(token);
        const menuData = await fetchMenuInfo();
        const dw = await queryCmp(userinfo.dwid);
        await paramsManageStore.findParamsValueById(
          paramsManageStore.homePageCode,
        );
        let _homePage = '';
        const _homePageRes = await fetch.get(
          `${paramsManageStore.url}/getUserOption?code=${paramsManageStore.homePageCode}`,
        );
        const _homeRoleRes = await fetch.get(
          `${paramsManageStore.url}/getUserOption?code=${paramsManageStore.rolePageCode}&yhid=${userinfo.id}`,
        );
        if (_homeRoleRes?.data?.message) {
          util.setLStorage(
            `homePage-${window.btoa(userinfo.id)}`,
            _homeRoleRes?.data?.message.replaceAll('|', '%7C'),
          );
          _homePage = _homeRoleRes.data.message || '/';
        } else if (_homePageRes?.data?.message && !_homePage) {
          util.setLStorage(
            `homePage-${window.btoa(userinfo.id)}`,
            _homePageRes?.data?.message.replaceAll('|', '%7C'),
          );
          _homePage = _homePageRes.data.message || '/';
        } else {
          _homePage = '/';
        }
        await paramsManageStore.findParamsByCode(paramsManageStore.autoRunCode);
        const roleSysName = await fetch.get(
          `${paramsManageStore.url}/getUserOption?code=${paramsManageStore.XTPTXSMC}&yhid=${userinfo.id}`,
        );
        runInAction(() => {
          this.loginerr = false;
          this.token = token;
          if (roleSysName?.data?.message) {
            // this.xtname = roleSysName?.data?.message;
            util.setLStorage('sysname', roleSysName?.data?.message);
          } else {
            util.setLStorage('sysname', this.xtname);
          }

          this.userinfo = userinfo;
          util.setLStorage('mtoken', token);

          util.setLStorage('userinfo', userinfo);
          localStorage.setItem('userid', userinfo.id);

          console.log("sss", userinfo.id);
          this.menutype = userinfo.userMenutype || PtinfoStore.menutype;
          debugger;
          util.setLStorage('menuData', menuData);
          fetch.defaults.headers.common.token = token;
          if (rememberlogin) {
            util.setLStorage('lastusername', loginname);
            this.loginrec = { loginname, rememberlogin };
          } else {
            util.clearLStorage('lastusername');
            this.loginrec = {};
          }
          util.setLStorage('skin', this.xt.pf);
          util.setLStorage('currentCmp', dw);
          SysStore.setCurrentUser();
          debugger;
          const skin = util.getLStorage('skin');
          if (skin == '7') {
            window.location.href = '/eps/control/main';
          } else if (roleSysName.data?.message) {
            window.location.href = '/user/main';
          } else if (skin == '6') {
            window.location.href = '/user/mainPageMenuD';
          } else {
            window.location.href = '/user/main'; // paramsManageStore.paramValue?.defaultv || _homePage.replaceAll('|', '%7C')
          }
        });
      }
    } catch (err) {
      this.loginerr = true;
      throw err;
    }
  };


  /**
   * 南阳退出单点登录
   */
  @action hnnylogout = async () => {
    debugger;
    const C2AT = await fetch.get(`/api/sso/hnny/logout/getCrt`,);
    await fetch.get(`/api/sso/hnny/logout`,);
    //根据南阳单点登录存贮在cookie中的C2AT是否存在?判断是否跳转到南阳单点登录的统一登录页面
    if (C2AT.data) {
      location.href = ('http://59.227.169.6:31176/oauth2/logout?client_id=RzNjf8WrSYaF6lMxd0V5bw&response_type=code&redirect_uri=http://59.227.169.5:8088/runWfunc/hnny-code');
      //location.href = ('http://219.156.150.148:30057/oauth2/logout?client_id=N7pG8e5YT7yK-TwsnPW98A&response_type=code&redirect_uri=http://192.168.3.217:8000/runWfunc/hnny-code');
   
    }
  };

  @action getCode = async () => {
    location.href = ('http://59.227.169.6:31176/oauth2/authorize?client_id=RzNjf8WrSYaF6lMxd0V5bw&response_type=code&redirect_uri=http://59.227.169.5:8088/runWfunc/hnny-code');
    //location.href = ('http://219.156.150.148:30057/oauth2/authorize?client_id=N7pG8e5YT7yK-TwsnPW98A&response_type=code&redirect_uri=http://192.168.3.217:8000/runWfunc/hnny-code');

  };

  @action ssoLogin = async (hnnyCode, rememberlogin = false) => {
    try {
      //
      debugger;
      console.log("ssoLogin-hnnyCode", hnnyCode);
      // const token = await UserService.ssoLogin(hnnyCode);
      const data = await fetch.get(`/api/sso/hnny/login?code=${hnnyCode}`,);
      const token = data.data
      console.log("token", token);
      debugger;
      if (token == '密码已经失效，请修改密码') {
        this.mmxgModalVisible = true;
        this.dlmeg = token;
      } else if (!token.success) {
        this.mmxgModalVisible = true;
        this.dlmeg = token;
        message.error('用户不存在,请联系管理员同步用户数据');
        message.error(token.message);
      } else {
        const userinfo = await UserService.checktoken(token);
        const menuData = await fetchMenuInfo();
        const dw = await queryCmp(userinfo.dwid);
        await paramsManageStore.findParamsValueById(
          paramsManageStore.homePageCode,
        );
        let _homePage = '';
        const _homePageRes = await fetch.get(
          `${paramsManageStore.url}/getUserOption?code=${paramsManageStore.homePageCode}`,
        );
        const _homeRoleRes = await fetch.get(
          `${paramsManageStore.url}/getUserOption?code=${paramsManageStore.rolePageCode}&yhid=${userinfo.id}`,
        );
        if (_homeRoleRes?.data?.message) {
          util.setLStorage(
            `homePage-${window.btoa(userinfo.id)}`,
            _homeRoleRes?.data?.message.replaceAll('|', '%7C'),
          );
          _homePage = _homeRoleRes.data.message || '/';
        } else if (_homePageRes?.data?.message && !_homePage) {
          util.setLStorage(
            `homePage-${window.btoa(userinfo.id)}`,
            _homePageRes?.data?.message.replaceAll('|', '%7C'),
          );
          _homePage = _homePageRes.data.message || '/';
        } else {
          _homePage = '/';
        }
        await paramsManageStore.findParamsByCode(paramsManageStore.autoRunCode);
        const roleSysName = await fetch.get(
          `${paramsManageStore.url}/getUserOption?code=${paramsManageStore.XTPTXSMC}&yhid=${userinfo.id}`,
        );
        runInAction(() => {
          this.loginerr = false;
          this.token = token;
          if (roleSysName?.data?.message) {
            // this.xtname = roleSysName?.data?.message;
            util.setLStorage('sysname', roleSysName?.data?.message);
          } else {
            util.setLStorage('sysname', this.xtname);
          }

          this.userinfo = userinfo;
          util.setLStorage('mtoken', token);

          util.setLStorage('userinfo', userinfo);
          this.menutype = userinfo.userMenutype || PtinfoStore.menutype;
          debugger;
          util.setLStorage('menuData', menuData);
          fetch.defaults.headers.common.token = token;
          if (rememberlogin) {
            util.setLStorage('lastusername', loginname);
            this.loginrec = { loginname, rememberlogin };
          } else {
            util.clearLStorage('lastusername');
            this.loginrec = {};
          }
          util.setLStorage('skin', this.xt.pf);
          util.setLStorage('currentCmp', dw);
          SysStore.setCurrentUser();
          debugger;
          const skin = util.getLStorage('skin');
          if (skin == '7') {
            window.location.href = '/eps/control/main';
          } else if (roleSysName.data?.message) {
            window.location.href = '/user/main';
          } else if (skin == '6') {
            window.location.href = '/user/mainPageMenuD';
          } else {
            window.location.href = '/user/main'; // paramsManageStore.paramValue?.defaultv || _homePage.replaceAll('|', '%7C')
          }
        });
      }
    } catch (err) {
      this.loginerr = true;
      throw err;
    }
  };

  @action checktoken = async () => {
    let token = util.getLStorage('mtoken');
    if (!token) {
      token = cookie.load('ssotoken');
    }
    try {
      if (token) {
        const userinfo = await UserService.checktoken(token);

        runInAction(() => {
          fetch.defaults.headers.common.token = token;
          this.token = token;
          this.userinfo = userinfo;
          this.menutype = userinfo.userMenutype || PtinfoStore.menutype;
          fetch.defaults.headers.common.token = token;
        });
      } else {
        const userinfo = await UserService.getSsoUserInfo();
        runInAction(() => {
          this.userinfo = userinfo;
          this.menutype = userinfo.userMenutype || PtinfoStore.menutype;
        });
      }
    } catch (err) {
      // 发生异常自动登录一次
      //runInAction(() => {
      this.userinfo = null;
      util.clearLStorage('mtoken');
      //  });
    }
  };

  @action loginout = async () => {
    await UserService.logout(this.token);
    util.clearLStorage('mtoken');
    util.clearLStorage('menuData');
    util.clearLStorage('currentUser');
    runInAction(() => {
      UserMenuStore.clearMenu();
      OptrightStore.clearRight();
      this.token = '';
      this.userinfo = null;
      this.systems = [];
      util.clearLStorage('mtoken');
    });

    history.push('/user/login');
  };

  @action changepassword = async (id, newpassword, oldpassword) => {
    const response = await UserService.changepw(id, newpassword, oldpassword);
    if (response.success) {
      this.mmxgModalVisible = false;
    }
  };

  /**
   * 返回一个system的信息
   */
  @action findSystem = async (param) => {
    const response = await fetch.get('/api/eps/control/main/menu/system');
    if (response.status === 200) {
      const systems =
        response.data &&
        response.data.map((item) => {
          item.icon = `/eps/control/${item.icon}`;
          return item;
        });
      this.systems = systems;
      return systems && systems.length > 0 ? systems[0] : { id: 0 };
    }
    return [];
  };

  /**
   * 查询系统图名称
   */
  @action findXTname = async () => {
    const response = await fetch.get('/api/sysapi/ptinfo/queryForId');
    if (response.status === 200) {
      // runInAction(() => {
      this.xt = response.data;
      this.xtname = response.data.xtmc;
      //  });
    }
  };
  /**
   * 获取验证码参数
   */
  @action findVscode = async () => {
    const response = await fetch.get('/api/sysapi/ptinfo/findVscode');
    if (response.status === 200) {
      //  runInAction(() => {
      this.vscodebloon = response.data == 'Y';
      //  });
    }
  };
}

export default new LoginStore();
