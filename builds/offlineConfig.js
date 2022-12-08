import config from './defaultConfig.js';
import { defineConfig } from '@vue/cli-service';
import path from 'path';

if (JSON.parse(config.env_vars.FULL_SOURCEMAPS) === 'false')
  config.sourceMapsConfig.exclude = /vendors.*.*/;
export default defineConfig({
  publicPath: './',
  configureWebpack: config.webpackConfig,
  lintOnSave: process.env.NODE_ENV === 'production' ? 'error' : true,
  integrity: process.env.WEBPACK_INTEGRITY === 'false' ? false : true,
  productionSourceMap: true,
  chainWebpack: config => {
    // TODO Remove when using real @myetherwallet/mew-components-vue3
    config.resolve.symlinks(false);

    // TODO Remove when using real @myetherwallet/mew-components-vue3
    config.resolve.alias.set('vue', path.resolve('./node_modules/vue'));

    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();
  }
});
