import Loadable from '@loadable/component';


const Dadzwjzx = Loadable(() => import('./AppraisalMain'))
const Dadzwjzxzl = Loadable(() => import('./AppraisalMainzl'))
const Dadzwjzxgl = Loadable(() => import('./AppraisalMaingl'))
const DaglManage = Loadable(() => import('./AppraisaManage'))
export default [ {
  path: '/dadzwjzx',
  component: Dadzwjzx,
}, {
  path: '/dadzwjzxzl',
  component: Dadzwjzxzl,
},{
  path: '/dadzwjzxgl',
  component: Dadzwjzxgl,
},{
  path: '/dakry',
  component: DaglManage,
}
];
