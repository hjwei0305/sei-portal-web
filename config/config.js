import slash from 'slash2';
import routes from './router.config';
import proxy from './proxy.config';
import { webpackPlugin as chainWebpack } from './chain.webpack.config';
import plugins from './plugin.config';
import theme from './theme.config.js';

export default {
  // history: 'hash',
  base: 'sei-portal-web',
  publicPath: '/sei-portal-web/',
  outputPath: '/dist',
  targets: {
    ie: 11,
  },
  ignoreMomentLocale: true,
  disableRedirectHoist: true,
  treeShaking: true,
  plugins,
  routes,
  theme,
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      }
    ],
    [
      'import',
      {
        libraryName: 'seid',
        libraryDirectory: 'es',
        style: true,
      },
      'seid'
    ],
  ],
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack,
  proxy,
};
