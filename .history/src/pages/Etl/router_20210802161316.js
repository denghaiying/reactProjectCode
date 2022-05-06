//import React from 'react';
import Loadable from '@loadable/component';

const ArchiveInfo = Loadable(() => import('./ArchiveInfo'));
const ArchiveTask = Loadable(() => import('./ArchiveTask'));
const ArchiveTable = Loadable(() => import('./ArchiveTable/index'));
const ArchiveLog = Loadable(() => import('./ArchiveLog'));
const FrontInt = Loadable(() => import('./FrontInt'));
const FrontLog = Loadable(() => import('./FrontLog'));
//const ArchiveInfo = React.lazy(() => import('./ArchiveInfo'));
  const routerConfig = [
  {
    path: '/frontinterface',
    component: FrontInt,
  },
  {
    path: '/frontlog',
    component: FrontLog,
  },
  {
    path: '/archiveinfo',
    component: ArchiveInfo,
  },
  {
    path: '/archivetable',
    component: ArchiveTable,
  },
  {
    path: '/archivetask',
    component: ArchiveTask,
  },
  {
    path: '/archivelog',
    component: ArchiveLog,
  }
];

export default routerConfig;
