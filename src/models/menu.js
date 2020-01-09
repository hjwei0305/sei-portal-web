/*
 * @Author: zp
 * @Date:   2020-01-09 15:49:41
 * @Last Modified by:   zp
 * @Last Modified time: 2020-01-09 20:07:30
 */
import { getMenu } from '@/services/menu';

export default {
  namespace: 'menu',

  state: {
    modules: [],
    currModule: [],
    /** 页签数据 */
    tabData: [],
    /** 被激活的页签key */
    activedKey: '',
  },

  effects: {
    *getMenus(_, { put }) {
      const result = yield getMenu();
      yield put({
        type: 'updateState',
        payload: {
          modules: result.data,
          currModule: result.data[0],
        },
      });
    },
    *toggleModule({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });
    },
    *updateTabState({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });
      return payload;
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
