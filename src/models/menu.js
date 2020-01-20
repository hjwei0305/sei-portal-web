/*
 * @Author: zp
 * @Date:   2020-01-09 15:49:41
 * @Last Modified by:   zp
 * @Last Modified time: 2020-01-20 17:27:53
 */
import { getMenu } from '@/services/menu';

let init = true;
let initPathname = '';

function getAllLeaf(tree, result = []) {
  for (let i = tree.length - 1; i >= 0; i -= 1) {
    const item = tree[i];
    if (item.children && item.children.length) {
      getAllLeaf(item.children, result);
    } else {
      result.push(item);
    }
  }
  return result;
}

export default {
  namespace: 'menu',

  state: {
    modules: [],
    currModule: [],
    /** 页签数据 */
    tabData: [],
    /** 被激活的页签key */
    activedKey: '',
    /** 页签打开模式 */
    mode: 'spa',
  },

  effects: {
    *getMenus(_, { put }) {
      const result = yield getMenu();
      const payload = {
        modules: result.data,
        currModule: result.data[0],
      };
      if (initPathname) {
        const temp = getAllLeaf(result.data).filter(item => item.featureUrl === initPathname);
        let tabData = [
          {
            id: 'other',
            path: initPathname,
            title: '其他',
            url: initPathname,
          },
        ];
        let activedKey = 'other';
        if (temp && temp.length) {
          const { id, featureUrl, name } = temp[0];
          tabData = [
            {
              id,
              path: featureUrl,
              title: name,
              url: featureUrl,
            },
          ];
          activedKey = id;
        }
        payload.tabData = tabData;
        payload.activedKey = activedKey;
        initPathname = '';
      }

      yield put({
        type: 'updateState',
        payload,
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

  subscriptions: {
    setup({ history }) {
      return history.listen(async ({ pathname }) => {
        if (!['/', '/DashBoard', '/user/login'].includes(pathname) && init) {
          init = false;
          initPathname = pathname;
        }
      });
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
