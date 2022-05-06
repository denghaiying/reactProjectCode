export default {
  path: 'SELF',
  name: '一体机',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'selfchanneltype',
      name: '栏目类型',
      component: './selfstreamingnew/Channeltype',
    },
    {
      path: 'selfchannel',
      name: '栏目管理',
      component: './selfstreamingnew/Channel',
    },
    {
      path: 'selfcontent',
      name: '内容管理',
      component: './selfstreamingnew/Content',
    },
    {
      path: 'selfopinion',
      name: '意见管理',
      component: './selfstreamingnew/Opinion',
    },
  ],
};
