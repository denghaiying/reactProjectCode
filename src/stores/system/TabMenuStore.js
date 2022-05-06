import { observable, action, runInAction } from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import LoginStore from './LoginStore';


class TabMenuStore extends BaseStore {
  @observable userMenu = {};
  @observable collapse = false;
  @observable openDrawer = false;
  @observable openKeys = [];
  @observable opensys = { id: '0' };
  @observable currentNavList = []
  @observable allMenus = [];

  @action setCollapse = (collapse) => {
    this.collapse = collapse;
  }

  @action toggleCollapse = () => {
    this.collapse = !this.collapse;
  }

  @action toggleMenu = () => {
    this.openDrawer = !this.openDrawer;
  }

  @action setOpenKeys = (openkeys) => {
    this.openKeys = openkeys;
  }

  @action setOpenSys = (sys) => {
    this.opensys = sys;
  }

  getSystem = (sysid) => {
    for (let i = 0; i < LoginStore.systems.length; i++) {
      const e = LoginStore.systems[i];
      if (e.umid === sysid) {
        return e;
      }
    }
  }

  @action getMenu = async () => {
    // const v = this.userMenu[sysid];
    // this.opensys = this.getSystem(sysid);
    const sysid=0;
    this.openKeys = [0];
    this.opensys = { id: sysid };
    if (sysid == 0) {
      const response = await fetch.get('/api/eps/control/main/menu/system');
      if (response.status === 200) {
          runInAction(() => {
            this.userMenu[sysid] = response.data;
            return;
          });
      }

    }
    const v = this.allMenus.find(item =>
      item.umid == sysid
    )
    if (!v) {
      const res = await fetch.get(`${this.url}/sys/${encodeURIComponent(sysid)}`);
      if (res && res.status === 200) {
        runInAction(() => {
          this.userMenu[sysid] = res.data;
        });
      }
    } else {
      runInAction(() => {
        this.userMenu[sysid] = v.children.map(item => {
          item.sysid = sysid;
          return item;
        });//[{"sysId":"sysuser","funcId":null,"menuName":"用户管理","menuEname":"User Management","url":null,"menuIndex":10,"fid":null,"children":[{"sysId":"sysuser","funcId":"usermrg001","menuName":"用户管理","menuEname":"User","url":"/user","menuIndex":10,"fid":null,"children":null,"menuIcon":null,"wfinst":null,"wpid":null,"wpname":null,"wfid":null,"wfawaiterid":null,"wfawaiter":null,"wfahandlerid":null,"wfahandler":null,"id":"m6xslz739","whr":null,"whrid":null,"whsj":null,"filegrpId":null},{"sysId":"sysuser","funcId":"usermrg002","menuName":"角色管理","menuEname":"Role","url":"/role","menuIndex":20,"fid":null,"children":null,"menuIcon":null,"wfinst":null,"wpid":null,"wpname":null,"wfid":null,"wfawaiterid":null,"wfawaiter":null,"wfahandlerid":null,"wfahandler":null,"id":"m6c4i0363","whr":null,"whrid":null,"whsj":null,"filegrpId":null},{"sysId":"sysuser","funcId":"usermrg003","menuName":"组织机构管理","menuEname":"Org","url":"/org","menuIndex":30,"fid":null,"children":null,"menuIcon":null,"wfinst":null,"wpid":null,"wpname":null,"wfid":null,"wfawaiterid":null,"wfawaiter":null,"wfahandlerid":null,"wfahandler":null,"id":"mfkvtt763","whr":null,"whrid":null,"whsj":null,"filegrpId":null},{"sysId":"sysuser","funcId":"usermrg004","menuName":"权限管理","menuEname":"Authority","url":"/optright","menuIndex":40,"fid":null,"children":null,"menuIcon":null,"wfinst":null,"wpid":null,"wpname":null,"wfid":null,"wfawaiterid":null,"wfawaiter":null,"wfahandlerid":null,"wfahandler":null,"id":"m7sikk731","whr":null,"whrid":null,"whsj":null,"filegrpId":null},{"sysId":"sysuser","funcId":"usermrg005","menuName":"菜单管理","menuEname":"Menu","url":"/menu","menuIndex":50,"fid":null,"children":null,"menuIcon":null,"wfinst":null,"wpid":null,"wpname":null,"wfid":null,"wfawaiterid":null,"wfawaiter":null,"wfahandlerid":null,"wfahandler":null,"id":"mizm6a308","whr":null,"whrid":null,"whsj":null,"filegrpId":null}],"menuIcon":null,"wfinst":null,"wpid":null,"wpname":null,"wfid":null,"wfawaiterid":null,"wfawaiter":null,"wfahandlerid":null,"wfahandler":null,"id":"musermrg","whr":null,"whrid":null,"whsj":null,"filegrpId":null},{"sysId":"sysuser","funcId":null,"menuName":"系统管理","menuEname":"System Management","url":null,"menuIndex":20,"fid":null,"children":[{"sysId":"sysuser","funcId":"sysmrg001","menuName":"基本信息","menuEname":"Plateform","url":"/plateform","menuIndex":10,"fid":null,"children":null,"menuIcon":null,"wfinst":null,"wpid":null,"wpname":null,"wfid":null,"wfawaiterid":null,"wfawaiter":null,"wfahandlerid":null,"wfahandler":null,"id":"mipvgu140","whr":null,"whrid":null,"whsj":null,"filegrpId":null},{"sysId":"sysuser","funcId":"sysmrg002","menuName":"系统信息","menuEname":"System","url":"/system","menuIndex":20,"fid":null,"children":null,"menuIcon":null,"wfinst":null,"wpid":null,"wpname":null,"wfid":null,"wfawaiterid":null,"wfawaiter":null,"wfahandlerid":null,"wfahandler":null,"id":"mm1rff391","whr":null,"whrid":null,"whsj":null,"filegrpId":null},{"sysId":"sysuser","funcId":"sysmrg003","menuName":"模块管理","menuEname":"Module","url":"/module","menuIndex":30,"fid":null,"children":null,"menuIcon":null,"wfinst":null,"wpid":null,"wpname":null,"wfid":null,"wfawaiterid":null,"wfawaiter":null,"wfahandlerid":null,"wfahandler":null,"id":"m0r1f9077","whr":null,"whrid":null,"whsj":null,"filegrpId":null},{"sysId":"sysuser","funcId":"sysmrg004","menuName":"功能管理","menuEname":"Func","url":"/func","menuIndex":40,"fid":null,"children":null,"menuIcon":null,"wfinst":null,"wpid":null,"wpname":null,"wfid":null,"wfawaiterid":null,"wfawaiter":null,"wfahandlerid":null,"wfahandler":null,"id":"mfehon112","whr":null,"whrid":null,"whsj":null,"filegrpId":null}],"menuIcon":null,"wfinst":null,"wpid":null,"wpname":null,"wfid":null,"wfawaiterid":null,"wfawaiter":null,"wfahandlerid":null,"wfahandler":null,"id":"msysmrg","whr":null,"whrid":null,"whsj":null,"filegrpId":null}];//v.children;
      });
    }
  }

  @action clearMenu = () => {
    this.userMenu = {};
  }
}

export default new TabMenuStore('/userapi/menu');
