export default {
  path: 'dagl',
  name: '档案管理',
  //component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'dagl',
      name: '档案管理',
      component: './dagl/Dagl/AppraisalMain',
    },
    {
      path: 'archManage/:dakid/:tmzt',
      name: '档案管理1',
      component: './dagl/Dagl/AppraisaManage/ArchTabPanel',
    },
    {
      path: 'archTabManage/:dakid/:tmzt',
      name: '档案管理1',
      component: './dagl/Dagl/AppraisaManage/ArchTabPanel',
    },
    {
      path: 'archManage/hgl/:dakid/:tmzt/:mbc',
      name: '盒管理',
      component: './dagl/Dagl/AppraisaManage/ArchPanelHgl',
    },
    {
      path: 'wjsj',
      name: '文件收集',
      component: './dagl/Dagl/AppraisalMain/wjsj',
    },
    {
      path: 'wjzl',
      name: '档案整理',
      component: './dagl/Dagl/AppraisalMain/wjzl',
    },
    {
      path: 'dayjsp',
      name: 'dayjsp',
      component: './dagl/Yjsp/index.tsx',
    },
    {
      path: 'dayjsp/:wfinst',
      name: 'dayjsp',
      component: './dagl/Yjsp/index.tsx',
    },
    {
      path: 'dagdsp',
      name: 'dagdsp',
      component: './dagl/Dagd/index.tsx',
    },
    {
      path: 'dalxjs',
      name: '离线接收',
      component: './dagl/Dalxjs/index.tsx',
    },
  ],
};
