export default {
  path: 'wdgl',
  name: '文档管理',
  routes: [
    {
      path: 'ftphttp',
      name: '服务配置',
      component: './Wdgl/FtpHttp',
    },
    {
      path: 'doctype',
      name: '文档分类',
      component: './Wdgl/DocType',
    },
    {
      path: 'docext',
      name: '文档类型',
      component: './Wdgl/DocExt',
    },
],
};
