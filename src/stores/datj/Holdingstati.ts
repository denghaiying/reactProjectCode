import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';

const dakurl = '/api/eps/control/main/dak/queryTreeReact';

class Holdingstati {
  url = '';
  wfenable = false;
  oldver = true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeAutoObservable(this);
  }

  @observable data = [];
  @observable record = {};
  @observable params = {};
  @observable loading = false;
  @observable pageno = 1;
  @observable pagesize = 20;
  @observable opt = 'view';
  @observable editVisible = false;
  @observable editRecord = {};
  @observable selectRowKeys = [];
  @observable selectRowRecords = [];
  @observable columns = [];
  @observable signcomment = '';
  @observable procOpt = {};
  @observable dataSource = [];

  @observable paramValue = '';

  openNotification = (a, type) => {
    Notification.open({ title: a, type });
  };

  setSigncomment = (comment) => {
    this.signcomment = comment;
  };

  setColumns = (columns) => {
    this.columns = columns;
  };

  setPageNo = async (pageno) => {
    this.pageno = pageno;
    await this.queryForPage();
  };

  setPageSize = async (pageSize) => {
    this.pagesize = pageSize;
    await this.queryForPage();
  };

  setParams = async (params, nosearch) => {
    this.params = { ...params };
    if (!nosearch) {
      await this.queryForPage();
    }
  };

  setDataSource = (dataSource) => {
    this.dataSource = dataSource;
  };

  setSelectRows = async (selectRowKeys, selectRowRecords) => {
    this.selectRowKeys = selectRowKeys;
    this.selectRowRecords = selectRowRecords;
  };

  afterQueryData(data) {
    return data;
  }

  @observable dakbmclist = [];
  @observable seardataSource = [];
  @observable dakid = '';
  @observable dwlist = [];
  @observable qzhlist = [];
  @action findlist = async () => {
    const dwid = SysStore.currentUser.dwid;
    const url = dakurl + '?dw=' + dwid;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      this.dakbmclist = response.data;
    }
  };
  @action setDakid = (dakid) => {
    this.dakid = dakid;
  };
  @action setSearDatasous = (dataSource) => {
    this.seardataSource = dataSource;
  };
  @action queryDwlist = async (value) => {
    const params = {
      dwmc: value,
    };
    const list = await fetch.get(`eps/control/main/dw/queryForList`, {
      params,
    });
    this.dwlist = list.data;
  };
  @action queryQzhlist = async (value) => {
    const params = {
      qzh: value,
    };
    const list = await fetch.get(`${this.url}/queryQzhlist`, { params });
    this.qzhlist = list.data;
  };
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
      console.log(response);
      if (response && response.status === 200) {
        runInAction(() => {
          this.data = this.afterQueryData(response.data);
          this.loading = false;
        });
      } else {
        this.loading = true;
      }
    } else {
      const params = this.params;
      const response = await fetch.get(
        `${this.url}${this.queryForPageUrl || '/queryGsForList'}`,
        { params },
      );
      if (response && response.status === 200) {
        runInAction(() => {
          this.data = this.afterQueryData(response.data || []);
          console.log(this.data);
          this.loading = false;
        });
      } else {
        runInAction(() => {
          this.data = [];
          this.loading = false;
        });
      }
    }
  };

  beforeSaveData(value) {
    value.dakid = this.dakid;
    return value;
  }

  saveData = async (values) => {
    values = this.beforeSaveData(values);
    let response;
    if (!this.oldver) {
      if (this.opt === 'edit') {
        response = await fetch.post(`${this.url}/update/`, values);
      } else {
        response = await fetch.post(`${this.url}/add`, values, {
          params: {
            pageno: this.pageno,
            pagesize: this.pagesize,
            ...values,
          },
        });
      }
      if (response && response.status === 200) {
        runInAction(() => {
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
          this.editRecord = this.beforeSetEditRecord(response.data.results);
          if (this.wfenable) {
            this.getProcOpt(this.editRecord);
          }
          this.afterSaveData(response.data.results);
        });
      }
    }
  };

  beforeSetEditRecord(value) {
    this.dakid = '';
    return value;
  }

  delete = async (obj) => {
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
  //导出Excel
  @action downloadExcel = async (records) => {
    const excel = '.xlsx';
    fetch
      .post('/api/eps/control/main/holdinggroup/exportExcel', records, {
        responseType: 'blob',
      })
      .then((response) => {
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
              link.setAttribute(
                'download',
                `馆藏档案统计_ ${moment().format('YYYY-MM-DD')}${excel}`,
              );
              document.body.appendChild(link);
              link.click();
            }
          });
        }
      });
  };
  /**
   * 获取保管期限吧
   * @returns
   */
  getBgqx = () => {
    return new Promise((resolve, reject) => {
      fetch
        .get('/api/eps/control/main/sjzdmx/queryTree?fid=SJZD001')
        .then((response) => {
          if (response && response.status === 200) {
            resolve(response.data);
          } else {
            resolve([]);
          }
        })
        .catch(() => {
          resolve([]);
        });
    });
  };
}

export default new Holdingstati('/api/eps/control/main/basetj');
