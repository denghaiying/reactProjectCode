const Ngbl = {
  path: 'NBGL',
  name: '内部管理',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'mtype',
      name: '物料类别维护',
      component: './Nbgl/Mtype',
    }, {
      path: 'material',
      name: '物料维护',
      component: './Nbgl/Material',
    }, {
      path: 'wldw',
      name: '往来单位维护',
      component: './Nbgl/Wldw',
    }, {
      path: 'xsht',
      name: '销售合同登记',
      component: './Nbgl/Xsht',
    },
    {
      path: 'product',
      name: '产品维护',
      component: './Nbgl/Product',
    },
    {
      path: 'module',
      name: '模块维护',
      component: './Nbgl/Module',
    }, {
      path: 'func',
      name: '功能维护',
      component: './Nbgl/Func',
    }, {
      path: 'modelinfo',
      name: '产品模型维护',
      component: './Nbgl/Modelinfo',
    },
    {
      path: 'project',
      name: '项目管理',
      component: './Nbgl/Project',
    },
    {
      path: 'xtzc',
      name: '系统注册',
      component: './Nbgl/Xtzc',
    },
  ],
};
export default Ngbl;
