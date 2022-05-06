const EepServe = {
  path: 'e9eep',
  name: '数据包服务管理',
  // component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'eepmb',
      name: '模版管理',
      component: './EepServe/Mbgl',
    },
    {
      path: 'eepnr',
      name: '内容管理',
      component: './EepServe/Nrgl',
    },
    {
      path: 'eepjl',
      name: '记录管理',
      component: './EepServe/Jlgl',
    },
  ],
};
export default EepServe;
