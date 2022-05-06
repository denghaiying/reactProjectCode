import Loadable from '@loadable/component';


const Dadzwjzx = Loadable(() => import('./AppraisalMain'))
const DaglManage = Loadable(() => import('./AppraisaManage'))
export default [ {
  path: '/dadzwjzx',
  component: Dadzwjzx,
}, {
  path: '/dakry',
  component: DaglManage,
}
];
