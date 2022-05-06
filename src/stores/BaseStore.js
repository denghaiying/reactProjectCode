import { observable, action, makeObservable, runInAction } from 'mobx';
import qs from 'qs';
import fetch from '@/utils/fetch';
import util from '@/utils/util';
import { Notification } from '@alifd/next';
import SysStore from './system/SysStore';

export default class BaseStore {
  url = '';
  wfenable = false;
  oldver = true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeObservable(this);
  }

  queryForPageUrl = '';
  addUrl = '';
  updateUrl = '';
  deleteUrl = '';
  queryByIdUrl = '';
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

  @observable paramValue = '';

  setParamValue = async (code) => {
    const url =
      '/api/eps/control/main/params/getUserOption?code=' + code + '&yhid=';
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      let aaa = response.data.message.toString();
      this.paramValue = response.data.message.toString();
    } else {
      this.loading = true;
    }
  };

  openNotification = (a, type) => {
    Notification.open({ title: a, type });
  };

  setSigncomment = (comment) => {
    this.signcomment = comment;
  };

  setColumns = (columns) => {
    console.log(2);
    runInAction(() => {
      this.columns = columns;
    });
  };

  async init() {}

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

  setSelectRows = async (selectRowKeys, selectRowRecords) => {
    this.selectRowKeys = selectRowKeys;
    this.selectRowRecords = selectRowRecords;
  };

  queryForPage = async () => {
    this.loading = true;
    if (!this.oldver) {
      const response = await fetch.post(this.url, this.params, {
        params: { pageno: this.pageno, pagesize: this.pagesize },
      });
      if (response && response.status === 200) {
        this.data = this.afterQueryData(response.data);
        this.loading = false;
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
        runInAction(() => {
          this.loading = false;
        });
      }
    }
  };

  delete = async (obj) => {
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
      const response = await fetch.delete(
        `${this.url}${this.deleteUrl || '/delete'}`,
        {
          headers: { 'Content-type': 'application/x-www-form-urlencoded' },
          data: fd,
        },
      );
      if (response && response.status === 200) {
        this.afterDeleteData();
      }
    }
  };

  saveData = async (values) => {
    values = this.beforeSaveData(values);
    let response;
    if (!this.oldver) {
      if (this.opt === 'edit') {
        response = await fetch.put(
          `${this.url}/${encodeURIComponent(this.editRecord.id)}`,
          values,
        );
      } else {
        response = await fetch.post(this.url, values);
      }
      if (response && response.status === 201) {
        this.editVisible = false;
        this.editRecord = this.beforeSetEditRecord(response.data);
        if (this.wfenable) {
          this.getProcOpt(this.editRecord);
        }
        this.afterSaveData(response.data);
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
        if (response.data.success == false) {
          this.openNotification(response.data.message, 'warning');
        }
        this.editVisible = false;
        this.editRecord = this.beforeSetEditRecord(response.data.results);
        if (this.wfenable) {
          this.getProcOpt(this.editRecord);
        }
        this.afterSaveData(response.data.results);
      }
    }
  };

  showEditForm = (opt, editRecord) => {
    runInAction(() => {
      this.opt = opt;
      this.editVisible = true;
      this.editRecord = this.beforeSetEditRecord(editRecord);
      if (this.wfenable) {
        this.getProcOpt(this.editRecord);
      }
    });
  };

  closeEditForm = () => {
    runInAction(() => {
      this.editVisible = false;
    });
  };

  onRecordChange = (value) => {
    this.editRecord = value;
  };

  setRecordValue = (item, value) => {
    const { ...p } = this.editRecord;
    p[item] = value;
    this.editRecord = { ...p };
  };

  getProcOpt = async (record) => {
    if (
      record &&
      record.wfid &&
      record.wpid & !this.procOpt[`${record.wfid}-${record.wpid}`]
    ) {
      const res = await fetch.get(
        `/api/eps/workflow/wf/procopt/${record.wfid}/${record.wpid}`,
      );
      if (res.status === 200) {
        runInAction(() => {
          this.procOpt[`${record.wfid}-${record.wpid}`] = res.data;
        });
      }
    }
  };

  getProcOpts = async (wfvid) => {
    const res = await fetch.get(`/api/eps/workflow/wf/procopt/${wfvid}`);
    if (res.status === 200) {
      runInAction(() => {
        if (res.data) {
          res.data.forEach((item) => {
            this.procOpt[`${item.wfid}-${item.wpid}`] = item;
          });
        }
      });
    }
  };

  uploadFile(file, params, uploadUrl = '/upload', option) {
    const param = new FormData();
    param.append('file', file);
    if (params) {
      Object.keys(params).forEach((k) => {
        param.append(k, params[k]);
      });
    }
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    if (option && option.onProgress) {
      config.onUploadProgress = (e) => {
        option.onProgress(e);
      };
    }
    return fetch.post(`${this.url}${uploadUrl}`, param, config);
  }

  findById(obj) {
    if (!this.oldver) {
      return new Promise((resolve, reject) => {
        fetch
          .get(`${this.url}/${encodeURIComponent(obj)}`)
          .then((response) => {
            if (response.status === 200) {
              resolve(response.data);
            } else {
              reject(util.bussinessException(response.status, response.data));
            }
          })
          .catch((err) => {
            if (err.response) {
              reject(
                util.bussinessException(err.response.status, err.response.data),
              );
            } else {
              reject(util.bussinessException('404', 'NOt Found'));
            }
          });
      });
    }
    let json = {};
    if (typeof obj === 'string') {
      json.id = obj;
    } else {
      json = { ...obj };
    }
    return new Promise((resolve, reject) => {
      fetch
        .get(
          `${this.url}${this.queryByIdUrl || '/queryForId'}?${qs.stringify(
            json,
          )}`,
        )
        .then((response) => {
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(
              util.bussinessException(response.status, response.data.message),
            );
          }
        })
        .catch((err) => {
          if (err.response) {
            reject(
              util.bussinessException(err.response.status, err.response.data),
            );
          } else {
            reject(util.bussinessException('404', 'NOt Found'));
          }
        });
    });
  }

  findAll(params) {
    return new Promise((resolve, reject) => {
      fetch
        .get(this.url, { params })
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        })
        .catch((err) => {
          reject(
            util.bussinessException(err.response.status, err.response.data),
          );
        });
    });
  }

  // something need override
  beforeSetEditRecord(value) {
    return value;
  }

  beforeSaveData(value) {
    return value;
  }

  // eslint-disable-next-line no-unused-vars
  afterSaveData(data) {
    this.queryForPage();
  }

  afterDeleteData() {
    this.queryForPage();
  }

  afterQueryData(data) {
    return data;
  }

  canWfEdit = (ctrl) => {
    const record = this.editRecord;
    if (!record || !record.wfinst) {
      return true;
    }
    if (record.wfawaiterid) {
      if (
        !`,${record.wfawaiterid},`.includes(`,${SysStore.getCurrentUser().id},`)
      ) {
        return false;
      }
    } else {
      if (
        !`,${record.wfawaiter},`.includes(`,${SysStore.getCurrentUser().yhmc},`)
      ) {
        return false;
      }
    }
    const aKey = `${record.wfid}-${record.wpid}`;
    const r = this.procOpt[aKey];
    if (r) {
      if (r.canEdit) {
        if (ctrl) {
          // 对于没有ctrl的，直接判断
          const lst = r.ctrlOpt;
          if (lst && lst.length > 0) {
            for (let i = 0; i <= lst.length - 1; i++) {
              const cl = lst[i];
              if (cl.ctrl === ctrl) {
                if (cl.type !== 'B') {
                  return false;
                }
              }
            }
          }
        }
        return true;
      }
    }
    return false;
  };

  canWfDelete = (rec) => {
    let record = rec;
    if (!record) {
      record = this.selectRowRecords[0];
    }
    if (!record || !record.wfinst) {
      return true;
    }
    if (record.wfawaiterid) {
      if (
        !`,${record.wfawaiterid},`.includes(`,${SysStore.getCurrentUser().id},`)
      ) {
        return false;
      }
    } else {
      if (
        !`,${record.wfawaiter},`.includes(`,${SysStore.getCurrentUser().yhmc},`)
      ) {
        return false;
      }
    }
    const aKey = `${record.wfid}-${record.wpid}`;
    const r = this.procOpt[aKey];
    return r && r.canDelete;
  };

  ctrlWfVisile = (ctrl, rec) => {
    const record = rec || this.editRecord;
    if (!record) {
      return false;
    }
    const aKey = `${record.wfid}-${record.wpid}`;
    const r = this.procOpt[aKey];
    if (r) {
      const lst = r.ctrlOpt;
      if (lst && lst.length > 0) {
        for (let i = 0; i <= lst.length - 1; i++) {
          const cl = lst[i];
          if (cl.ctrl === ctrl) {
            if (cl.type === 'C') {
              return false;
            }
          }
        }
      }
    }
    return true;
  };
}
