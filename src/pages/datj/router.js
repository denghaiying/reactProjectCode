export default {
  path: 'datj',
  name: '档案统计',
  //component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'dacltj',
      name: '档案存量统计',
      component: './datj/Dacltj/index.js',
      // }, {
      //   path: 'dalbfltj',
      //   name: '分类统计',
      //   component: './datj/Dalbfltj/index.js',
    },
    {
      path: 'wsdtj',
      name: '温湿度统计',
      component: './datj/Wsdtj/index.js',
    },

    {
      path: 'dalytj',
      name: '借阅统计',
      component: './datj/Dalytj/index.js',
    },
    {
      path: 'dagdgzcltj',
      name: '归档统计',
      component: './datj/Dagdgzcltj/index.js',
    },
    {
      path: 'datjsj',
      name: '统计设计',
      component: './datj/Datjsj/index.js',
      //    component:'/api/eps/datj/dabzqtj/dabzqtj.html'
      // }, {
      //   path: 'dabzqtj',
      //   name: '保管期统计',
      //   component: './datj/Dabzqtj/index.js',
    },
    {
      path: 'gzltj',
      name: '工作量统计',
      component: './datj/Gzltj/index.js',
    },
    {
      path: 'kfaqtj',
      name: '库房安全统计',
      component: './datj/Kfaqtj/index.js',
    },
    {
      path: 'datjzs',
      name: '',
      component: './datj/Datjzs/index.jsx',
    },
    {
      path: 'dajdtj',
      name: '档案鉴定情况',
      component: './datj/Dajdqktj/index.js',
    },
    {
      path: 'lydjdttj',
      name: '查档统计',
      component: './datj/Lydjdttj/index.js',
    },
    {
      path: 'holdinggroup',
      name: '馆藏档案统计分组',
      component: './datj/Holdinggroup/index.js',
    },
    {
      path: 'holdingstati',
      name: '馆藏档案统计',
      component: './datj/Holdingstati/index.js',
    },
    {
      path: 'accessusertj',
      name: '',
      component: './datj/Accessusetj/index.js',
    },
    {
      path: 'kfjdtj',
      name: '开放鉴定统计',
      component: './datj/Kfjdtj/index.js',
    },
    {
      path: 'hkjdtj',
      name: '划控鉴定统计',
      component: './datj/Hkjdtj/index.js',
    },
    {
      path: 'xhjdtj',
      name: '销毁鉴定统计',
      component: './datj/Xhjdtj/index.js',
    },
    {
      path: 'zxjstj',
      name: '在线接收统计',
      component: './datj/Zxjstj/index.jsx',
    },
    {
      path: 'lxjstj',
      name: '离线接收统计',
      component: './datj/Lxjstj/index.jsx',
    },
    {
      path: 'dalydjntj',
      name: '查档登记统计',
      component: './datj/Dalydjntj/index.js',
    },
    {
      path: 'dalycrktj',
      name: '出入库统计',
      component: './datj/Crktj/index.jsx',
    },
    {
      path: 'crkdjmx',
      name: '出入库登记明细查询',
      component: './datj/Crktjmx/index.jsx',
    },
    {
      path: 'ajfltj',
      name: '案卷分类统计',
      component: './datj/Ajfltj/index.jsx',
    },
    {
      path: 'zbhttz',
      name: '总部合同台账',
      component: './datj/Zbhttz/index.jsx',
    },
    {
      path: 'htyjwjtz',
      name: '合同应交未交台账',
      component: './datj/Htyjwjtz/index.jsx',
    },
  ],
};
