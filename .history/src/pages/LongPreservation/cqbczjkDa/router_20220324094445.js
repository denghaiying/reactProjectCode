import Loadable from '@loadable/component';


const Dacqbczjk = Loadable(() => import('./AppraisalMain'))
const Dacqbczjkzl = Loadable(() => import('./AppraisalMainzl'))
const Dacqbczjkgl = Loadable(() => import('./AppraisalMaingl'))
export default [ {
  path: '/dacqbczjk',
  component: Dacqbczjk,
}, {
  path: '/dacqbczjkzl',
  component: Dacqbczjkzl,
},{
  path: '/dacqbczjkgl',
  component: Dacqbczjkgl,
}
];
