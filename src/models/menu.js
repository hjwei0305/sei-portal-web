/*
 * @Author: zp
 * @Date:   2020-01-09 15:49:41
 * @Last Modified by:   zp
 * @Last Modified time: 2020-01-19 10:59:43
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
    *updateTabState({ payload }, { put, select }) {
      const menu = yield select(state => state.menu);
      const { tabData, activedKey } = menu;
      const { menuItem } = payload;
      let tempPayload = {};
      if (menuItem) {
        const isExist = tabData.some(item => item.id === menuItem.id);
        if (isExist) {
          if (menuItem.id !== activedKey) {
            tempPayload.activedKey = menuItem.id;
          }
        } else {
          tempPayload = {
            tabData: tabData.concat(menuItem),
            activedKey: menuItem.id,
          };
        }
      } else {
        tempPayload = payload;
      }

      yield put({
        type: 'updateState',
        payload: tempPayload,
      });
      return tempPayload;
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
