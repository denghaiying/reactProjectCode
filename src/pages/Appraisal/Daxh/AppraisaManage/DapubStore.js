import { observable, action, runInAction } from 'mobx';
import BaseStore from '@/stores/BaseStore';
import fetch from '@/utils/fetch';

class DapubStore extends BaseStore {
  @observable ktables = {};
  @observable childlist = {};

   getDDaklist = async (fid) => {
    if (!this.childlist[fid]) {
      const ktable = await this.getKTable({ fid });
      runInAction(() => {
        this.childlist[fid] = ktable.id;
        this.ktables[ktable.id] = ktable;
      });
    }
  }

   getDaklist = async (dakid, tmzt) => {
    if (!this.ktables[dakid]) {
      const ktable = await this.getKTable({ dakid });
      runInAction(() => {
        this.ktables[dakid] = ktable;
      });
    }

    if (this.columns.length==0) {
      const kfields = await this.getKField({
        dakid: dakid,
        lx: tmzt,
        pg: "list"
      });
      runInAction( () => {
        this.columns = kfields.filter(kfield => kfield["lbkj"] == "Y").map(kfield => ({
          width: kfield["mlkd"]*1.3,
          code: kfield["mc"].toLowerCase(),
          title: kfield["ms"],
          ellipsis:true
        }));
      });
    }
  }

  getKTable = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch
      .post(`${this.url}/queryKTable`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
    if (response && response.status === 200) {
      return response.data;
    }
  }

  getKField = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch
      .post(`${this.url}/queryKFields`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
    if (response && response.status === 200) {
      return response.data;
    }
  }


}

export default new DapubStore('/api/eps/control/main/dagl', true, true);
