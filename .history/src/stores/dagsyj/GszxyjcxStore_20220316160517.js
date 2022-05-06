import { observable, action, makeObservable, runInAction } from 'mobx';
import { Message } from '@alifd/next';
import fetch from '../../utils/fetch';
import BaseStore from '../BaseStore';

class GszxyjcxStore extends BaseStore {
  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this);
  }
  // 全局变量,默认取类型第一个值放置页面搜索下拉框用来回显
  @observable defaultData = {};
  // 单位列表
  @observable dwdata = [];
  // 档案库列表
  @observable dakdata = [];
  // 部门列表
  @observable bmdata = [];
  //进馆移交查询列表
  @observable gszxyjcxdata = [];
  //下载加载状态
  @observable downloadLoading = false;

  @observable packetfilepath = '';
  // 查询所有单位列表
  @action findDw = async () => {
    const response = await fetch.post(
      '/api/eps/control/main/dw/queryForList',
      {},
    );
    if (response && response.status === 200) {
      runInAction(() => {
        this.dwdata = response.data.map((item) => {
          return { value: item.id, label: `${item.mc}` };
        });
      });
    }
  };
  // 查询所有档案库列表
  @action findDak = async () => {
    const response = await fetch.post(
      '/api/eps/control/main/dak/queryForList',
      {},
    );
    if (response && response.status === 200) {
      runInAction(() => {
        this.dakdata = response.data;
      });
    }
  };
  afterQueryData(data) {
    if (data.results) {
      const gszxyjcxdata = [];
      data.results.forEach((gszxyjcx) => {
        this.dwdata.forEach((dw) => {
          if (gszxyjcx.dw == dw.value) {
            gszxyjcx.dwname = dw.label;
          }
          if (gszxyjcx.gmc == dw.value) {
            gszxyjcx.gmcname = dw.label;
          }
        });
        this.dakdata.forEach((dak) => {
          if (gszxyjcx.dakid == dak.id) {
            gszxyjcx.dakmc = dak.mc;
          }
          if (gszxyjcx.gdakid == dak.id) {
            gszxyjcx.gdakmc = dak.mc;
          }
        });
        gszxyjcxdata.push(gszxyjcx);
      });
      data.list = gszxyjcxdata;
    }
    return data;
  }
  // 下载EEP包
  @action downloadEEP = async (params) => {
    debugger;
    this.downloadLoading = true;
    await fetch
      .post('/api/eps/control/main/gszxyjcx/downloaDgsyjEep', params, {
        responseType: 'blob',
      })
      .then((res) => {
        if (res.status === 200) {
          const type =
            res.headers['context-type'] && 'application/octet-stream';
          const blob = new Blob([res.data], { type });
          const url = window.URL.createObjectURL(blob);
          const aLink = document.createElement('a');
          aLink.style.display = 'none';
          aLink.href = url;
          aLink.setAttribute(
            'download',
            decodeURIComponent(params.id + '.eep'),
          );
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
          this.downloadLoading = false;
        } else {
          this.downloadLoading = false;
          Message.error('导出数据包失败！');
        }
      });
  };

  @action xdownloadEEP = async (params) => {
    debugger;
    this.downloadLoading = true;
    await fetch
      .post('/api/eps/control/main/gszxyjcx/xdownloaDgsyjEep', params, {
        responseType: 'blob',
      })
      .then((res) => {
        if (res.status === 200) {
          const type =
            res.headers['context-type'] && 'application/octet-stream';
          const blob = new Blob([res.data], { type });
          const url = window.URL.createObjectURL(blob);
          const aLink = document.createElement('a');
          aLink.style.display = 'none';
          aLink.href = url;
          aLink.setAttribute(
            'download',
            decodeURIComponent(params.id + '.eep'),
          );
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
          this.downloadLoading = false;
        } else {
          this.downloadLoading = false;
          Message.error('导出数据包失败！');
        }
      });
  };
  @action packEEP_2022 = async (params) => {
    this.downloadLoading = true;
    await fetch
      .post('/api/eps/control/main/gszxyjcx/packEEP_2022', params)
      .then((packres) => {
        if (packres.status === 201) {
          Message.loading('数据包打包成功，开始进行下载，请稍等！');
          this.packetfilepath = packres.data;
        } else {
          this.downloadLoading = false;
          Message.error('EEP数据包打包失败！');
        }
      })
      .catch((err) => {
        Message.error('EEP数据包打包失败！');
      });
  };
  @action downloadEep = async (params) => {
    await fetch
      .post('/api/eps/e9eep/packet/downloadEep', params, {
        responseType: 'blob',
      })
      .then((res) => {
        if (res.status === 200) {
          const type =
            res.headers['context-type'] && 'application/octet-stream';
          const blob = new Blob([res.data], { type });
          const url = window.URL.createObjectURL(blob);
          const aLink = document.createElement('a');
          aLink.style.display = 'none';
          aLink.href = url;
          const eeppath = params.packetfilepath.replace(/\\/g, '/');
          const fileString = eeppath.split('/');
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < fileString.length; i++) {
            if (fileString[i].indexOf('.eep') !== -1) {
              aLink.setAttribute('download', decodeURIComponent(fileString[i]));
              document.body.appendChild(aLink);
              aLink.click();
              document.body.removeChild(aLink);
              window.URL.revokeObjectURL(url);
            }
          }
        } else {
          Message.error(
            'EEP数据包下载失败,原因：当前数据包不存在或源文件已被删除！',
          );
        }
      })
      .catch((err) => {
        Message.error(
          'EEP数据包下载失败,原因：当前数据包不存在或源文件已被删除！',
        );
      });
    this.downloadLoading = false;
  };
}

export default new GszxyjcxStore('/api/eps/control/main/gszxyjcx', true, true);
