export default {
  path: 'longt',
  name: '格式转换',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'longt',
      name: '格式转换',
      component: './Longt/Longt',
    },
    {
      path: 'cqbcwjzc',
      name: '文件注册',
      component: './Longt/Cqbcwjzc',
    },
    {
      path: 'cqbcwjzh',
      name: '文件转换',
      component: './Longt/Cqbcwjzh',
    },
    {
      path: 'cqbcwjzhlog',
      name: '转换日志',
      component: './Longt/CqbcwjzhLog',
    },
    {
      path: 'cqwjzhvideo',
      name: '视频转换配置',
      component: './Longt/CqwjzhVideo',
    },
  ],
};
