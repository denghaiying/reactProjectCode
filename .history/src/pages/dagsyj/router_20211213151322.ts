export default {
  path: 'dagsyj',
  name: '馆室移交',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'gsyjsy',
      name: '馆室移交首页',
      component: './dagsyj/Dagsyjsy',
    },
    {
      path: 'gsyjjs',
      name: '馆室移交接收',
      component: './dagsyj/Gszxyjcx',
    },
    {
      path: 'gsyjsq',
      name: '馆室移交审批',
      component: './dagsyj/Jgyjsp',
    }, {
      path: 'dajscreenLeft',
      name: '馆室移交审批',
      component: './dagsyj/Dajs',
    },
  ],
};
