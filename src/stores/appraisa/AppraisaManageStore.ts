import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import SysStore from '../system/SysStore';
import util from '@/utils/util';
import DapubStore from '../dagl/DapubStore';

export class ArchParams {
  id: string;
  mbc: string;
  tmzt: number;
  dw: string;
  mc: string;
  text: string;
  dakid: any;
  bmc: any;
}

class AppraisaMainStore extends BaseStore {
  @observable isExpand = true;
  @observable treeData = [];
  @observable params: ArchParams = util.getSStorage('arch_param');
  @action queryForPage = async () => {
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
          this.data = this.afterQueryData(response.data);
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
        runInAction(() => {
          this.data = this.afterQueryData(response.data);
          this.loading = false;
        });
      } else {
        this.loading = true;
      }
    }
  };

  @action setExpand = (expend) => {
    this.expand = expend;
  };

  @action setParams = async (params, nosearch) => {
    this.params = params;
    if (!nosearch) {
      await this.queryTree();
    }
  };

  @action onArchTreeSelect = async (array, object) => {
    console.log('array', object);
  };

  @action saveData = async (values) => {
    values = this.beforeSaveData(values);
    let response;
    if (!this.oldver) {
      if (this.opt === 'edit') {
        response = await fetch.post(`${this.url}/update/`, values);
      } else {
        response = await fetch.post(`${this.url}/add`, values, {
          params: { pageno: this.pageno, pagesize: this.pagesize, ...values },
        });
      }
      if (response && response.status === 200) {
        runInAction(() => {
          this.editVisible = false;
          this.editRecord = this.beforeSetEditRecord(response.data);
          if (this.wfenable) {
            this.getProcOpt(this.editRecord);
          }
          this.afterSaveData(response.data);
        });
      }
    } else {
      const fd = new FormData();
      for (const key in values) {
        fd.append(key, values[key]);
      }
      if (this.opt === 'edit') {
        response = await fetch.put(
          `${this.url}${this.updateUrl || '/update'}`,
          fd,
          { headers: { 'Content-type': 'application/x-www-form-urlencoded' } },
        );
      } else {
        response = await fetch.post(`${this.url}${this.addUrl || '/add'}`, fd, {
          headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        });
      }
      if (response && response.status === 200 && response.data) {
        runInAction(() => {
          this.editVisible = false;
          this.editRecord = this.beforeSetEditRecord(response.data.results);
          if (this.wfenable) {
            this.getProcOpt(this.editRecord);
          }
          this.afterSaveData(response.data.results);
        });
      }
    }
  };

  @action delete = async (obj) => {
    console.log(obj);
    if (!this.oldver) {
      const response = await fetch.delete(
        `${this.url}/${encodeURIComponent(obj)}`,
      );
      if (response && response.status === 204) {
        this.afterDeleteData();
      }
    } else {
      const fd = new FormData();
      if (typeof obj === 'string') {
        fd.append('id', obj);
      } else {
        for (const key in obj) {
          fd.append(key, obj[key]);
        }
      }
      const response = await fetch.post(`${this.url}/delete?id=${obj}`, {
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        data: fd,
      });
      if (response && response.status === 200) {
        this.afterDeleteData();
      }
    }
  };

  @action findDakList = async () => {
    const params = {
      isby: 'N',
      noshowdw: 'Y',
      node: 'root',
      dw: SysStore.currentCmp.id,
      tmzt: '3',
      dayh: SysStore.currentUser.id,
    };
    const res = await fetch.get(`eps/control/main/dak/queryTree`, { params });
    this.treeData = res.data;
    console.log(this.treeData);
  };

  @action queryTree = async () => {
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
          tmzt: '8',
          noshowdw: 'Y',
          dayh: SysStore.getCurrentUser().id,
          dw: SysStore.getCurrentCmp().id,
          node: 'root',
          ...this.params,
        },
      });
      console.log(this.params);
      if (response && response.status === 200) {
        runInAction(() => {
          this.treeData = response.data;
          this.loading = false;
        });
      } else {
        this.loading = true;
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

export default new AppraisaMainStore('/api/eps/control/main/dak');
