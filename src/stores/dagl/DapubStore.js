import { observable, action, runInAction, makeObservable } from "mobx";
import BaseWfStore from "../workflow/BaseWfStore";
import fetch from "../../utils/fetch";

class DapubStore extends BaseWfStore {
  ktables = {};
  childlist = {};

  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this, {
      ktables: observable,
      childlist: observable,

      getDDaklist: action,
      getDakTableList: action,
      getDaklist: action,
      getKTable: action,
      getKField: action,
    });
  }


  getDDaklist = async (fid) => {
    if (!this.childlist[fid]) {
      const ktable = await this.getKTable({ fid });
      runInAction(() => {
        this.childlist[fid] = ktable.id;
        this.ktables[ktable.id] = ktable;
      });
    }
  };

  getDakTableList = async (dakid) => {
    if (!this.ktables[dakid]) {
      const ktable = await this.getKTable({ dakid });
      runInAction(() => {
        this.ktables[dakid] = ktable;
      });
      return ktable;
    }
    return this.ktables[dakid];
  };

  getDaklist = async (dakid, tmzt, umid = "") => {
    if (!this.ktables[dakid]) {
      const ktable = await this.getKTable({ dakid });
      runInAction(() => {
        this.ktables[dakid] = ktable;
      });
    }
    const key = `${dakid}-${tmzt}${umid ? "-" + umid : ""}`;
    if (!this.columns[key]) {
      const kfields = await this.getKField({
        dakid: dakid,
        lx: tmzt,
        pg: "list",
      });
      runInAction(() => {
        this.columns[key] = kfields
          .filter((kfield) => kfield["lbkj"] == "Y")
          .map((kfield) => ({
            width: kfield["mlkd"] * 1,
            dataIndex: kfield["mc"].toLowerCase(),
            title: kfield["ms"],
            ellipsis: true
          }));
      });
    }
  };

  getKTable = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch.post(`${this.url}/queryKTable`, fd, {
      headers: { "Content-type": "application/x-www-form-urlencoded" },
    });
    if (response && response.status === 200) {
      return response.data;
    }
  };

  getKField = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch.post(`${this.url}/queryKFields`, fd, {
      headers: { "Content-type": "application/x-www-form-urlencoded" },
    });
    if (response && response.status === 200) {
      return response.data;
    }
  };
}

export default new DapubStore("/api/eps/control/main/dagl", true, true);
