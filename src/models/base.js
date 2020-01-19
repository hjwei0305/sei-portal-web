import { qiankunStart } from 'umi';
import { getSubAppConfig } from '@/services/microFront';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// let init = true;

export default {
  namespace: 'base',

  state: {
    name: 'Qiankun',
    apps: [],
  },

  effects: {
    *getApps(_, { put }) {
      /*
       子应用配置信息获取分同步、异步两种方式
       同步有两种配置方式，1、app.js导出qiankun对象，2、配置写在umi配置文件中，可通过import @tmp/subAppsConfig获取
      */
      yield sleep(1000);

      const config = yield getSubAppConfig();
      yield put({
        type: 'getAppsSuccess',
        payload: {
          apps: config.apps,
        },
      });

      // 模拟手动控制 qiankun 启动时机的场景, 需要 defer 配置为 true
      setTimeout(qiankunStart, 1000);
    },
  },

  // subscriptions: {
  // setup({dispatch, history, query}) {
  //       return history.listen(async ({ pathname, search, query}) => {
  //         let activedKey = '';
  //         let tabData = [];
  //         if (!['/', '/DashBoard', '/user/login'].includes(pathname) && init) {
  //           init = false;
  //           activedKey = pathname;
  //           tabData = [{
  //             id: pathname,
  //             title: '新增',
  //             url: pathname,
  //           }];
  //           dispatch({
  //             type: 'menu/updateState',
  //             payload: {
  //               activedKey,
  //               tabData,
  //             }
  //           });
  //         }
  //       })
  //     }
  //
  //   },

  reducers: {
    getAppsSuccess(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
