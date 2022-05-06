import { observable, action, runInAction } from 'mobx';
import util from '../../utils/util';
import BaseStore from '../BaseStore';
import PtinfoStore from './PtinfoStore';
import fetch from '../../utils/fetch';

export class CmpInfo {
  id: String;
  dwbh: String;
  mc: String;
  dwname: String;
}

export class UserInfo {
  id: String;
  bh: String;
  yhmc: String;
  golbalrole: String;
  yhmj: String;
  bmid: String;
}

export class FullTextMenuInfo {
  id: String;
  mc: String;
  zdm: String;
  sxlx: String;
}

class SysStore {
  url = '';
  wfenable = false;
  oldver = true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    //   makeObservable(this);
  }

  @observable normallist = [];
  @observable defaultSysData = {}; // 全局变量,默认取系统第一个值放置页面系统下拉框用来回显
  @observable sysIcon = null;
  @observable messageCount = { xxtx: 0, dbsl: 0, jycsl: 0, wdscsl: 0 };
  //当前用户有权限单位列表
  @observable currentCmpList: CmpInfo[] = [];

  /**
   * 当前用户
   */
  @observable currentUser: UserInfo = {};
  /**
   * 当前单位
   */
  @observable currentCmp: CmpInfo = {};

  /**
   * 工具箱
   */
  @observable toolList = [];

  //	系统图名称
  @observable xtname = '';
  @observable xt = {};

  @action findXTname = async () => {
    const response = await fetch.get('/api/sysapi/ptinfo/queryForId');
    if (response.status === 200) {
      // runInAction(() => {
      this.xt = response.data;
      this.xtname = response.data.xtmc;
      //  });
    }
  };

  @action setTopMessageCount = async () => {
    debugger;
    const res = await fetch.get(
      `/eps/dsrw/pagemsg/queryMessageList?yhid=${this.currentUser.id}`,
    );
    const data = res?.data;
    runInAction(() => {
      if (data && data.length > 0) {
        let message = {};
        for (var i = 0; i < data.length; i++) {
          var obj = data[i];
          switch (obj.umid) {
            case 'DSRW002': //消息提醒
              var sl = parseInt(obj.total);
              if (sl > 99) {
                sl = '99+';
              }
              message.xxtx = sl;
              break;
            case 'WORKFLOW0002': //代办事务
              var sl = parseInt(obj.total);
              if (sl > 99) {
                sl = '99+';
              }
              message.dbsl = sl;
              break;
            case 'DALY013': //代办事务
              var sl = parseInt(obj.total);
              if (sl > 99) {
                sl = '99+';
              }
              message.jycsl = sl;
              break;

            case 'DALY016': //我的收藏
              var sl = parseInt(obj.total);
              if (sl > 99) {
                sl = '99+';
              }
              message.wdscsl = sl;
              break;
          }
        }
        this.messageCount = message;
      }
    });
  };

  @action setToolList = async () => {
    const res = await fetch.get(
      `/eps/wdgl/attachdoc/queryForList?doctbl=ATTACHDOC&grptbl=DOCGROUP&grpid=${PtinfoStore.sysinfo.filegrpid}`,
    );
    // runInAction(() => {
    this.toolList = res.data;
    // });
  };

  @action setCurrentCmpList = async (sysid) => {
    const response = await fetch.get(
      `/api/eps/control/main/dw/queryForListByYhid?yhid=${this.currentUser.id}`,
    );
    if (response.status === 200) {
      //     runInAction(() => {

      this.currentCmpList = response.data;
      // if(!this.currentCmp){
      this.setCurrentCmp();
      // }
      return;
      //     });
    }
  };

  @action downloadTool = (row) => {
    window.open(
      '/eps/wdgl/attachdoc/download?fileid=' +
        row.fileid +
        '&grpid=' +
        row.grpid +
        '&doctbl= ATTACHDOC&grptbl=DOCGROUP&atdw=' +
        this.currentCmp.id +
        '&umid=' +
        this.umId +
        '&mkbh=' +
        null +
        '&downlx=01',
    );
  };

  @action setSystemIcon = (icon) => {
    this.sysIcon = icon;
    this.editRecord.systemIcon = icon;
  };

  @action setCurrentUser = async () => {
    const res = await fetch.get(
      `/api/eps/control/main/getEpsSession?esname=yh`,
    );
    //   runInAction(() => {
    this.currentUser = res.data;
    util.setLStorage('currentUser', res.data);
    //   });
  };

  @action getCurrentUser = (): UserInfo => {
    const curretnUser: UserInfo = util.getLStorage('currentUser');
    if (!curretnUser) {
      return this.currentUser;
    }
    return curretnUser;
  };

  @action getCurrentCmp = (): CmpInfo => {
    const currentCmp: CmpInfo = util.getLStorage('currentCmp');
    if (!currentCmp) {
      return this.currentCmp;
    }
    return currentCmp;
  };

  @action setCurrentCmp = async () => {
    const res = await fetch.get(
      `/api/eps/control/main/getEpsSession?esname=currentdw`,
    );
    //   runInAction(() => {
    let cmpInfo = res.data;
    if (!cmpInfo) {
      cmpInfo = this.currentCmpList.find((o) => {
        return o.id == this.currentUser.dwid;
      });
    }
    if (!cmpInfo) {
      cmpInfo = { id: this.currentUser.dwid };
    }
    util.setLStorage('currentCmp', cmpInfo);
    this.currentCmp = cmpInfo;
    //  });
  };

  @action selectCmp = async (cmpid) => {
    const res = await fetch.get(
      `/api/eps/control/main/setEpsSession?dwid=${this.currentCmp.id}`,
    );
    //   runInAction(() => {
    this.setCurrentCmp();
    //  });
    window.location.reload();
  };

  beforeSaveData(values) {
    if (this.sysIcon) {
      values.systemIcon = this.sysIcon;
    }
    return values;
  }

  @action queryNorlmalList = async () => {
    const normallist = await this.findAll({ showall: '1' });
    normallist.forEach((item) => {
      item.label = item.systemName;
      item.key = item.id;
    });
    //  runInAction(() => {
    this.normallist = normallist;
    if (normallist == null || normallist.length === 0) {
      this.defaultSysData.systemName = '';
    } else {
      this.defaultSysData = normallist[0];
      this.loading = false;
    }
    //  });
  };

  getSystems = () => {
    return util.getSStorage('system');
  };

  getSystem = (path) => {
    const sys = this.getSystems();
    if (sys) {
      for (let i = 0; i < sys.length; i += 1) {
        if (sys[i].systemUrl === path) {
          return sys[i];
        }
      }
    }
    return undefined;
  };

  //action
  getCurrentOS = () => {
    if (navigator.userAgent.indexOf('Window') > 0) {
      return 'Windows';
    } else if (navigator.userAgent.indexOf('Mac OS X') > 0) {
      return 'Mac';
    } else if (navigator.userAgent.indexOf('Linux') > 0) {
      return 'Linux';
    } else {
      return 'NUll';
    }
  };
}

export default new SysStore('/api/sysapi/sys');
