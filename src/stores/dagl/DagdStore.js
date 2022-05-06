import { observable, action, runInAction,makeObservable } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';

class DagdStore extends BaseStore {
  @observable fileshow = false;
  @observable fileparams = {};

  @action showFile = async (fileshow, params) => {
    this.fileshow = fileshow;
    if (fileshow) {
      this.fileparams = params;
    }
  }


  constructor(url, wfenable, oldver = true) {
    super(url,wfenable,oldver);
    makeObservable(this);
  }


  @action setKeyByWfinst = async (wfinst) => {
    const res = await fetch.get(`${this.url}/queryForList`, { params: { wfinst } });
    if (res && res.data && res.data.results && res.data.results.length > 0) {
      const date = moment(res.data.results[0].date, 'YYYY-MM-DD');
      await this.setParams({ sw: 'W', dateb: date.format('YYYY-MM-DD'), datee: date.format('YYYY-MM-DD') });
      await this.setSelectRows(res.data.results.map(o => o.id), res.data.results);
      return date;
    }
  }
}

export default new DagdStore('/api/eps/control/main/dagd', true, true);
