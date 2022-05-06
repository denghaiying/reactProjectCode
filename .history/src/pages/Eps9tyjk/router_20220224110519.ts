export default {
  path: 'EPS9TYJK',
  name: 'E9接口',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'eps9jkpz',
      name: '数据接口配置',
      component: './Eps9tyjk/jkpz',
    },
    {
      path: 'eps9kkdy',
      name: '库库对应设置',
      component: './Eps9tyjk/kkdy',
    },
    {
      path: 'eps9zjksj',
      name: '中间库数据',
      component: './Eps9tyjk/zjksj',
    },
    {
      path: 'eps9zlyj',
      name: '电子文件中心整理移交',
      component: './Eps9tyjk/dzwjzxyjsqdzl',
    },

    {
      path: 'eps9zlyj/:wfinst',
      name: '电子文件中心整理移交',
      component: './Eps9tyjk/dzwjzxyjsqdzl',
    },
    {
      path: 'eps9zlyjjs',
      name: '电子文件中心整理移交接收',
      component: './Eps9tyjk/Dzwjzxyjzlyjjs',
    },
    {
      path: 'eps9zljs',
      name: '电子文件中心整理接收',
      component: './Eps9tyjk/dzwjzxyjjsdzl',
    },
    {
      path: 'eps9glyj',
      name: '电子文件中心管理移交',
      component: './Eps9tyjk/dzwjzxyjsqdgl',
    },
    {
      path: 'eps9glyjjs',
      name: '电子文件中心管理移交接收',
      component: './Eps9tyjk/Dzwjzxyjglyjjs',
    },
    {
      path: 'eps9gljs',
      name: '电子文件中心管理接收',
      component: './Eps9tyjk/Dzwjzxyjjsgl',
    }
  ],
};
