import Loadable from '@loadable/component';

const Home = Loadable(() => import('./Home'));
const TestSet = Loadable(() => import('./TestSet'));
const Jcjg = Loadable(() => import('./Jcjg'));
const Words = Loadable(() => import('./Words'));
const Jcsq = Loadable(() => import('./Jcsq'));

export default [
  {
    path: '/inspect001',
    component: TestSet,
  },
  {
    path: '/inspect002',
    component: Jcsq,
  },
  {
    path: '/inspect003',
    component: Jcjg,
  },
  {
    path: '/inspect004',
    component: Words,
  },
  {
    path: '/home',
    component: Home,
  },
];
