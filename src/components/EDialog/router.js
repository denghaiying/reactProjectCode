import Loadable from '@loadable/component';

const EDialog = Loadable(() => import('./EDialog'));

export default [{
  path: '/edialog',
  component: EDialog,
}
];
