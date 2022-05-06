// export default {
//   path: 'OCR',
//   name: '一体机',
//   component: '@/layouts/BaseLayout',
//   routes: [
//     {
//       path: 'tpocr',
//       name: '业务指导处理',
//       component: './ocr/demo',
//       // component: './daly/dazd',
//     },
//   ],
// };
export default [{
  path: '/eps/ocrplus',
  name: '资源管理',
  // component: '@/pages/ocr',
  routes: [
    {
      path: 'list',
      name: '资源管理',
      component: './ocr/cls/list',
    },
    {
      path: 'search',
      name: '资源检索',
      component: './ocr/cls/search'
    },
  ],
}, {
  path: '/eps/ocr',
  name: '图片识别',
  component: '@/pages/ocr/demo',
}]