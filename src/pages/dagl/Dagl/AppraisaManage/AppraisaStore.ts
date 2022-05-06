import { observable, runInAction, makeObservable } from "mobx";

import BaseStore from "../BaseStore";
import fetch from "../../utils/fetch";
import SysStore from '../system/SysStore';


class AppraisaMainStore extends BaseStore {
  @observable isExpand = true;
  @observable treeData = [];
  @observable tmzt=3;

  constructor(url, wfenable, oldver = true,tmzt) {
    super(url,wfenable,oldver);
    this.tmzt=tmzt;
    makeObservable(this);
  }

  queryForPage = async () => {
    this.loading = true;

    console.log(this.params);
    if (!this.oldver) {
      const response = await fetch.post(
        `${this.url}/queryForPage`,
        this.params,
        {
          params: {
            pageno: this.pageno,
            pagesize: this.pagesize,
            ...this.params,
          },
        }
      );
      if (response && response.status === 200) {
      //  runInAction( () => {
          this.data = response.data;
          this.loading = false;
     //   });
      } else {
        this.loading = true;
      }
    } else {
      const fd = new FormData();
      fd.append("page", this.pageno - 1);
      fd.append("limit", this.pagesize);
      if (this.params) {
        for (const key in this.params) {
          fd.append(key, this.params[key]);
        }
      }
      const response = await fetch.post(
        `${this.url}${this.queryForPageUrl || "/queryForPage"}`,
        fd,
        { headers: { "Content-type": "application/x-www-form-urlencoded" } }
      );
      if (response && response.status === 200 && response.data.success) {
      //  runInAction( () => {
          this.data = this.afterQueryData(response.data);
          this.loading = false;
      //  });
      } else {
        this.loading = true;
      }
    }
  };

   setExpand = (expend) => {
    this.expand = expend;
  };

   setParams = async (params, nosearch) => {

    this.params = params;
    if (!nosearch) {
      await this.queryTree();
    }
  };


   onArchTreeSelect = async (array,object) => {
    console.log("array",object);

  };






   findDakList = async () => {
    const params = {
        isby: "N",
        noshowdw: "Y",
        node: "root",
        dw: SysStore.currentCmp.id,
        tmzt: this.tmzt,
        dayh: SysStore.currentUser.id
    };
    const res = await fetch
        .get(`eps/control/main/dak/queryTree`, {params});
    this.treeData = res.data;
    console.log(this.treeData);
  }

   queryTree = async () => {
    this.loading = true;

    console.log(this.params);
    if (!this.oldver) {
      //const response = await fetch.post(`${this.url}/queryTree`, this.params, { params: { pageno: this.pageno, pagesize: this.pagesize,tmzt: "8", noshowdw: "Y",dayh:"YH201904132026100005",dw:"DW201408191440170001",node:"root", ...this.params } });
      //
      // if (response && response.status === 200) {
      //     runInAction(() => {
      //
      //         this.loading = false;
      //     });
      //     this.treeData = response.data;
      // }
      // else {
      //     this.loading = true;
      // }
    } else {
      const response = await fetch.post(`${this.url}/queryTree`, this.params, {

        params: {
          pageno: this.pageno,
          pagesize: this.pagesize,
          tmzt: this.tmzt,
          noshowdw: "Y",
          dayh: SysStore.getCurrentUser().id,
          dw: SysStore.getCurrentCmp().id,
          node: "root",
          ...this.params,
        },
      });
      ;
      console.log(this.params);
      if (response && response.status === 200) {
        runInAction( () => {
          this.treeData = response.data;
          this.loading = false;
        });

      } else {
        this.loading = true;
      }
      const fd = new FormData();
      fd.append("page", this.pageno - 1);
      fd.append("limit", this.pagesize);
      if (this.params) {
        for (const key in this.params) {
          fd.append(key, this.params[key]);
        }
      }
    }
  };
}

export default new AppraisaMainStore("/api/eps/control/main/dak");
