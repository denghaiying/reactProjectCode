import { observable, action, runInAction } from 'mobx';
import UserService from '../../services/user/UserService';
import util from '../../utils/util';
import fetch from '../../utils/fetch';
import diagest from '../../utils/diagest';
import history from '../../utils/history';
import PtinfoStore from './PtinfoStore';
import UserMenuStore from './UserMenuStore';
import OptrightStore from '../user/OptrightStore';
import cookie from 'react-cookies'

class LoginStore {
  @observable userinfo = null;
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

  @action showScan = async () => {
    runInAction(() => {
      // this.isScan = !this.isScan; // 还未启用流程，启用后放开即可
      if (this.isScan) {
        // 生成二维码
      }
    })
  }

  @action getRemember = async () => {
    const loginname = util.getLStorage('lastusername');
    runInAction(() => {
      if (loginname != null) {
        this.loginrec = { loginname, rememberlogin: true };
      } else {
        this.loginrec = {};
      }
    });
  }

  @action changeMenuType = async (menutype) => {
    this.menutype = menutype;
    this.userinfo.userMenutype = menutype;
    UserService.updatesome(this.userinfo.id, { userMenutype: menutype });
  }


  @action changeMenuType = async (menutype) => {
    this.menutype = menutype;
    this.userinfo.userMenutype = menutype;
    UserService.updatesome(this.userinfo.id, { userMenutype: menutype });
  }

  @action login = async (loginname, password, rememberlogin = false) => {
    try {
      const token = await UserService.login(loginname, diagest.md5(password));
      const userinfo = await UserService.checktoken(token);
      runInAction(() => {
        this.loginerr = false;
        this.token = token;
        this.userinfo = userinfo;
        util.setLStorage('mtoken', token);
        util.setLStorage('userinfo', userinfo);
        this.menutype = userinfo.userMenutype || PtinfoStore.menutype;
        fetch.defaults.headers.common.token = token;
        if (rememberlogin) {
          util.setLStorage('lastusername', loginname);
          this.loginrec = { loginname, rememberlogin };
        } else {
          util.clearLStorage('lastusername');
          this.loginrec = {};
        }
        util.setLStorage("skin", this.xt.pf);

        const skin = util.getLStorage('skin');
        if (skin == "8") {
          history.push('/run/midPage');
        } else if (skin == "9") {
          history.push('/run/midPage');
        } else if (skin == "7") {
          window.location.href = '/eps/control/main';
        } else {
          history.push('/');
        }
      });


    } catch (err) {
      this.loginerr = true;
      throw err;
    }
  }


  @action checktoken = async () => {

    let token = util.getLStorage('mtoken');
    if(!token){
      token= cookie.load('ssotoken')
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
      runInAction(() => {
        this.userinfo = null;
        util.clearLStorage('mtoken');
      });
    }
  }



  @action loginout = async () => {
    await UserService.logout(this.token);
    runInAction(() => {
      UserMenuStore.clearMenu();
      OptrightStore.clearRight();
      this.token = '';
      this.userinfo = null;
      this.systems = [];
      util.clearLStorage('mtoken');
    });
    window.location.reload()
  }

  @action changepassword = async (id, newpassword, oldpassword) => {
    await UserService.changepassword(id, diagest.desencode(id, newpassword), oldpassword);
  }

  /**
   * 返回一个system的信息
   */
  @action findSystem = async (param) => {

    const response = await fetch.get('/api/eps/control/main/menu/system');
    if (response.status === 200) {
      const systems = response.data && response.data.map(item => {
        item.icon = `/eps/control/${item.icon}`;
        return item;
      });
      runInAction(() => {
        this.systems = systems;
      });
      return systems && systems.length > 0 ? systems[0] : { id: 0 };
    }
    return [];
  }

  /**
    * 查询系统图名称
    */
  @action findXTname = async () => {
    const response = await fetch.get('/sysapi/ptinfo/queryForId');
    if (response.status === 200) {
      runInAction(() => {
        this.xt = response.data;
        this.xtname = response.data.xtmc;
      });
    }
  }
  /**
   * 获取验证码参数
   */
  @action findVscode = async () => {
    const response = await fetch.get('/sysapi/ptinfo/findVscode');
    if (response.status === 200) {
      runInAction(() => {
        this.vscodebloon = response.data == "Y";
      });
    }
  }
}

export default new LoginStore();
