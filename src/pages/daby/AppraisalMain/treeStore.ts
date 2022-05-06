import { observable, runInAction, makeObservable } from 'mobx';

import BaseStore from '@/stores/BaseStore';
import fetch from '@/utils/fetch';
import SysStore from '@/stores/system/SysStore';
import { sqlencode } from '@/utils/EpsUtils';

class TreeStore extends BaseStore {
  @observable isExpand = true;
  @observable treeData = [];
  @observable tmzt = 5;

  @observable kkjsTotal = 0;
  @observable kjData = [];
  @observable dakid = '';
  @observable key = '';
  @observable page_No = 1;
  @observable page_Size = 50;
  @observable kksjloading = false;
  @observable dw = SysStore.getCurrentUser().dwid; //用户单位ID
  @observable checkedKeys = [];

  onChecked = async (checkedKeys) => {
    for (let item of checkedKeys) {
      if (this.dakid === '') {
        this.dakid = item;
      } else {
        this.dakid += ',' + item;
      }
    }
  };

  constructor(url, wfenable, oldver, tmzt) {
    super(url, wfenable, oldver);
    this.tmzt = tmzt;
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
        },
      );
      if (response && response.status === 200) {
        runInAction(() => {
          this.data = response.data;
          this.loading = false;
        });
      } else {
        this.loading = true;
      }
    } else {
      const fd = new FormData();
      fd.append('page', this.pageno - 1);
      fd.append('limit', this.pagesize);
      if (this.params) {
        for (const key in this.params) {
          fd.append(key, this.params[key]);
        }
      }
      const response = await fetch.post(
        `${this.url}${this.queryForPageUrl || '/queryForPage'}`,
        fd,
        { headers: { 'Content-type': 'application/x-www-form-urlencoded' } },
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

  queryKkjsPage = async () => {
    this.kksjloading = true;
    const response = await fetch.get(
      `/api/eps/control/main/kkjs/queryForPage?dakzt=${this.tmzt}&key=${
        this.key
      }&dw=${this.dw}&dakid=${sqlencode(this.dakid)}&pageIndex=${
        this.page_No - 1
      }&pageSize=${this.page_Size}&page=${this.page_No - 1}&limit=${
        this.page_Size
      }`,
    );
    if (response && response.status === 200) {
      debugger;
      runInAction(() => {
        this.kjData = response.data;
        this.kkjsTotal = response.data.total;
        this.kksjloading = false;
      });
    } else {
      this.kksjloading = true;
    }
  };
  setKey = (key) => {
    this.key = key;
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

  onArchTreeSelect = async (array, object) => {
    console.log('array', object);
  };

  findDakList = async () => {
    const params = {
      isby: 'N',
      noshowdw: 'Y',
      node: 'root',
      dw: SysStore.currentCmp.id,
      tmzt: this.tmzt,
      dayh: SysStore.currentUser.id,
    };
    const res = await fetch.get(`/api/eps/control/main/dak/queryTree`, {
      params,
    });
    this.treeData = res.data;
    console.log(this.treeData);
  };

  queryTree = async () => {
    console.log('treeeparam==', this.params);
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
      const response = await fetch.post(
        `${this.url}/queryTreeNewE9`,
        this.params,
        {
          params: {
            pageno: this.pageno,
            pagesize: this.pagesize,
            tmzt: this.tmzt,
            noshowdw: 'Y',
            isby: 'Y',
            dayh: SysStore.getCurrentUser().id,
            dw: SysStore.getCurrentCmp().id,
            node: 'root',
            ...this.params,
          },
        },
      );
      console.log(this.params);
      if (response && response.status === 200) {
        runInAction(() => {
          this.treeData = response.data;
          this.loading = false;
        });
      }
      const fd = new FormData();
      fd.append('page', this.pageno - 1);
      fd.append('limit', this.pagesize);
      if (this.params) {
        for (const key in this.params) {
          fd.append(key, this.params[key]);
        }
      }
    }
  };
}

export default TreeStore;
