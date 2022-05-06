export default {
  path: 'daly',
  name: '档案管理',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'daly',
      name: '档案利用',
      component: './dagl/Dagl/AppraisalMain/daly',
    },
    {
      path: 'newDajy',
      name: '档案借阅(新)',
      component: './daly/dajy',
    },
    {
      path: 'newDajy/:wfinst',
      name: '档案借阅(新)',
      component: './daly/dajy',
    },
    {
      path: 'darckdj',
      name: '档案入出库登记',
      component: './daly/darckdj',
    },
    {
      path: 'darckdj/:wfinst',
      name: '档案入出库登记',
      component: './daly/darckdj',
    },
    {
      path: 'dajyc',
      name: '借阅车',
      component: './daly/jyc/cart',
    },
    {
      path: 'newdajyc',
      name: '借阅车',
      component: './daly/jyc/newcart',
    },
    {
      path: 'epsSearch',
      name: 'eps全文检索',
      component: './EpsSearch/FullSearch9',
    },
    {
      path: 'cdjl',
      name: '近义词',
      component: './daly/cdjl',
    },
    {
      path: 'newStlq',
      name: '实体领取',
      component: './daly/stlq',
    },

    {
      path: 'newStgh',
      name: '实体归还',
      component: './daly/stgh',
    },
    {
      path: 'newStrk',
      name: '实体入库',
      component: './daly/strk',
    },
    {
      path: 'newStck',
      name: '实体出库',
      component: './daly/stck',
    },
    {
      path: 'newDaxc',
      name: '档案协查',
      component: './daly/daxc9',
    },
    {
      path: 'newDaxc/:wfinst',
      name: '档案协查',
      component: './daly/daxc9',
    },
    {
      path: 'stlqghcx',
      name: '实体归还领取',
      component: './rckd/AppraisalMain',
    },
    {
      path: 'archManage/:dakid/:tmzt',
      name: '档案管理1',
      component: './dagl/Dagl/AppraisaManage/ArchPanel',
    },
    // {
    //   path: 'stcj',
    //   name: '实体催还',
    //   component: './daly/stch',
    // }
    // ,
    // {
    //   path: 'stlq',
    //   name: '实体领取',
    //   component: './daly/stlq',
    // },
    // {
    //   path: 'stgh',
    //   name: '实体归还',
    //   component: './daly/stgh',
    // },
    {
      path: 'kkjs',
      name: '跨库检索',
      component: './daly/kkjs',
    },
    {
      path: 'wdsc',
      name: '我的收藏',
      component: './daly/wdsc',
    },
    {
      path: 'ywzd',
      name: '业务指导',
      // component: './daly/ywzd',
      component: './dagl/Dagl/AppraisalMain/ywzd',
    },
    {
      path: 'dzyls',
      name: '电子阅览室',
      component: './daly/dzyls',
    },
    {
      path: 'dalysy',
      name: '利用首页',
      component: './daly/dalysy',
    },
    {
      path: 'dazd',
      name: '业务指导处理',
      component: './dagl/Dagl/AppraisalMain/dazd',
      // component: './daly/dazd',
    },
    {
      path: 'cddj',
      name: '查档登记',
      component: './daly/cddj',
    },
    {
      path: 'cdjl',
      name: '查档记录',
      component: './daly/cdjl',
    },
    {
      path: 'qwjs',
      name: '查档登记全文检索',
      component: './daly/cddj/FullSearch9',
    },
    {
      path: 'dalysysz',
      name: '利用首页设置',
      component: './daly/dalysysz',
    },
  ],
};
