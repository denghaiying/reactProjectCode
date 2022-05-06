export default {
  path: 'SELF',
  name: '一体机',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'selfchanneltype',
      name: '栏目类型',
      component: './Channeltype/Channeltype',
    },
    {
      path: 'selfchannel',
      name: '栏目管理',
      component: './Channel/Channel',
    },
    {
      path: 'selfcontent',
      name: '内容管理',
      component: './Content/Content',
    }
  ],
};
