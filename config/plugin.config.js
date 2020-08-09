/*
 * @Author: zp
 * @Date:   2020-01-06 10:48:11
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-23 16:11:09
 */
export default [
  [
    '@umijs/plugin-qiankun',
    {
      master: {},
    },
  ],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true,
        default: 'zh-CN',
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
      },
      dll: {
        include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
        exclude: ['@babel/runtime', 'netlify-lambda', '@umijs/plugin-qiankun', 'suid'],
      },
    },
  ],
];
