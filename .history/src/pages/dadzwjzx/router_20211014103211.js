import Loadable from '@loadable/component';


const Dacqbc = Loadable(() => import('./AppraisalMain'))
const DaglManage = Loadable(() => import('./AppraisaManage'))
export default [ {
  path: '/dacqbc',
  component: Dagl,
}, {
  path: '/dakry',
  component: DaglManage,
}
];
