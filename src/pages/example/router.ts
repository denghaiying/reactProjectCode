const Example = {
  path: 'example',
  name: 'example',
  //component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'example',
      name: '',
      component: './example/BaseInfo',
    },
    {
      path: 'danb',
      name: '档案年报',
      component: './example/Danb',
    },
    {
      path: 'dj3b',
      name: '登记3表',
      component: './example/Dj3b',
    },
    {
      path: 'dbsw',
      name: '待办事务',
      component: './example/Schedule',
    },
  ],
};

export default Example;
