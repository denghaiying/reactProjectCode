export default {
  path: 'jc',
  name: 'jc',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'stflwh',
      name: '实体分类',
      component: './base/stfl',
    },
    {
      path: 'mb',
      name: '模板管理',
      component: './base/mbgl',
    },
    {
      path: 'mbsz',
      name: '模板设置',
      component: './base/mbsz',
    },
    {
      path: 'stflmx',
      name: '实体分类明线',
      component: './base/stflmx',
    },
    {
      path: 'sjzdwh',
      name: '数据字典',
      component: './base/sjzd',
    },
    {
      path: 'sjzdmx',
      name: '数据字典明细',
      component: './base/sjzdmx',
    },
    {
      path: 'ysjsxwh',
      name: '元数据属性',
      component: './base/ysjsx',
    },
    {
      path: 'ysjlxwh',
      name: '元数据类型',
      component: './base/ysjlx',
    },
    {
      path: 'ysjwh',
      name: '元数据',
      component: './base/ysj',
    },
    {
      path: 'sjqxgz',
      name: '数据权限规则',
      component: './base/sjqxgz',
    },
    {
      path: 'sjqx',
      name: '数据权限',
      component: './base/sjqx',
    },
    {
      path: 'qwjsqx',
      name: '全文检索权限',
      component: './base/qwjsqx',
    },
    {
      path: 'dak',
      name: '档案库',
      component: './base/dak',
    },
    {
      path: 'bydak',
      name: '编研档案库',
      component: './base/byDak',
    },
    {
      path: 'esfield',
      name: 'es字段配置',
      component: './base/esFieldConf',
    },
    {
      path: 'fastDesign',
      name: '快速开发库',
      component: './base/fastDesign',
    },
    {
      path: 'ztcwh',
      name: '主题词',
      component: './base/ztc',
    },
    {
      path: 'ztcflwh',
      name: '主题词分类',
      component: './base/ztclx',
    },
    {
      path: 'dzwjzxdak',
      name: '电子文件中心档案库设置',
      component: './base/dzwjzxDak',
    },
    {
      path: 'dadzwjzx',
      name: '电子文件中心档案库',
      component: './dadzwjzx/AppraisalMain',
    },
    {
      path: 'dadzwjzxzl',
      name: '电子文件中心档案库(整理)',
      component: './dadzwjzx/AppraisalMainzl',
    },
    {
      path: 'dadzwjzxgl',
      name: '电子文件中心档案库(管理)',
      component: './dadzwjzx/AppraisalMaingl',
    },
    // {
    //   path: 'dakqx',
    //   name: '业务权限',
    //   component: './base/ywqx',
    // }
    {
      path: 'gpcwh',
      name: '高频词维护',
      component: './base/Gpcwh/index.tsx',
    },
  ],
};
