export default {
  path: 'des',
  name: '检验检测',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'ipapply',
      name: '检测申请',
      component: './des/Ipapply',
    },
    {
      path: 'iptcfg',
      name: '检测设置',
      component: './des/Iptcfg',
    },
    {
      path: 'ipresult',
      name: '检测结果',
      component: './des/Ipresult',
    },
  ],
};
