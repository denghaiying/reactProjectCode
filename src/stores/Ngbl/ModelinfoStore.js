import { makeAutoObservable, observable, action, runInAction } from "mobx";
import SysStore from '../system/SysStore';
import fetch from "../../utils/fetch";
import moment from 'moment';
/**
 * 产品模型维护
 */
class ModelinfoStore {
  constructor() {
    makeAutoObservable(this)
  }
  //产品数据源(查询部分)
  productSelectData = [];
  defalutProductname = "";
  productId = "";
  //模型数据源(查询部分)
  modelinfoSelectData = [];
  defaluModelinfoname = "";
  modelinfoId = "";
  //模型功能数据源(树形)
  modelTreeData = [];

  // 树形选中的第一节点，即模型id
  treeMxId = "";
  // 树形选中的第二节点，即模块id
  treeMkId = "";
  // 树形选中的第三节点，即功能id
  treeGnId = "";
  // 树形是否选中
  isSelect = false;

  // 右侧模型数据源
  moduleData = [];
  moduleSelectData = [];
  defalutModuleid = "";
  defalutModulename = "";
  moduleId = "";
  // 右侧功能数据源
  funcData = [];
  isShow = false;
  // 新增模块文件夹选中的单选框
  radioChecked = '';
  // 新增模块文件夹时的模块数据集合，用于不保存到表model中的数据
  addMkList = [];
  // 新增模块文件夹时的功能数据集合，用于不保存到表model中的数据
  addGnList = [];
  tempModuleId = "";
  // 导入的模块数据源
  moduleSelectImportData = [];


  selectedRowKeys = [];
  selectRowRecords = [];

  setSelectRows = async (selectRowKeys, selectRowRecords) => {
    this.selectedRowKeys = selectRowKeys;
    this.selectRowRecords = selectRowRecords;
  }
  //查询产品数据
  findProductData = async () => {
    const response = await fetch.get('/api/eps/nbgl/product/list/');
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.productSelectData = response.data.map(item => ({ 'value': item.id, 'label': item.productName }));
          this.defalutProductname = response.data[0].productName;
          this.productId = response.data[0].id;
        }
      });
    }
  }

  //查询模型数据
  findModelinfoData = async (value) => {
    const param = { params: { productId: value } };
    const response = await fetch.get('/api/eps/nbgl/modelinfo/list/', { params: param });
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.modelinfoSelectData = response.data.map(item => ({ 'value': item.id, 'label': item.modelinfoName }));
          this.defaluModelinfoname = response.data[0].modelinfoName;
          this.modelinfoId = response.data[0].id;
        } else {
          this.modelinfoSelectData = [];
        }
      });
    }
  }

  //查询模型功能数据
  findModelTreeData = async (params) => {
    const response = await fetch.get('/api/eps/nbgl/modelinfo/findModelTree', { params });
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.modelTreeData = response.data;
        }
      });
    }
  }


  setModelTreeData = async (value) => {
    this.modelTreeData = value;
  }

  setModuleSelectData = async (value) => {
    this.moduleSelectData = value;
  }
  setModuleSelectImportData = async (value) => {
    this.moduleSelectImportData = value;
  }


  setFuncData = async (value) => {
    this.isShow = true;
    this.funcData = value;
  }


  // 新增模型数据
  saveModel = async (value) => {
    value['id'] = `${Math.random()}`;
    value['whr'] = SysStore.getCurrentUser().yhmc;
    value['whrid'] = SysStore.getCurrentUser().id;
    value['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return await fetch.post('/api/eps/nbgl/modelinfo/', value);

  }

  // 删除模型功能
  deleteModel = async (value) => {
    return await fetch.delete(`/api/eps/nbgl/modelinfo/deleteModel/${encodeURIComponent(value)}`);
  }

  // 根据查询条件中的产品id查询模块数据
  findModuleData = async (value) => {
    const param = { params: { productId: value } };
    const response = await fetch.get('/api/eps/nbgl/module/list/', { params: param });
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.moduleData = response.data;
          this.moduleId = response.data[0].id;
          this.defalutModulename = response.data[0].moduleName;
          this.moduleSelectData = response.data.map(item => ({ 'value': item.id, 'label': item.moduleName, 'code': item.moduleCode }));
          this.moduleSelectImportData = response.data.map(item => ({ 'value': item.id, 'label': item.moduleName, 'code': item.moduleCode }));
        }
      });
    }
  }


  // 根据查询条件中的产品id和模块id查询功能数据
  findFuncData = async (value) => {
    const param = { params: { moduleId: value } };
    const response = await fetch.get('/api/eps/nbgl/func/list/', { params: param });
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.funcData = response.data;
        }
      });
    }
  }

  // 根据modelinfoId删除model数据
  deleteMkAndGn = async (value) => {
    return await fetch.delete(`/api/eps/nbgl/model/${encodeURIComponent(value)}`);
  }

  // 批量新增模型的模块和功能数据
  insertBatch = async (list) => {
    return await fetch.post('/api/eps/nbgl/model/insertBatch', list);
  }
}

export default new ModelinfoStore("/api/eps/nbgl/modelinfo");