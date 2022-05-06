// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.UMI_ENV': 'prod',
  },
  extraBabelPlugins: ['transform-remove-console', 'transform-remove-debugger']
});
