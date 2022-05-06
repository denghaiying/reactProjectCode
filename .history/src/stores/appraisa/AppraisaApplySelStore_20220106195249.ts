import { observable, action, runInAction, makeObservable } from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';

class ApprasiaManage extends BaseStore {
  @observable dlgVisible: boolean = false;
  @observable list = [];
  @observable saveParams = { id: 'new' };
  @observable publishTo = [];

  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this);
  }

  @action setSaveParams = (key, value) => {
    const { ...p } = this.saveParams;
    p[key] = value;
    this.saveParams = p;
  };

  setUrl = (url: string) => {
    runInAction(() => {
      this.url = url;
    });
  };

  @action setDlgVisible = (isDlgVisible: boolean) => {
    this.dlgVisible = isDlgVisible;
  };

  @action queryForList = async (params) => {
    debugger;
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch.post(`${this.url}/queryForList`, fd, {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });
    if (response && response.status === 200 && response.data) {
      runInAction(() => {
        this.list = response.data.results;
      });
      return response.data;
    }
  };

  queryCount = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch.post(`${this.url}/queryCount`, fd, {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });
    if (response && response.status === 200) {
      return response.data;
    }
  };

  // begin ******************** 以下是事件响应
  genSQD = (params, autosubmit, callback) => {
    let { ...keys } = params;
    if (this.saveParams.id && this.saveParams.id != 'new') {
      keys['id'] = this.saveParams.id;
    } else {
      keys['title'] = this.saveParams.title || '';
    }
    keys['remark'] = this.saveParams.remark || '';
    keys['autosubmit'] = autosubmit || false;
    this.addTm(keys).then((res) => {
      if (res && res.success) {
        //setDlgVisible(false);
        callback && callback(res);
      }
    });
  };

  // begin ******************** 以下是事件响应
  genSQD = (params, autosubmit, callback) => {
    let { ...keys } = params;
    if (this.saveParams.id && this.saveParams.id != 'new') {
      keys['id'] = this.saveParams.id;
    } else {
      keys['title'] = this.saveParams.title || '';
    }
    keys['remark'] = this.saveParams.remark || '';
    keys['autosubmit'] = autosubmit || false;
    this.addTm(keys).then((res) => {
      if (res && res.success) {
        //setDlgVisible(false);
        callback && callback(res);
      }
    });
  };

  qxkf = (params, autosubmit, callback) => {
    let { ...keys } = params;
    if (this.saveParams.id && this.saveParams.id != 'new') {
      keys['id'] = this.saveParams.id;
    } else {
      keys['title'] = this.saveParams.title || '';
    }
    keys['remark'] = this.saveParams.remark || '';
    keys['autosubmit'] = autosubmit || false;
    this.updateTm(keys).then((res) => {
      if (res && res.success) {
        //setDlgVisible(false);
        callback && callback(res);
      }
    });
  };

  dafb = async (params, autosubmit, callback) => {
    let { ...keys } = params;
    if (this.saveParams.id && this.saveParams.id != 'new') {
      keys['id'] = this.saveParams.id;
    } else {
      keys['title'] = this.saveParams.title || '';
    }
    keys['remark'] = this.saveParams.remark || '';
    keys['autosubmit'] = autosubmit || false;
    const fd = new FormData();
    if (keys) {
      for (const key in keys) {
        fd.append(key, keys[key]);
      }
    }
    const response = await fetch.post(`${this.url}/dafb`, fd, {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });
    if (response && response.status === 200) {
      return response.data;
    }
  };

  addTm = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch.post(`${this.url}/addDetail`, fd, {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });
    if (response && response.status === 200) {
      return response.data;
    }
  };

  qxts = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch.post(`/api/eps/control/main/dagl/qxts`, fd, {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });
    if (response && response.status === 200) {
      return response.data;
    }
  };

  gszxyjsqdAdd = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch.post(`${this.url}/xadd`, fd, {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });
    if (response && response.status === 200) {
      return response.data;
    }
  };

  updateTm = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch.post(`${this.url}/updDetail`, fd, {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });
    if (response && response.status === 200) {
      return response.data;
    }
  };

  async querySjzdmx() {
    const response = await fetch.post(
      `/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?mc=保管期限`,
    );
    if (response.status === 200) {
      runInAction(() => {
        const publishTo = response.data.map((o) => ({
          id: o.id,
          label: o.mc,
          value: o.mc,
        }));
        console.log('publish:', publishTo);
        this.publishTo = publishTo;
      });
    }
  }
}

export default ApprasiaManage;
