import { observable, action, makeObservable , runInAction } from 'mobx';
import { Message } from '@alifd/next';
import fetch from '../../utils/fetch';
import BaseStore from '../BaseStore';
import moment from 'moment';

class ZxjstjStore extends BaseStore {
  constructor(url, wfenable, oldver = true) {
    super(url,wfenable,oldver);
    makeObservable(this);
}
  // 全局变量,默认取类型第一个值放置页面搜索下拉框用来回显
  @observable defaultData = {};
  // 单位列表
  @observable dwdata = [];
   // 档案库列表
   @observable dakdata = [];
  //在线接收统计列表
  @observable zxjstjdata = [];

  // 查询所有单位列表
  @action findDw = async () => {
    const response = await fetch
      .post('/api/eps/control/main/dw/queryForList', {});
    if (response && response.status === 200) {
      runInAction(() => {
        this.dwdata = response.data.map(item => {
          return { value: item.id, label: `${item.mc}` };
        });;
      });
    }
  }
  // 查询所有档案库列表
  @action findDak = async () => {
    const response = await fetch
      .post('/api/eps/control/main/dak/queryForDakList', {});
    if (response && response.status === 200) {
      runInAction(() => {
        this.dakdata = response.data
      });
    }
  }
  // 查询在线接收统计列表
  @action findZxjstj = async (params) => {

    const response = await fetch
      .post(`${this.url}` + "/zxjstj",{},{ params: { ...params } });
    if (response && response.status === 200) {
      runInAction(() => {

        this.data = this.afterQueryData(response.data);
        this.loading = false;
      });
    }
  }
  afterQueryData(data) {
    if (data) {
      const zxjstjdata = [];
      data.forEach(zxjstj => {
        this.dwdata.forEach(dw => {
          if (zxjstj.qzmc == dw.value) {
            zxjstj.qzname = dw.label
          }else if (zxjstj.qzmc =="合计") {
            zxjstj.qzname = "合计"
          }
        })
        this.dakdata.forEach(dak => {
          if (zxjstj.dakid == dak.id) {
            zxjstj.dalbmc = dak.mc
          }
        })
        zxjstjdata.push(zxjstj)
      })
      data = zxjstjdata;
    }
    return data;
  }

   //导出Excel
   @action downloadExcel = async (records) => {
    const excel = '.xlsx';
    fetch.post(`${this.url}` + "/exportExcel", records, { responseType: 'blob' }).then(response => {
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
            link.setAttribute('download', `在线接收统计_ ${moment().format('YYYY-MM-DD')}${excel}`);
            document.body.appendChild(link);
            link.click();
          }
        });
      }
    });
  }
}

export default new ZxjstjStore('/api/eps/datj/zxjstj', true, true);
