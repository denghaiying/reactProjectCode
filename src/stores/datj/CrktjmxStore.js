import { message } from 'antd';
import { observable, action, makeObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import moment from 'moment';

class CrktjStore {
  //在线接收统计列表
  url = '';
  tableData = [];
  loading = false;
  qzhData = [];
  firstDay = '';
  lastDay = '';
  constructor(url) {
    this.url = url;
    makeObservable(this, {
      loading: observable,
      tableData: observable,
      qzhData: observable,
      firstDay: observable,
      lastDay: observable,
      findQzh: action,
    });
  }
  findQzh = async (params) => {
    const response = await fetch.post(
      `${this.url}/queryqzh`,
      {},
      { params: { ...params } },
    );
    debugger
    if (response &&response.status===200&&response.data.success) {
      runInAction(() => {
        this.qzhData = response.data.results;
      });
    } 
  };
}

export default new CrktjStore('/eps/datj/crktj');
