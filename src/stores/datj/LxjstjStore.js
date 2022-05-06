import { observable, action, makeObservable, runInAction } from 'mobx';
import { Message } from '@alifd/next';
import fetch from '../../utils/fetch';
import moment from 'moment';

class LxjstjStore {
  //在线接收统计列表
  url = "";
  data = [];
  loading = false;
  sjzdData = {};
  qzhlist = [];

  constructor(url) {
    this.url = url;
    makeObservable(this,
      {
        loading: observable,
        sjzdData: observable,
        data: observable,
        qzhlist: observable,

        getQzhData: action,
        getSjzdData: action,
        findLxjstj: action,
        downloadExcel: action,
      });
  }

  // action
  getQzhData = async () => {
    const res = await fetch.post(`/eps/control/main/basetj/queryQzhlist`, {});
    if (res && res.data) {
      runInAction(() => {
        this.qzhlist = res.data || [];
      });
    }
  };

  //action
  getSjzdData = async (zdmc) => {
    const res = await fetch.post(`/eps/control/main/sjzdmx/queryForList`, {}, { params: { zdx: zdmc } });
    if (res && res.data) {
      runInAction(() => {
        this.sjzdData[zdmc] = res.data || [];
      });
    }
  };

  // 查询在线接收统计列表
  findLxjstj = async (params) => {
    this.loading = true;
    const response = await fetch
      .post(`${this.url}/lxjstj`, {}, { params: { ...params } });
    if (response && response.status === 200) {
      runInAction(() => {

        this.data = response.data;
        this.loading = false;
      });
    }
  }
  //导出Excel
  downloadExcel = async (records) => {
    const excel = '.xlsx';
    fetch.post(`${this.url}/exportExcel`, records, { responseType: 'blob' }).then(response => {
      if (response.status === 200) {
        runInAction(() => {
          const data = response.data;
          if (!data) {
            Message.error('导出EXCEL失败！');
          } else {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', `离线接收统计_ ${moment().format('YYYY-MM-DD')}${excel}`);
            document.body.appendChild(link);
            link.click();
          }
        });
      }
    });
  }
}

export default new LxjstjStore('/eps/datj/lxjstj');
