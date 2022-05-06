
import Loadable from '@loadable/component';
const Srv = Loadable(() => import('./Srv'));
const Dochome = Loadable(() => import('./Dochome'));

export default [{
  path: '/doccenter/srv',
  component: Srv,
},
{
  path: '/doccenter',
  component: Dochome,
},
];
