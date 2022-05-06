import {observable, action } from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';

class YjspmxStore extends BaseStore {
  queryForPageUrl = "/queryForTmxxPage";
  // queryByIdUrl = "/queryYjspmxForId";
  addUrl = "/addDetail";
  updateUrl = "/updDetail";
  @observable mxdak={};
  @action setMxparams = async (params) => {
    const fd = new FormData();
    fd.append('id', params.dakid);
      const jndak = await fetch.post(`/api/eps/control/main/dak/queryForId`, fd);
      this.mxdak = jndak.data;
      this.setParams({ sqmxid: params.id, dakid: params.dakid, mbid: jndak.data.mbid, bmc: jndak.data.mbc });
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

export default new YjspmxStore('/api/eps/control/main/gszxyjsqd', true, true);
