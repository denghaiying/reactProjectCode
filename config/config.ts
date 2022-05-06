import { defineConfig } from 'umi';
import proxy from './proxy';
import Workflow from '../src/pages/workflow/router';
import Dadt from '../src/pages/dadt/router';
import EepServe from '../src/pages/EepServe/router';
import Msdaly from '../src/pages/Msdaly/router';
import Perfortest from '../src/pages/perfortest/router';
import Dagsyj from '../src/pages/dagsyj/router';
import Dagl from '../src/pages/dagl/router';
import Daly from '../src/pages/daly/router';
import Datj from '../src/pages/datj/router';
import Ksh from '../src/pages/Ksh/router';
import Tyjk from '../src/pages/Tyjk/router';
import Dajd from '../src/pages/Appraisal/router';
import Dashboard from '../src/pages/dashboard/router';
import Nbgl from '../src/pages/Nbgl/router';
import Dps from '../src/pages/Dps/router';
import LongPreservation from '../src/pages/LongPreservation/router';
import Jc from '../src/pages/base/router';
import Edialog from '../src/pages/EDialog/router';
import Des from '../src/pages/des/router';
import Longt from '../src/pages/LonGt/router';
import Daby from '../src/pages/daby/router';
import Sys from '../src/pages/sys/router';
import Selfstreaming from '../src/pages/selfstreaming/router';
import SelfDzyls from '../src/pages/selfDzyls/router';
import Wdgl from '../src/pages/Wdgl/router';
import Ocr from '../src/pages/ocr/router';
import Etl from '../src/pages/Etl/router';
import Eps9tyjk from '../src/pages/Eps9tyjk/router';
import Fzps from '../src/pages/fzps/router';
import Demo from '../src/pages/demo/router';
import Wxgzh from '../src/pages/wxgzh/router';
import SelfstreamingNew from '../src/pages/selfstreamingnew/router';
import kfgl from '../src/pages/kfgl/router';
import Gwgl from '../src/pages/Gwgl/router';

// import Example from '../src/pages/example/router'
import aliyunTheme from './antd-aliyun-theme';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {
    loading: '@/components/PageLoading',
  },
  routes: [
    {
      path: 'user',
      auth: 'no',
      layout: false,
      routes: [
        {
          path: 'login',
          layout: false,
          name: 'login',
          component: './User/Login/SignupForm/loginFormD',
        },
        {
          path: 'sso',
          layout: false,
          name: 'login',
          component: './User/Login/SignupForm/sso',
        },
        {
          path: 'loginr',
          layout: false,
          name: 'loginr',
          component: './User/Login/SignupForm/loginFormR',
        },
        {
          path: 'loginms',
          layout: false,
          name: 'loginms',
          component: './User/Login/SignupForm/loginFormMS',
        },
        {
          path: 'logingsyth',
          layout: false,
          name: 'logingsyth',
          component: './User/Login/SignupForm/loginFormGSYTH',
        },
        {
          path: 'main',
          layout: false,
          name: 'main',
          component: './Main',
        },
        {
          path: 'main/:mk',
          layout: false,
          name: 'main',
          component: './Main',
        },
        {
          path: 'mainPageMenuD',
          layout: false,
          name: 'mainPageMenuD',
          component: './MainPageMenu/mainPageMenuD',
        },
      ],
    },

    {
      auth: 'no',
      path: '/',
      redirect: '/user/login',
    },
    {
      auth: 'no',
      path: '/eps/sso',
      redirect: '/user/login',
    },
    {
      auth: 'no',
      path: '/sso',
      layout: false,
      name: 'login',
      component: './User/Login/SignupForm/sso',
    },
    Workflow,
    Dadt,
    EepServe,
    Msdaly,
    Nbgl,
    Dps,
    Perfortest,
    Dagsyj,
    Dagl,
    Daly,
    Datj,
    Ksh,
    Tyjk,
    Dajd,
    Dashboard,
    LongPreservation,
    Edialog,
    Des,
    Sys,
    //  Selfstreaming,
    SelfDzyls,
    Wdgl,
    ...Ocr,
    // Etl,
    Eps9tyjk,
    Demo,
    // Example,
    Fzps,
    Wxgzh,
    kfgl,
    Gwgl,
    SelfstreamingNew,
    {
      path: '/runRfunc',
      layout: false,
      routes: [
        ...Workflow.routes,
        ...Dadt.routes,
        ...EepServe.routes,
        ...Msdaly.routes,
        ...Nbgl.routes,
        ...Dps.routes,
        ...Perfortest.routes,
        ...Dagsyj.routes,
        ...Dagl.routes,
        ...Daly.routes,
        ...Datj.routes,
        ...Ksh.routes,
        ...Tyjk.routes,
        ...Dajd.routes,
        ...Dashboard.routes,
        ...LongPreservation.routes,
        ...Edialog.routes,
        ...Jc.routes,
        ...Longt.routes,
        ...Daby.routes,
        ...Des.routes,
        ...Sys.routes,
        // ...Selfstreaming.routes,
        ...SelfDzyls.routes,
        ...Wdgl.routes,
        ...Ocr,
        ...Etl.routes,
        ...Eps9tyjk.routes,
        ...Demo.routes,
        // ...Example.routes,
        ...Fzps.routes,
        ...Wxgzh.routes,
        ...SelfstreamingNew.routes,
        ...kfgl.routes,
        ...Gwgl.routes,
      ],
    },
    {
      path: '/runWfunc',
      auth: false,
      layout: false,
      routes: [...Wxgzh.routes],
    },
  ],

  sass: {
    implementation: require('node-sass'),
    sassOptions: { file: 'index.scss' },
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  fastRefresh: {},
  mfsu: {},
  copy: [
    {
      from: './node_modules/pdfjs-dist/cmaps/',
      to: 'cmaps/',
    },
    {
      from: './node_modules/pdfjs-dist/build/pdf.worker.min.js',
      to: 'work/pdf.worker.min.js',
    },
  ],
  hash: true,
  antd: {
    compact: true, // 开启紧凑主题
  },

  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },

  theme: aliyunTheme,
  targets: {
    ie: 11,
  },
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  webpack5: {},
  exportStatic: {},
});
