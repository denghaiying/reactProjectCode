import { observable, action, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import BaseStore from '../BaseStore';

class ModuleStore extends BaseStore {
  @observable moduleType = {
    A: '平台',
    B: '业务',
  };
  @observable sysList = [];
  @observable searchRecord = {
    sysId: '',
  };

  @action findSysAll = async () => {
    const response = await fetch
      .get('/sysapi/sys', { params: {} });
    if (response && response.status === 200) {
      runInAction(() => {
        this.sysList = response.data;
      });
    }
  }
  @action queryData = async (params) => {
    this.loading = true;
    try {
      const data = await this.findAll({ sysid: params.sysId });
      runInAction(() => {
        this.data = data;
        this.loading = false;
        this.setParams({ sysid: params.sysId });
      });
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }
  afterQueryData (data) {
    const moduledata = [];
    data.list.forEach((v) => {
      const mo = {};
      this.sysList.forEach((sys) => {
        if (v.sysId === sys.id) {
          mo.systemName = sys.systemName;
        }
      });
      moduledata.push({
        id: v.id,
        moduleName: v.moduleName,
        moduleEname: v.moduleEname,
        sysId: v.sysId,
        systemName: mo.systemName,
        moduleType: v.moduleType,
        moduleUrl: v.moduleUrl,
        moduleIndex: v.moduleIndex,
      });
    });
    data.list = moduledata;
    return data;
  }
}

export default new ModuleStore('/api/sysapi/module');
