import { action, observable, runInAction, makeObservable } from 'mobx';
import BaseWfStore from './BaseWfStore';
import fetch from '@/utils/fetch';

class WfsrvStore extends BaseWfStore {
  list = [];
  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this, {
      list: observable,
      resetEditRecord: action,
      queryForList: action,
    });
  }

  resetEditRecord = (value) => {
    this.editRecord = value;
  }

  queryForList = async () => {
    const response = await fetch.get(this.url + "/queryForList", {});
    runInAction(() => {
      if (response && response.status === 200) {
        this.list = response.data;
      }
    });
  }
}

export default new WfsrvStore('/api/eps/workflow/wfsrv', false, true);
