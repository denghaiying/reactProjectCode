export default {
  path: 'EPS9TYJK',
  name: 'E9接口',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'eps9jkpz',
      name: '数据接口配置',
      component: './E9tyj/jkpz',
    },
    {
      path: 'eps9kkdy',
      name: '库库对应关系',
      component: './E9tyj/kkdy',
    },
    {
      path: 'eps9zjksj',
      name: '中间库数据',
      component: './E9tyj/zjksj',
    },
  ],
};
