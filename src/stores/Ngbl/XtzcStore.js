import { makeAutoObservable, observable, action, runInAction } from 'mobx';
import SysStore from '../system/SysStore';
import fetch from '../../utils/fetch';
import moment from 'moment';
import { message } from 'antd';

class XtzcStore {
  constructor() {
    makeAutoObservable(this);
  }

  // 新增系统注册页面是否可见
  isVisible = false;
  //主页面table表格数据源
  tableList = [];
  // 当前页数
  page = 1;
  //展示条数
  size = 50;
  defalutsize = 50;
  //数据总数
  total = 0;
  params = {};
  // 删除时的参数系统注册id
  xtzcId = '';
  // 往来单位为客户的数据源
  khData = [];
  // 项目数据源
  xmData = [];
  //所有部门数据源
  bmData = [];
  //所有单位数据源
  dwData = [];
  sqrbm = '';
  sqrdw = '';
  // 新增时暂存表单数据
  formTempData = {};
  //产品数据源
  productSelectData = [];
  productData = [];
  //模型数据源
  modelinfoSelectData = [];
  modelinfoData = [];
  // 第三步需要的产品id
  productId = '';
  // 第三步需要的模型id
  modelinfoId = '';
  xtzcData = [];
  // 编辑时表单回显值
  formData = {};
  //模型功能数据源(树形)
  modelTreeData = [];
  // 右侧模型数据源
  moduleData = [];
  moduleSelectData = [];
  defalutModuleid = '';
  defalutModulename = '';
  moduleId = '';

  // 右侧功能数据源
  funcData = [];
  isShow = false;
  // 导入的模块数据源
  moduleSelectImportData = [];
  // 新增模块文件夹选中的单选框
  radioChecked = '';
  // 树形选中的第一节点，即模型id
  treeMxId = '';
  // 树形选中的第二节点，即模块id
  treeMkId = '';
  // 树形选中的第三节点，即功能id
  treeGnId = '';
  // 树形是否选中
  isSelect = false;
  // 操作按钮类型
  opt = '';
  //控制表单不可编辑(包括第三步功能按钮)
  isFormEdit = false;

  wfinst = [];
  //主页表中已选择行
  tableChecedkRow = [];
  setTableCheckedRow = async (rows) => {
    this.tableCheckedRow = rows;
  };

  // 第三步右侧功能表格选择框
  selectedRowKeys = [];
  selectRowRecords = [];

  setSelectRows = async (selectRowKeys, selectRowRecords) => {
    this.selectedRowKeys = selectRowKeys;
    this.selectRowRecords = selectRowRecords;
  };

  //控制新增页面是否展示
  setIsvisible = (value) => {
    this.isVisible = value;
  };

  // 关闭新增页面
  closeXtzcEditForm = () => {
    this.isVisible = false;
  };

  setPagesizeChage = (page, size) => {
    this.page = page;
    this.size = size;
  };

  //分页查询主页面表格数据
  findForPage = async (page, size, params) => {
    const response = await fetch.get('/api/eps/nbgl/xtzc/', {
      page,
      size,
      params,
    });
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.list.length > 0) {
          this.tableList = response.data.list;
          this.total = response.data.total;
          this.page = page;
          this.size = size;
          this.params = params;
        } else {
          this.tableList = [];
        }
      });
    }
  };

  //根据参数查询系统注册数据
  findXtzcData = async (params) => {
    const response = await fetch.get('/api/eps/nbgl/xtzc/list/', {
      params: params,
    });
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.xtzcData = response.data;
        }
      });
    }
  };
  // 查询客户数据
  findKhData = async (params) => {
    return await fetch.get('/api/eps/nbgl/wldw/list/', { params:{ params: params } });
  };

  // 查询项目数据
  findProjectData = async (params) => {
    return await fetch.get('/api/eps/nbgl/project/list/', { params:{ params: params } });
  };
  // 查询所有部门列表
  findBm = async () => {
    const response = await fetch.get(
      '/api/eps/control/main/org/queryForList',
      {},
    );
    if (response && response.status === 200) {
      runInAction(() => {
        this.bmData = response.data;
      });
    }
  };
  // 查询所有单位列表
  findDw = async () => {
    const response = await fetch.get(
      '/api/eps/control/main/dw/queryForList',
      {},
    );
    if (response && response.status === 200) {
      runInAction(() => {
        this.dwData = response.data;
      });
    }
  };
  //查询产品数据
  findProductData = async () => {
    const response = await fetch.get('/api/eps/nbgl/product/list/');
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.productData = response.data;
          this.productSelectData = response.data.map((item) => ({
            value: item.id,
            label: item.productName,
          }));
        }
      });
    }
  };

  //查询模型数据
  findModelinfoData = async (value) => {
    const param = { params: { productId: value } };
    const response = await fetch.get('/api/eps/nbgl/modelinfo/list/', {
      params: param,
    });
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.modelinfoData = response.data;
          this.modelinfoSelectData = response.data.map((item) => ({
            value: item.id,
            label: item.modelinfoName,
          }));
        } else {
          this.modelinfoSelectData = [];
        }
      });
    }
  };

  //查询模型功能数据(第三步树形,新增时查询模型表中的默认数据)
  findModelTreeData = async (params) => {
    const response = await fetch.get('/api/eps/nbgl/modelinfo/findModelTree', {
      params,
    });
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.modelTreeData = response.data;
        }
      });
    }
  };

  // 根据查询条件中的产品id查询模块数据
  findModuleData = async (value) => {
    const param = { params: { productId: value } };
    const response = await fetch.get('/api/eps/nbgl/module/list/', {
      params: param,
    });
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.moduleData = response.data;
          this.moduleId = response.data[0].id;
          this.defalutModulename = response.data[0].moduleName;
          this.moduleSelectData = response.data.map((item) => ({
            value: item.id,
            label: item.moduleName,
            code: item.moduleCode,
          }));
          this.moduleSelectImportData = response.data.map((item) => ({
            value: item.id,
            label: item.moduleName,
            code: item.moduleCode,
          }));
        }
      });
    }
  };
  // 根据查询条件中的产品id和模块id查询功能数据
  findFuncData = async (value) => {
    const param = { params: { moduleId: value } };
    const response = await fetch.get('/api/eps/nbgl/func/list/', {
      params: param,
    });
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.funcData = response.data;
        }
      });
    }
  };

  setModelTreeData = async (value) => {
    this.modelTreeData = value;
  };

  setModuleSelectData = async (value) => {
    this.moduleSelectData = value;
  };
  setModuleSelectImportData = async (value) => {
    this.moduleSelectImportData = value;
  };

  setFuncData = async (value) => {
    this.isShow = true;
    this.funcData = value;
  };

  // 保存每一步骤的数据
  saveFormData = async (values) => {
    const { ...v } = this.formTempData;
    this.formTempData = { ...v, ...values };
  };

  creatXtzccode() {
    let code = '';
    // 设置长度，这里看需求，我这里设置了4
    const codeLength = 4;
    // 设置随机字符
    const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 循环codeLength 我设置的4就是循环4次
    for (let i = 0; i < codeLength; i++) {
      // 设置随机数范围,这设置为0 ~ 36
      const index = Math.floor(Math.random() * 9);
      // 字符串拼接 将每次随机的字符 进行拼接
      code += random[index];
    }
    return `${moment().format('YYYYMM')}${code}`;
  }
  // 新增保存系统注册数据
  saveXtzc = async (data) => {
    data['id'] = `${Math.random()}`;
    data['xtzcCode'] = this.creatXtzccode();
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    data['whrid'] = SysStore.getCurrentUser().id;
    return await fetch.post('/api/eps/nbgl/xtzc/savedata', data);
  };
  // 修改系统注册主表数据
  updateXtzc = async (data, xtzcId) => {
    data['id'] = xtzcId;
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    data['whrid'] = SysStore.getCurrentUser().id;
    return await fetch.put(
      `/api/eps/nbgl/xtzc/${encodeURIComponent(xtzcId)}`,
      data,
    );
  };

  // 批量新增系统注册明细数据
  insertBatch = async (list) => {
    return await fetch.post('/api/eps/nbgl/xtzcmx/insertBatch', list);
  };

  // 删除系统注册数据及明细表数据
  deleteXtzc = async (data) => {
    return await fetch.delete(
      `/api/eps/nbgl/xtzc/deleteXtzc/${encodeURIComponent(data)}`,
    );
  };

  //查询系统注册明细xtzcmx表数据(第三步树形,编辑和浏览根据xtzcId、productId、modelinfoId查询)
  findXtzcmxTree = async (params) => {
    const response = await fetch.get('/api/eps/nbgl/xtzcmx/findXtzcmxTree', {
      params,
    });
    if (response && response.status === 200) {
      runInAction(() => {
        if (response.data.length > 0) {
          this.modelTreeData = response.data;
        }
      });
    }
  };
  //附件分组id
  xtzcFilegrpid;
  getFileGrpid = async () => {
    let url = '/api/eps/wdgl/attachdoc/getGuid';
    const response = await fetch.get(url, {});
    this.xtzcFilegrpid = response.data.message;
  };


}

export default new XtzcStore('/api/eps/nbgl/xtzc');
