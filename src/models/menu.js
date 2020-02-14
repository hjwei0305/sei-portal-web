/*
 * @Author: zp
 * @Date:   2020-01-09 15:49:41
 * @Last Modified by:   zp
 * @Last Modified time: 2020-02-14 23:47:24
 */
import { getMenu } from '@/services/menu';
import { treeOperation } from '@/utils';

const { getTreeLeaf, traverseCopyTrees } = treeOperation;
// const { getCurrentLocale } = userInfoOperation;

/** 是否刷新页面的时候的第一次路由 */
let init = true;
/** 刷新页面的时候的第一次路由地址 */
let initPathname = '';

/**
 * 适配后台接口返回的菜单
 * @param  {Object} tree  菜单树
 * @return {Object}        适配后的菜单树
 */
function adapterMenus(tree) {
  const { id, name: title, menuUrl: url, namePath: urlPath, iconCls: iconType, children } = tree;
  return { id, title, url, urlPath, children, iconType: iconType || 'profile' };
}

export default {
  namespace: 'menu',

  state: {
    /** 菜单树集合 */
    menuTrees: [],
    /** 当前菜单树 */
    currMenuTree: null,
    /** 页签数据 */
    tabData: [],
    /** 被激活的菜单项 */
    activedMenu: null,
    /** 页签打开模式 spa spa-tab iframe */
    mode: 'spa-tab',
    /** 所有菜单树的叶子菜单 */
    allLeafMenus: [],
  },

  effects: {
    *getMenus(_, { put }) {
      const result = yield getMenu();
      const { success, data } = result || {};
      // const result = getCurrentLocale() === 'en-US' ? tempEnResult : tempResult;
      if (success) {
        const menuTrees = traverseCopyTrees(data, adapterMenus);
        const allLeafMenus = getTreeLeaf(menuTrees);
        const payload = {
          menuTrees,
          allLeafMenus,
          currMenuTree: menuTrees[0],
        };
        if (initPathname) {
          const temp = allLeafMenus.filter(item => item.url === initPathname);
          let currMenuTree = menuTrees[0];
          for (let i = menuTrees.length - 1; i >= 0; i -= 1) {
            const leafMenus = getTreeLeaf([menuTrees[i]]);
            /* eslint no-loop-func: 0 */
            const isCurrMenuTree = leafMenus.some(item => item.url === initPathname);
            if (isCurrMenuTree) {
              currMenuTree = menuTrees[i];
              break;
            }
          }
          let activedMenu = {
            id: 'other',
            title: '其他',
            url: initPathname,
          };

          if (temp && temp.length) {
            [activedMenu] = temp;
          }
          payload.tabData = [activedMenu];
          payload.activedMenu = activedMenu;
          payload.currMenuTree = currMenuTree;
          initPathname = '';
        }

        yield put({
          type: 'updateState',
          payload,
        });
      }
    },
    *toggleModule({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });
    },
    *updateTabState({ payload }, { put, select }) {
      const menu = yield select(state => state.menu);
      const { tabData } = menu;
      const { activedMenu } = payload;
      let tempPayload = {};
      if (activedMenu) {
        const isExist = tabData.some(item => item.id === activedMenu.id);
        if (isExist) {
          tempPayload.activedMenu = activedMenu;
        } else {
          tempPayload = {
            activedMenu,
            tabData: tabData.concat(activedMenu),
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
