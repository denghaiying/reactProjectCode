export default {
  path: 'daapp',
  name: '微信公众号',
  routes: [
    {
      path: 'archivesintro',
      name: '',
      component: './wxgzh/archivesIntro',
    },
    {
      path: 'archivesguide',
      name: '文档分类',
      component: './wxgzh/archivesGuide',
    },
    {
      path: 'archivesmessage',
      name: '文档类型',
      component: './wxgzh/message',
    },
    {
      path: 'messagedetail',
      name: '文档类型',
      component: './wxgzh/message/detail',
    },
    {
      path: 'notice',
      name: '文档类型',
      component: './wxgzh/notice',
    },
    {
      path: 'contact',
      name: '文档类型',
      component: './wxgzh/contact',
    },
    {
      path: 'projectdisplay',
      name: '文档类型',
      component: './wxgzh/projectDisplay',
    },
    {
      path: 'displaydetail',
      name: '文档类型',
      component: './wxgzh/projectDisplay/detail',
    },
    {
      path: 'apply',
      name: '文档类型',
      component: './wxgzh/apply',
    },
    {
      path: 'livesearch',
      name: '文档类型',
      component: './wxgzh/liveSearch',
    },
    {
      path: 'opensearch',
      name: '文档类型',
      component: './wxgzh/openSearch',
    },
    {
      path: 'searchdetail',
      name: '文档类型',
      component: './wxgzh/searchDetail',
    },
    {
      path: 'archivesrule',
      name: '文档类型',
      component: './wxgzh/rule',
    },
    {
      path: 'hnny-login',
      layout: false,
      name: 'hnny-login',
      component: './User/Login/SignupForm/hnnySso',
    },
    {
      path: 'hnny-code',
      layout: false,
      name: 'hnny-code',
      component: './User/Login/SignupForm/hnnySso',
    },
],
};
