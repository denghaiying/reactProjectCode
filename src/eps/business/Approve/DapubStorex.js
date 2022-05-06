import { observable, action, runInAction, makeObservable } from "mobx";
import BaseStore from "@/stores/BaseStore";
import fetch from "@/utils/fetch";

class DapubStorex extends BaseStore {
  @observable ktables = {};
  @observable childlist = {};
  @observable childColumns=[];
  @observable mainColumns=[];
  constructor(url, wfenable, oldver = true) {
    super(url,wfenable,oldver);
    makeObservable(this);
  }


  @action getDDaklist = async (fid) => {
    if (!this.childlist[fid]) {
      const ktable = await this.getKTable({ fid });
      runInAction( () => {
        this.childlist[fid] = ktable.id;
        this.ktables[ktable.id] = ktable;
      });
    }
  };

  @action getDakTableList = async (dakid) => {
    if (!this.ktables[dakid]) {
      const ktable = await this.getKTable({ dakid });
      runInAction( () => {
        this.ktables[dakid] = ktable;
      });
      return ktable;
    }
    return this.ktables[dakid];
  };

  @action  getDaklist = async (dakid, tmzt, umid = "") => {
    if (!this.ktables[dakid]) {
      const ktable = await this.getKTable({ dakid });
      runInAction( () => {
        this.ktables[dakid] = ktable;
      });
    }
    const key = `${dakid}-${tmzt}${umid ? "-" + umid : ""}`;

      const kfields = await this.getKField({
        dakid: dakid,
        lx: tmzt,
        pg: "list",
      });
      runInAction( () => {
        this.mainColumns = kfields
          .filter((kfield) => kfield["lbkj"] == "Y")
          .map((kfield) => ({
            width: kfield["mlkd"] * 1,
            dataIndex: kfield["mc"].toLowerCase(),
            code: kfield["mc"].toLowerCase(),
            title: kfield["ms"],
            ellipsis: true
          }));

      });

  };

  @action getKTable = async (params) => {
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

  @action getKField = async (params) => {
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

export default new DapubStorex("/api/eps/control/main/dagl", true, true);
