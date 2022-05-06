const EepServe = {
  path: 'e9eep',
  name: '数据包服务管理',
  // component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'fzpskp',
      name: '方志评审开篇',
      component: './fzps/ps/kp',
    },
    {
      path: 'fzpsss',
      name: '方志评审送审',
      component: './fzps/ps/ss',
      hideInMenu:true,
    },
    {
      path: 'fzpsys',
      name: '方志评审初审',
      component: './fzps/ps/ys',
    },
    {
      path: 'fzpses',
      name: '方志评审二审',
      component: './fzps/ps/es',
    },
    {
      path: 'fzpsdg',
      name: '方志评审定稿',
      component: './fzps/ps/dg',
    },

    {
      path: 'fzpsindex',
      name: '方志评审首页',
      component: './fzps/index',
    },

  ],
};
export default EepServe;
