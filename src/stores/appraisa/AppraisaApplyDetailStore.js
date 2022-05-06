import { action } from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';

class AppraisaApplyDetailStore extends BaseStore {
  queryForPageUrl = "/queryDetailForPage";
  // queryByIdUrl = "/queryYjspmxForId";
  addUrl = "/addDetail";
  updateUrl = "/updDetail";


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

  @action clearData = async () => {
    this.data={}
  }
}

export default AppraisaApplyDetailStore;
