
const Dps = {

  path: 'dps',
  name: '数字化加工',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'ywlc',
      name: '工作内容',
      component: './Dps/Ywlc',
    },
    {
      path: 'jglc',
      name: '加工流程',
      component: './Dps/Jglc',
    },
    {
      path: 'dpsroject',
      name: '项目管理',
      component: './Dps/Project',
    },
    {
      path: 'nlsz',
      name: '年历设置',
      component: './Dps/Encalr',
    },
    {
      path: 'kqsz',
      name: '考勤设置',
      component: './Dps/Kqsz',
    },
    {
      path: 'dkjl',
      name: '打卡记录',
      component: './Dps/Dkjl',
    },
    {
      path: 'wclx',
      name: '外出类型',
      component: './Dps/Wclx',
    },
    {
      path: 'wcgl',
      name: '外出管理',
      component: './Dps/Wcgl',
    },
    {
      path: 'zrgl',
      name: '值日管理',
      component: './Dps/Zrgl',
    },
    {
      path: 'xmzwh',
      name: '项目组维护',
      component: './Dps/Xmzwh',
    },
    {
      path: 'xmzcywh',
      name: '项目组成员维护',
      component: './Dps/Xmzcywh',
    }, {
      path: 'gzlgl',
      name: '工作量管理',
      component: './Dps/Gzlgl',
    },
    {
      path: 'gzwtdj',
      name: '工作问题登记',
      component: './Dps/Gzwtdj',
    },
    {
      path: 'details',
      name: '问答详情',
      component: './Dps/Gzwtdj/Details',

    },
    {
      path: 'clgl',
      name: '产量管理',
      component: './Dps/Clgl'
    },
    {
      path: 'taskgl',
      name: '生产任务管理',
      component: './Dps/Taskgl',
    },
    {
      path: 'kpirule',
      name: '绩效计算规则定义',
      component: './Dps/Kpirule',
    },
    {
      path: 'monkpimng',
      name: '绩效管理',
      component: './Dps/Monkpimng',
    },
    {
      path: 'wkldsjtj',
      name: '工作量统计',
      component: './Dps/Wkldsjtj',
    },
    {
      path: 'yieldsjtj',
      name: '产量统计',
      component: './Dps/Yieldsjtj',
    },
    {
      path: 'dpsindex',
      name: '首页',
      component: './Dps/Index',
    },
  ],

}
export default Dps;