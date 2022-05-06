export default {
  path: 'control/main',
  name: '控制中心',
  //component: '@/layouts/BaseLayout',
  routes: [
    // {
    //     path: 'sysuser/plateform',
    //     name: '平台',
    //     component:'./sys/Ptinfo',
    //   },
    {
      path: 'yh',
      name: '用户管理',
      component: './sys/yh/index.tsx',
    },
    {
      path: 'sjzyh',
      name: '用户管理',
      component: './sys/sjzyh/index.tsx',
    },
    //   {
    //     path: 'sysuser/system',
    //     name: '系统',
    //     component:'./sys/System',
    //   },
    {
      path: 'role',
      name: '角色管理',
      component: './sys/role/index.tsx',
    },
    {
      path: 'sjzrole',
      name: '角色管理',
      component: './sys/sjzrole/index.tsx',
    },
    {
      path: 'ywsjz',
      name: '业务数据组',
      component: './sys/ywsjz/index.tsx',
    },
    {
      path: 'sysuser/org',
      name: '组织机构管理',
      component: './sys/org/index.tsx',
    },
    {
      path: 'sysuser/menu',
      name: '菜单管理',
      component: './sys/Menumanage',
    },
    {
      path: 'sysuser/optright',
      name: '',
      component: './sys/Optright',
    },
    {
      path: 'sysuser/module',
      name: '模板管理',
      component: './sys/Module',
    },
    {
      path: 'sysuser/func',
      name: '功能管理',
      component: './sys/Func',
    },
    {
      path: 'sysuser',
      name: '系统用户',
      component: './sys/Index',
    },
    {
      path: 'org',
      name: '组织机构管理',
      component: './sys/org/index.tsx',
    },
    {
      path: 'dw',
      name: '单位管理',
      component: './sys/dw/index.tsx',
    },
    {
      path: 'gn',
      name: '功能管理',
      component: './sys/Gn/index.tsx',
    },
    {
      path: 'mk',
      name: '模块管理',
      component: './sys/Mk/index.tsx',
    },
    {
      path: 'orglx',
      name: '组织结构类型管理',
      component: './sys/OrgLx/index.tsx',
    },
    {
      path: 'log',
      name: '运行日志管理',
      component: './sys/RunningLog/index.tsx',
    },
    {
      path: 'params',
      name: '参数管理',
      component: './sys/ParamsManage/index.tsx',
    },
    {
      path: 'sysmodel',
      name: '系统模块管理',
      component: './sys/OrgModel',
    },
    {
      path: 'ipAddresses',
      name: '地址管理',
      component: './sys/IpAddresses/index.tsx',
    },
    {
      path: 'yhuppwd',
      name: '用户修改密码',
      component: './sys/yh/yhUpPwd.tsx',
    },
    {
      path: 'yhpldr',
      name: '用户批量倒入',
      component: './sys/yh/pldr.tsx',
    },
    {
      path: 'qx',
      name: '权限管理',
      component: './sys/Qxgl',
    },
    {
      path: 'fulltextconf',
      name: '全文检索配置',
      component: './sys/FulltextConf',
    },
    {
      path: 'dsrw',
      name: '定时任务管理',
      component: './sys/Dsrw',
    },
    {
      path: 'xt',
      name: '系統信息',
      component: './sys/xt',
    },
  ],
};
