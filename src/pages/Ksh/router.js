export default {
  path: 'ksh',
  name: '可视化',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'kshfl',
      name: '分类维护',
      component: './Ksh/Kshfl',
    },
    {
      path: 'fg',
      name: '系统维护',
      component: './Ksh/Fg',
    },
    {
      path: 'zsmk',
      name: '菜单管理',
      component: './Ksh/Zsmk',
    },
    {
      path: 'bzmk',
      name: '标准模块',
      component: './Ksh/Bzmk',
    },
    {
      path: 'zsmkbj',
      name: '模块管理',
      component: './Ksh/Zsmkbj',
    },
    {
      path: 'pbutton',
      name: '按钮',
      component: './Ksh/Pbutton',
    },
    {
      path: 'reportsz',
      name: '报表设置',
      component: './Ksh/Reportsz',
    },
    {
      path: 'gmap',
      name: '地图设置',
      component: './Ksh/Gmap',
    },
    {
      path: 'gdxm',
      name: '地图项目',
      component: './Ksh/Gdxm',
    },
    {
      path: 'gdxmstate',
      name: '地图项目状态',
      component: './Ksh/Gdxmstate',
    },
    {
      path: 'gdxmspot',
      name: '地图项目位置',
      component: './Ksh/Gdxmspot',
    },
  ],
};
