import { observable, action, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import util from '../../utils/util';
import BaseStore from '../BaseStore';


class MenuStore extends BaseStore {
  sysFuncData = [];
  treeDataOld = [];
  sysFuncDataOld = [];
  @observable sysid = '';
  @observable moduleid = '';
  @observable treeData = [];
  @observable funcData = [];
  @observable expandedKeys = [];
  @observable moduleData = [];
  inEdit = false;

  setEdit = () => {
    this.inEdit = true;
  }

  @action queryData = async (sysid) => {
    this.sysid = sysid;
    this.queryMenuData();
    this.queryModule();
  }


  // 根据系统id查询下拉树型结构数据
  @action queryMenuData = async () => {
    this.loading = true;
    try {
      const treeData = await this.findById(this.sysid);
      this.treeDataOld = treeData;
      runInAction(() => {
        this.treeData = treeData;
        this.loading = false;
      });
    } catch (err) {
      throw err;
    }
  }

  // 根据系统名查询模块名
  @action queryModule = async () => {
    this.loading = true;
    try {
      const moduleData = await this.findModules({ sysid: this.sysid });
      this.sysFuncData = await this.queryNMenuFunc(this.sysid) || [];
      this.sysFuncDataOld = this.sysFuncData;
      runInAction(() => {
        this.moduleData = moduleData;
        if (moduleData && moduleData.length > 0) {
          this.filterFunc(moduleData[0].id);
        }
        this.loading = false;
      });
    } catch (err) {
      throw err;
    }
  }

  // 根据系统名查询模块名
  findModules (params) {
    return new Promise((resolve, reject) => {
      fetch
        .get('/sysapi/module', { params })
        .then(response => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        })
        .catch(err => {
          reject(util.bussinessException(err.response.status, err.response.data));
        });
    });
  }

  @action filterFunc = (moduleid) => {
    this.moduleid = moduleid;
    this.funcData = this.sysFuncData.filter(fd => fd.moduleId === moduleid);
  }

  @action resetTreeData = (data) => {
    this.treeData = [...data];
  }

  @action resetFuncData = (type, data) => {
    if (type === 'add') {
      // 如果是add，说明需要删掉功能
      this.sysFuncData = [...this.sysFuncData.filter(fd => fd.id !== data.funcId)];
    } else {
      const d = [...this.sysFuncData];
      const addAllFunc = (f) => {
        if (f) {
          if (!Array.isArray(f)) {
            if (f.funcId) {
              d.push({ moduleId: this.moduleid, id: f.funcId, funcName: f.menuName, funcEname: f.menuEname });
            } else if (f.children) {
              addAllFunc(f.children);
            }
          } else {
            f.forEach(e => {
              if (e.funcId) {
                d.push({ moduleId: this.moduleid, id: e.funcId, funcName: e.menuName, funcEname: e.menuEname });
              } else if (e.children) {
                addAllFunc(e.children);
              }
            });
          }
        }
      };
      addAllFunc(data);
      this.sysFuncData = [...d];
    }
    this.funcData = this.sysFuncData.filter(fd => fd.moduleId === this.moduleid);
  }

  queryNMenuFunc = (sysid) => {
    return new Promise((resolve, reject) => {
      fetch.get(`${this.url}/nfunc/${encodeURIComponent(sysid)}`).then(
        response => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        }
      ).catch(err => {
        reject(util.bussinessException(err.response.status, err.response.data));
      });
    });
  }

  @action cancelData = () => {
    this.treeData = this.treeDataOld;
    this.sysFuncData = this.sysFuncDataOld;
    this.funcData = this.sysFuncData.filter(fd => fd.moduleId === this.moduleid);
    this.inEdit = false;
  }

  // 给树形节点增加个文件夹
  @action addTreeData = (record) => {
    const { fid } = record;
    let d = [...this.treeData];
    if (!fid) {
      d.push(record);
    } else {
      findNode = false;
      let findNode = false;
      const addTData = (arr) => {
        if (findNode) {
          return arr;
        }
        const idx = arr.findIndex(a => a.id === fid);
        if (idx !== -1) {
          const { children = [] } = arr[idx];
          findNode = true;
          children.push(record);
          arr[idx].children = children;
        } else {
          arr.forEach(a => {
            if (a.children && a.children.length > 0) {
              a.children = [...addTData(a.children)];
            }
          });
        }
        return arr;
      };
      d = [...addTData(d, record)];
    }
    this.inEdit = true;
    this.treeData = [...d];
    this.editVisible = false;
  }

  @action save = async () => {
    const response = await fetch
      .put(`${this.url}/${encodeURIComponent(this.sysid)}`, this.treeData);
    if (response && response.status === 201) {
      this.treeDataOld = this.treeData;
      this.sysFuncDataOld = this.sysFuncData;
      this.inEdit = false;
      return true;
    }
  }
}

export default new MenuStore('/userapi/menu');
