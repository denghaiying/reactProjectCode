export default {
  path: 'kfgl',
  name: '库房管理',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'hgl',
      name: '盒管理',
      component: './kfgl/hgl',
    },
    {
      path: 'kfaqdj',
      name: '库房安全登记',
      component: './kfgl/kfaqdj',
    },
    {
      path: 'kfwh',
      name: '库房维护',
      component: './kfgl/kfwh',
    },
    {
      path: 'mjjl',
      name: '密集架列',
      component: './Ksh/mjjl',
    },
    {
      path: 'mjjz',
      name: '密集架组',
      component: './Ksh/mjjz',
    },
    {
      path: 'mjjgz',
      name: '密集架格子',
      component: './Ksh/mjjgz',
    },
    {
      path: 'task',
      name: '温湿度登记',
      component: './Ksh/wsddj',
    }
  ],
};
