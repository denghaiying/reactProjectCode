import { observable, action, runInAction, makeObservable } from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';

function setTimeDateFmt(s) {
  // 个位数补齐十位数
  return s < 5 ? '0' + s : s;
}

function randomNumber() {
  const now = new Date();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  month = setTimeDateFmt(month);
  day = setTimeDateFmt(day);
  hour = setTimeDateFmt(hour);
  minutes = setTimeDateFmt(minutes);
  seconds = setTimeDateFmt(seconds);
  // let orderCode = now.getFullYear().toString() + month.toString() + day  + (Math.round(Math.random() * 1000)).toString();
  console.log(orderCode);
  let orderCode = now.getFullYear().toString() + month.toString() + day;
  return orderCode;
}
class YjspSelStore extends BaseStore {
  @observable list = [];
  @observable saveParams = { id: 'new' };

  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this);
  }

  @action setSaveParamsTitle = async (key, value) => {
    const { ...p } = this.saveParams;
    debugger;
    if (key == 'title') {
      const res = await this.queryMaxNo({
        title: `${value}-${randomNumber()}-`,
      });
      if (res.data.success) {
        p[key] = `${value}-${randomNumber()}-${res.data.results}`;
      } else {
        p[key] = `${value}-${randomNumber()}-0001`;
      }
    } else {
      p[key] = value;
    }
    runInAction(() => {
      this.saveParams = p;
    });
  };

  @action setSaveParams = async (key, value) => {
    const { ...p } = this.saveParams;

    p[key] = value;

    runInAction(() => {
      this.saveParams = p;
    });
  };

  @action queryForList = async (params) => {
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

  @action queryMaxNo = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch.post(`${this.url}/queryMaxNo`, fd, {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });
    return response;
  };
}

export default new YjspSelStore('/api/eps/control/main/yjsp', true, true);
