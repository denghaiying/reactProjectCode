const Msdaly = {
  path: 'e9msdaly',
  name: '民生档案利用',
  //component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'cdslsq',
      name: '受理申请',
      component: './Msdaly/Cdslsq',
    },
    {
      path: 'cddcz',
      name: '待出证业务',
      component: './Msdaly/Cddcz',
    },
    {
      path: 'cddsh',
      name: '待审核业务',
      component: './Msdaly/Cddsh',
    },
    {
      path: 'cdycl',
      name: '已处理业务',
      component: './Msdaly/Cdycl',
    },
    {
      path: 'msdahome',
      name: '首页',
      component: './Msdaly/Home',
    },
  ],
};
export default Msdaly;
