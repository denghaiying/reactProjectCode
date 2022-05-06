export default {
  path: 'tyjk',
  name: '通用接口',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'zjk',
      name: '中间库配置',
      component: './Tyjk/zjk',
    },
    {
      path: 'jkpz',
      name: '数据接口配置',
      component: './Tyjk/jkpz',
    },
    {
      path: 'kkdy',
      name: '库库对应关系',
      component: './Tyjk/kkdy',
    },
    {
      path: 'zjksj',
      name: '中间库数据',
      component: './Tyjk/zjksj',
    },
    {
      path: 'dddl',
      name: '单点登录配置',
      component: './Tyjk/dddl',
    },
    {
      path: 'tyjk',
      name: '通用接口数据情况',
      component: './Tyjk/tyjk',
    },
    {
      path: 'sjcj',
      name: '数据采集',
      component: './Tyjk/sjcj',
    },
  ],
};
