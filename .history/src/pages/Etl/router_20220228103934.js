
export default {
  path: 'etl',
  name: 'Etl',
  component: '@/layouts/BaseLayout',
  routes: [
    {
      path: 'archiveinfo',
      name: '分类维护',
      component: './Etl/ArchiveInfo',
    },
    {
      path: 'archivetable',
      name: '分类维护',
      component: './Etl/ArchiveTable',
    },
    {
      path: 'frontinterface',
      name: '分类维护',
      component: './Etl/FrontInt',
    }
  ],
};
