import slash from 'slash2';
import routes from './router.config';
import proxy from './proxy.config';
import { webpackPlugin as chainWebpack } from './chain.webpack.config';
import plugins from './plugin.config';
import theme from './theme.config.js';

export default {
  history: 'hash',
  hash: true,
  publicPath: '/sei-portal-web/',
  targets: {
    ie: 11,
  },
  ignoreMomentLocale: true,
  disableRedirectHoist: true,
  treeShaking: true,
  plugins,
  routes,
  theme,
  devtool: 'source-map',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
    [
      'import',
      {
        libraryName: 'suid',
        libraryDirectory: 'es',
        style: true,
      },
      'suid',
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
