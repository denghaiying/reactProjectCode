import { observable, action, makeObservable, runInAction } from 'mobx';
import { Message } from '@alifd/next';
import fetch from '../../utils/fetch';
import moment from 'moment';

class CrktjStore {
  //在线接收统计列表
  url = "";
  data = [];
  loading = false;

  constructor(url) {
    this.url = url;
    makeObservable(this,
      {
        loading: observable,
        data: observable,

        findCrktj: action,
      });
  }


  // 查询在线接收统计列表
  findCrktj = async (params) => {
    debugger
    this.loading = true;
    const response = await fetch
      .post(`${this.url}/crktj`, {}, { params: { ...params } });
    if (response && response.status === 200) {
      runInAction(() => {
        this.data = response.data;
        this.loading = false;
      });
    }
  }
}

export default new CrktjStore('/eps/datj/crktj');
