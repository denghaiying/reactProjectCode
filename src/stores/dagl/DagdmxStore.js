import { action,makeObservable } from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';

class DagdmxStore extends BaseStore {
  queryForPageUrl = "/queryDetailForPage";
  // queryByIdUrl = "/queryDagdmxForId";
  addUrl = "/addDetail";
  updateUrl = "/updDetail";


  constructor(url, wfenable, oldver = true) {
    super(url,wfenable,oldver);
    makeObservable(this);
  }


  @action reSetData = async (record) => {
    const { results } = this.data;
    if (results) {
      this.data.results = results.map(m => m.id == record.id ? record : m);
    }
    const fd = new FormData();
    for (const key in record) {
      fd.append(key, record[key]);
    }
    await fetch
      .put(`${this.url}${this.updateUrl}`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
  }
}

export default new DagdmxStore('/api/eps/control/main/dagd', true, true);
