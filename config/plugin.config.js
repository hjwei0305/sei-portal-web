/*
* @Author: zp
* @Date:   2020-01-06 10:48:11
* @Last Modified by:   zp
* @Last Modified time: 2020-01-06 11:06:51
*/
export default [
  [
    '@umijs/plugin-qiankun',
    {
      master: {}
    }
  ],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      title: '平台',
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
        exclude: ['@babel/runtime', 'netlify-lambda', '@umijs/plugin-qiankun'],
      },
    },
  ],
];
