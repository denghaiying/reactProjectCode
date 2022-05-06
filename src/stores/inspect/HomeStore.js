
import BaseStore from '../BaseStore';
import { action, runInAction, observable } from 'mobx';
import fetch from '../../utils/fetch';

class HomeStore extends BaseStore {
  @observable hgldatalist = '';
  @observable data1 = [];
  @observable data2 = [];
  @observable jb = {};
  @observable reSetBzjcdata = [];
  @observable zb = {};

  @action reSetHglChartOption = async () => {
    fetch.get('/jctj/ywhgl').then(response => {
      if (response.status === 200) {
        runInAction(() => {
          this.hgldatalist = response.data;
        });
      }
    });
  };

  @action reSetJcsOption = async () => {
    fetch.get('/jctj/jcsq').then(response => {
      const data1 = response.data;
      const data2 = [];
      if (response.status === 200) {
        runInAction(() => {
          if (data1.z && data1.z > 0) {
            data2.push({
              value: data1.z,
              name: '已检测',
              selected: true,
            });
          }
          if (data1.p && data1.p > 0) {
            data2.push({
              value: data1.p,
              name: '检测中',
            });
          }
          if (data1.c && data1.c > 0) {
            data2.push({
              value: data1.c,
              name: '待检测',
            });
          }
          if (data1.e && data1.e > 0) {
            data2.push({
              value: data1.e,
              name: '检测异常',
            });
          }
          this.data2 = data2;
          // this.jcsChart.setOption(this.jcsChartOption, true);
        });
      }
    });
  }

  @action reSetBzjcOption = async () => {
    fetch.get('/jctj/week').then(response => {
      if (response.status === 200) {
        runInAction(() => {
          this.reSetBzjcdata = response.data;
        });
      }
    });
  }
  @action queryJb = async () => {
    this.jbLoading = true;
    fetch.get('/jctj/jb').then(response => {
      if (response.status === 200) {
        this.jb = response.data;
      }
      this.jbLoading = false;
    });
  };

  @action queryZb = async () => {
    this.zbLoading = true;
    fetch.get('/jctj/zb').then(response => {
      if (response.status === 200) {
        this.zb = response.data;
      }
      this.zbLoading = false;
    });
  };
}
export default new HomeStore();
