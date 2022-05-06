export default {
  path: 'lg',
  name: '长期保存',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'storeWarn',
      name: '存储预警',
      component: './LongPreservation/StoreWarn',
    },
    {
      path: 'storeInfo',
      name: '存储使用情况',
      component: './LongPreservation/StoreInfo',
    },
    {
      path: 'inspection',
      name: '巡检结果',
      component: './LongPreservation/Inspection',
    },
    {
      path: 'eepinfo',
      name: 'AIP包管理',
      component: './LongPreservation/Eepinfo',
    },
    {
      path: 'task',
      name: '调度管理',
      component: './LongPreservation/Task',
    },
    {
      path: 'dacqbc',
      name: '档案长期保存',
      component: './dacqbc/AppraisalMain',
    },
    {
      path: 'cqbcdak',
      name: '长期保存档案库',
      component: './base/cqbcDak',
    },
    {
      path: 'cqbcjkpz',
      name: '长期保存接口配置',
      component: './LongPreservation/cqbcJkpz',
    },
    {
      path: 'cqbckkdy',
      name: '长期保存库库对应',
      component: './LongPreservation/cqbckkdy',
    }, {
      path: 'cqbczjkkdy',
      name: '长期保存中间档案库',
      component: './LongPreservation/cqbcZjDak',
    },{
      path: 'cqbczjjkpz',
      name: '长期保存中间库接口配置',
      component: './LongPreservation/CqbcZjJkpz',
    },
    {
      path: 'cqbczjkkdy',
      name: '长期保存中间库库库对应',
      component: './LongPreservation/CqbcZjkkdy',
    },
  ],
};
