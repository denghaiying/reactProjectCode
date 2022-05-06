import { action, makeObservable } from 'mobx';
import BaseStore from '@/stores/BaseStore';
import fetch from '@/utils/fetch';

class ApplyDetailStore extends BaseStore {
    queryForPageUrl = "/queryDetailForPage";
    // queryByIdUrl = "/queryYjspmxForId";
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

export default new ApplyDetailStore('/api/eps/control/main/kfjdsp', true, true);
1
