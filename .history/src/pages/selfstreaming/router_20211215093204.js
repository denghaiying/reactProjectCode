export default {
  path: 'SELF',
  name: '一体机',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'selfchanneltype',
      name: '栏目类型',
      component: './selfstreaming/Channeltype',
    },
    {
      path: 'selfchannel',
      name: '栏目管理',
      component: './selfstreaming/Channel',
    },
    {
      path: 'selfcontent',
      name: '内容管理',
      component: './selfstreaming/Content',
    }
  ],
};
