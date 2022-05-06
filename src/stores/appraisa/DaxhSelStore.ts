import { observable, action, runInAction } from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';

class ApprasiaManage extends BaseStore {
  @observable dlgVisible:boolean=false;
  @observable list = [];
  @observable saveParams = { id: "new" };

  @action setSaveParams = (key, value) => {
    const { ...p } = this.saveParams;
    p[key] = value;
    this.saveParams = p;
  }

  @action setDlgVisible = (isDlgVisible:boolean) => {
    this.dlgVisible=isDlgVisible;
  }

  @action queryForList = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch
      .post(`${this.url}/queryForList`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
    if (response && response.status === 200 && response.data) {
      runInAction(() => {
        this.list = response.data.results;
      });
      return response.data;
    }
  }

  queryCount = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch
      .post(`${this.url}/queryCount`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
    if (response && response.status === 200) {
      return response.data;
    }
  }

  addTm = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch
      .post(`${this.url}/addDetail`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
    if (response && response.status === 200) {
      return response.data;
    }
  }
}

export default new ApprasiaManage('/api/eps/control/main/daxh', true, true);
