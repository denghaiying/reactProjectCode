import { observable, action, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import BaseStore from '../BaseStore';

class FuncStore extends BaseStore {
  // 功能类型
  @observable funcType = {
    F: '普通',
  };
  // 系统数据源
  @observable sysList = [];
  // 模块数据源
  @observable moduleList = [];
  // 系统下拉框选择
  @observable sysSelect = [];
  // 模块下拉框选择
  @observable moduleSelect = [];

  /** 查询系统数据 */
  @action findSysAll = async () => {
    const response = await fetch
      .get('/sysapi/sys', { params: {} });
    if (response && response.status === 200) {
      runInAction(
        () => {
          this.sysList = response.data;
        });
      this.sysSelect = this.sysList.map(item => {
        return { value: item.id, label: `${item.systemName}` };
      });
    }
  }

  /** 根据系统id查询模块数据 */
  @action findModuleAll = async (params) => {
    const response = await fetch
      .get('/sysapi/module', { params: { sysid: params } });
    if (response && response.status === 200) {
      runInAction(() => {
        this.moduleList = response.data;
      });
      this.moduleSelect = this.moduleList.map(item => {
        return { value: item.id, label: `${item.moduleName}` };
      });
    }
  }

  /** 根据系统id,模块id查询数据 */
  @action queryData = async (params) => {
    this.loading = true;
    try {
      const data = await this.findAll({ sysid: params.sysId, moduleid: params.moduleId });
      runInAction(() => {
        this.data = data;
        this.loading = false;
        this.setParams({ sysid: params.sysId, moduleid: params.moduleId });
      });
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }
  /** 初始化调用 */
  @action initData = async () => {
    Promise.all([
      this.findModuleAll(),
      this.findSysAll(),
    ]);
  }

  /** 查询数据后渲染 */
  afterQueryData (data) {
    const funcdata = [];
    data.list.forEach((v) => {
      const func = {};
      this.moduleList.forEach((module) => {
        if (v.moduleId === module.id) {
          func.moduleName = module.moduleName;
          this.sysList.forEach((sys) => {
            if (module.sysId === sys.id) {
              func.systemName = sys.systemName;
            }
          });
        }
      });
      funcdata.push({
        id: v.id,
        funcName: v.funcName,
        funcEname: v.funcEname,
        moduleId: v.moduleId,
        moduleName: func.moduleName,
        systemName: func.systemName,
        funcType: v.funcType,
        funcUrl: v.funcUrl,
        funcIndex: v.funcIndex,
      });
    });
    data.list = funcdata;
    return data;
  }
}

export default new FuncStore('/api/sysapi/func');
