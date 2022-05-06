import { observable, runInAction, makeObservable } from 'mobx';

import BaseStore from '@/stores/BaseStore';
import fetch from '@/utils/fetch';
import SysStore from '@/stores/system/SysStore';
import { sqlencode } from '@/utils/EpsUtils';

class TreeStore extends BaseStore {
  @observable isExpand = true;
  @observable treeData = [];
  @observable tmzt = 3;

  @observable kkjsTotal = 0;
  @observable kjData = [];
  @observable dakid = '';
  @observable key = '';
  @observable page_No = 1;
  @observable page_Size = 50;
  @observable kksjloading = false;
  @observable dw = SysStore.getCurrentCmp().id; //用户单位ID
  @observable checkedKeys = [];

  onChecked = async (checkedKeysValue) => {
    for (let item of checkedKeysValue) {
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
      dayh: SysStore.currentUser.id,
    };
    const res = await fetch.get(`/api/eps/control/main/dak/queryTree`, {
      params,
    });
    this.treeData = res.data;
    console.log(this.treeData);
  };

  queryTree = async () => {
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
      const response = await fetch.post(
        `${this.url}/queryTreeNewE9`,
        this.params,
        {
          // params: {
          //   pageno: this.pageno,
          //   pagesize: this.pagesize,
          //   tmzt: this.tmzt,
          //   noshowdw: "Y",
          //   isby: "Y",
          //   dayh: SysStore.getCurrentUser().id,
          //   dw: SysStore.getCurrentCmp().id,
          //   node: "root",
          //   ...this.params,
          // },

          params: {
            pageno: this.pageno,
            pagesize: this.pagesize,
            noshowdw: 'Y',
            isby: 'noby',
            dayh: SysStore.getCurrentUser().id,
            dw: SysStore.getCurrentCmp().id,
            node: 'root',
            ...this.params,
          },
        },
      );

      if (response && response.status === 200) {
        runInAction(() => {
          //  this.treeData = response.data;
          var sjData = [];
          if (response.data && response.data.length > 0) {
            debugger;
            for (var i = 0; i < response.data.length; i++) {
              let newKey = {};
              newKey = response.data[i];
              newKey.key = newKey.id;
              sjData.push(newKey);
            }
            this.treeData = sjData;
          }

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
