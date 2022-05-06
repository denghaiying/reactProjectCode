/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * http://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/ocrplus': {
      target: 'http://192.168.3.190:5000/',
      changeOrigin: true,
      pathRewrite: { '/api': '' },
    },
    '/api/': {
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
      pathRewrite: { '/api': '' },
    },

    '/eps/control/main': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    // '/images/': {
    //   enable: true,
    //   target: 'http://192.168.3.189:8080/eps/control/main/',
    //   changeOrigin: true,
    // },
    '/eps/modal': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/sso/js': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/sso/renderLogoImg': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/sso': {
      enable: true,
      target: 'http://192.168.3.189:8000/user/login',
      changeOrigin: true,
    },
    // "/api/eps/control/main/**": {
    //   enable: true,
    //   target: "http://192.168.3.189:8080/",
    //   changeOrigin: true,
    // },
    '/eps/sso/token': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/sso/**': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/workflow/': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/xplgjgch/': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/xplgj/': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/api/xsxjc/': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },

    '/api/eps/control/main/xt/**': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/selfservice/*': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/ksh': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/ksh/*': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/streamingapi': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/sysapi': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/readcard/**': {
      enable: true,
      target: 'http://192.168.3.189:8989/',
      changeOrigin: true,
      pathRewrite: {
        '/readcard': '',
      },
    },
    '/eps/dsrw': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/tyjk': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/api/eps/lg': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/kfgl/': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/portal': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    // '/sso': {
    //   enable: true,
    //   target: 'http://192.168.3.189:8080',
    //   changeOrigin: true,
    // },
    // "/": {
    //   enable: true,
    //   target: "http://192.168.3.189:8080/",
    //   changeOrigin: true,
    // },
    '/eps/xnkf/': {
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/dars/': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/dams/': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/wdgl/': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/self/*': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/api/sxjcjgz': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/ndjh': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/api/eps/control/main/gszxyjcx/*': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/api/eps/control/main/gsyjsqd/*': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/api/eps/control/main/gsyjjssqd/*': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps9/tyjk/api/data/*': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps9tyjk/*': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/lg/*': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
    '/eps/control/main/gncp/*': {
      enable: true,
      target: 'http://192.168.3.189:8080/',
      changeOrigin: true,
    },
  },
  test: {
    '/api/': {
      target: 'http://192.168.3.189:8080',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
