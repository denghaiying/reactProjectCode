export default {
  path: 'dashboard',
  name: '首页',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'Rgjhome',
      component: './dashboard/Rgjhome',
    },
    {
      path: 'newRgjhome',
      component: './dashboard/newRgjhome',
    },
    {
      path: 'newHome',
      component: './dashboard/newHome',
    }
  ],
};
