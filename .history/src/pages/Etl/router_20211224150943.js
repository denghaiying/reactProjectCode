
export default {
  path: 'etl',
  name: 'Etl',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'archiveinfo',
      component: './Etl/ArchiveInfo',
    },
    {
      path: 'archivetask',
      component: './Etl/ArchiveTask',
    },
    {
      path: 'archivetable',
      component: './Etl/ArchiveTable',
    },
    {
      path: 'archivelog',
      component: './Etl/ArchiveLog',
    },
    {
      path: 'frontinterface',
      component: './Etl/FrontInt',
    },
    {
      path: 'frontlog',
      component: './Etl/FrontLog/index.js',
    }
  ],
};
