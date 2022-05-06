const Workflow = {
  path: 'wflw',
  name: 'wflw',
  //component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'flwedit/:id?',
      name: '图形化配置',
      component: './workflow/Flwedit',
    },
    {
      path: 'wfsrv',
      name: '业务配置',
      component: './workflow/Wfsrv',
    },
    {
      path: 'wfdef/:id?',
      name: '流程配置',
      component: './workflow/Wfdef',
    },
    {
      path: 'wfparam/:id?',
      name: '流程参数',
      component: './workflow/Wfparam',
    },
    {
      path: 'dbsw',
      name: '待办',
      component: './workflow/Dbsw',
    },
    {
      path: 'lcfz',
      name: '流程分组',
      component: './workflow/Lcfz',
    },
  ],
};

export default Workflow;
