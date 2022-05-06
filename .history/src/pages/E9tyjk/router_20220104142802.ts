export default {
  path: 'E9TYJK',
  name: 'E9接口',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'jkpz',
      name: '数据接口配置',
      component: './E9tyj/jkpz',
    },
    {
      path: 'kkdy',
      name: '库库对应关系',
      component: './E9tyj/kkdy',
    },
    {
      path: 'zjksj',
      name: '中间库数据',
      component: './E9tyj/zjksj',
    },
  ],
};
