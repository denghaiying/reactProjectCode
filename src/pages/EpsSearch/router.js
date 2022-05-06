import Loadable from '@loadable/component';

const epsSearchRouter = Loadable(() => import('./FullSearch9'));

export default [
  {
  path: '/epsSearch',
  component: epsSearchRouter,
}
];