export default {
  path: 'dajd',
  name: '档案鉴定',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'xhjd',
      name: '档案销毁鉴定库',
      component: './dagl/Dagl/AppraisalMain/xhjd',
    },
    {
      path: 'kfjd',
      name: '档案开放鉴定',
      component: './dagl/Dagl/AppraisalMain/kfjd',
    },
    {
      path: 'hkjd',
      name: '划控鉴定',
      component: './dagl/Dagl/AppraisalMain/hkjd',
    },
    {
      path: 'mjjd',
      name: '密级鉴定',
      component: './dagl/Dagl/AppraisalMain/mjjd',
    },
    {
      path: 'dakf',
      name: '档案开放',
      component: './dagl/Dagl/AppraisalMain/dakf',
    },
    {
      path: 'daxh',
      name: '档案开放鉴定',
      component: './dagl/Dagl/AppraisalMain/daxh',
    },

    {
      path: 'kfjdsp',
      name: '开放档案鉴定审批',
      component: './Appraisal/Kfjd/AppraisaApply',
    },
    {
      path: 'hkjdsp',
      name: '开放档案鉴定审批',
      component: './Appraisal/Hkjd/AppraisaApply',
    },
    {
      path: 'xhjdsp',
      name: '销毁鉴定审批',
      component: './Appraisal/Xhjd/AppraisaApply',
    },
    {
      path: 'dakfsp',
      name: '销毁鉴定审批',
      component: './Appraisal/Dakf/AppraisaApply',
    },
    {
      path: 'daxhsp',
      name: '档案销毁审批',
      component: './Appraisal/Daxh/AppraisaApply',
    },
    {
      path: 'jdgjcwh',
      name: '鉴定关键词维护',
      component: './Appraisal/Jdgjcwh',
    },
  ],
};
