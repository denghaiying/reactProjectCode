export default {
  path: 'SELF',
  name: '电子阅览室',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'selfDzyls',
      name: '电子阅览室',
      component: './selfDzyls/Home',
    },
    {
      path: 'list',
      name: '电子阅览室--列表',
      component: './selfDzyls/List',
    },
    {
      path: 'detail',
      name: '电子阅览室--详情',
      component: './selfDzyls/Detail',
    },
  ],
};
