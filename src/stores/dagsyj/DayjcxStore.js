import { observable, action, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import BaseStore from '../BaseStore';

class DayjcxStore extends BaseStore {
  // 全局变量,默认取类型第一个值放置页面搜索下拉框用来回显
  @observable defaultData = {};
  // 单位列表
  @observable dwdata = [];
  // 档案库列表
  @observable dakdata = [];
  // 部门列表
  @observable bmdata = [];
  //档案馆室移交查询列表
  @observable dayjcxdata = [];

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
      .post('/api/eps/control/main/dak/queryForList', {});
    if (response && response.status === 200) {
      runInAction(() => {
        this.dakdata = response.data;
      });
    }
  }
  // 查询所有部门列表
  @action findBm = async () => {
    const response = await fetch
      .post('/api/eps/control/main/org/queryForList', {});
    if (response && response.status === 200) {
      runInAction(() => {
        this.bmdata = response.data;
      });
    }
  }
  afterQueryData(data) {

    if (data.results) {
      const dayjcxdata = [];
      data.results.forEach(dayjcx => {
        this.dwdata.forEach(dw => {
          if (dayjcx.scdw == dw.value) {
            dayjcx.scdwname = dw.label
          }
          if (dayjcx.gcdw == dw.value) {
            dayjcx.gcdwname = dw.label
          }
        })
        this.dakdata.forEach(dak => {
          if (dayjcx.scdakid == dak.id) {
            dayjcx.scdakname = dak.mc
          }
          if (dayjcx.gcdakid == dak.id) {
            dayjcx.gcdakname = dak.mc
          }
        })
        this.bmdata.forEach(bm => {
          if (dayjcx.sqbmid == bm.id) {
            dayjcx.sqbmname = bm.name
          }
        })
        dayjcxdata.push(dayjcx)
      })
      data.list = dayjcxdata;
    }
    return data;
  }
  // 下载EEP包
  @action downloadEEP = async () => {

    const params = {
      dakid: "DAK201810241634300008",
      tmid: "DAIM202004031357510010",
      bmc: "DAKSW000001",
      id: "GSZXYJSQD202004031357510010"
    };
    await fetch.post('/api/eps/control/main/gszxyjcx/downloaDgsyjEep', params, { responseType: 'blob' }).then(res => {
      if (res.status === 200) {

        const type = res.headers['context-type'] && 'application/octet-stream';
        const blob = new Blob([res.data], { type });
        const url = window.URL.createObjectURL(blob);
        const aLink = document.createElement('a');
        aLink.style.display = 'none';
        aLink.href = url;
        aLink.setAttribute('download', decodeURIComponent(params.id+".eep"));
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
        window.URL.revokeObjectURL(url);
      } else {
        throw (util.bussinessException(res.status, res.data));
      }
    });
  }
}

export default new DayjcxStore('/api/eps/control/main/dadyjcx', true, true);
