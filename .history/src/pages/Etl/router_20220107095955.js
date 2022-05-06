
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
      path: 'archivetable',
      component: './Etl/ArchiveTable',
    },
    {
      path: 'frontinterface',
      component: './Etl/FrontInt',
    }
  ],
};
