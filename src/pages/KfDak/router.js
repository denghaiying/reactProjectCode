import Loadable from '@loadable/component';

const kfdacx = Loadable(() => import('./kfdacx'));

export default [
  {
  path: '/kfdacx',
  component: kfdacx,
}
];