export default {
  path: 'sxjc',
  name: '四性检测',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'sxjcsxsz',
      name: '四性检测四性设置',
      component: './perfortest/Sxjcsxsz',
    },
    {
      path: 'jcgz',
      name: '检测规则',
      component: './perfortest/Jcgz',
    },
    {
      path: 'jcjg',
      name: '检测结果',
      component: './perfortest/Jcjg',
    },
    {
      path: 'dzwjdj',
      name: '电子文件登记',
      component: './perfortest/Dzwjdj',
    },
    {
      path: 'jcszZsx',
      name: '四性检测-真实性',
      component: './perfortest/JcszZsx',
    },
    {
      path: 'jcszWzx',
      name: '四性检测-完整性',
      component: './perfortest/JcszWzx',
    },
    {
      path: 'jcszKkx',
      name: '四性检测-安全性',
      component: './perfortest/jcszKkx',
    },
    {
      path: 'jcszKyx',
      name: '四性检测-可用性',
      component: './perfortest/jcszKyx',
    },
  ],
};
