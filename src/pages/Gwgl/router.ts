const GWGL = {
  path: 'gwgl',
  name: '公文管理',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'gwzx',
      name: '公文中心',
      component: './Gwgl/Gwzx',
    },
    {
      path: 'gwtj',
      name: '公文统计',
      component: './Gwgl/Gwtj',
    },
    {
      path: 'gwfw',
      name: '发文',
      component: './Gwgl/Gwfw',
    },
    {
      path: 'gwfw/form',
      name: '发文表单',
      component: './Gwgl/Gwzx/Fw',
    },
    {
      path: 'gwfw/form/:wfinst',
      name: '发文表单',
      component: './Gwgl/Gwzx/Fw',
    },
    {
      path: 'gwsw',
      name: '收文',
      component: './Gwgl/Gwsw',
    },
    {
      path: 'gwsw/form',
      name: '收文表单',
      component: './Gwgl/Gwzx/Sw',
    },
    {
      path: 'gwsw/form/:wfinst',
      name: '收文表单',
      component: './Gwgl/Gwzx/Sw',
    },
    {
      path: 'gwgldoctype',
      name: '公文种类',
      component: './Gwgl/Doctype',
    },
  ],
};
export default GWGL;
