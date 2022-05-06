import Loadable from '@loadable/component';

const Registration = Loadable(() => import('./registration'));
const Filenubplan = Loadable(() => import('./filenubplan'));

export default [{
  path: '/dalydj',
  component: Registration,
},{
    path: '/filenubplan',
    component: Filenubplan,
  }
];
