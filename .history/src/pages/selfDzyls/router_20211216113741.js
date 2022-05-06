export default {
  path: 'SELF',
  name: '一体机',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'selfDzyls',
      name: '一体机',
      component: './selfDzyls/Home',
    },
    {
      path: 'list',
      name: '一体机--列表',
      component: './selfDzyls/List',
    },
    {
      path: 'detail',
      name: '一体机--详情',
      component: './selfDzyls/Detail',
    },
  ],
};
