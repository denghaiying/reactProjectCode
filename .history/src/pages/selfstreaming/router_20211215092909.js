export default {
  path: 'ksh',
  name: '可视化',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'selfchanneltype',
      name: '分类维护',
      component: './Channeltype/Channeltype',
    },
    {
      path: 'selfchannel',
      name: '系统维护',
      component: './Channel/Channel',
    },
    {
      path: 'selfcontent',
      name: '菜单管理',
      component: './Content/Content',
    }
  ],
};
