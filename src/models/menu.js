/*
 * @Author: zp
 * @Date:   2020-01-09 15:49:41
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-28 16:59:15
 */
import { router } from 'umi';
import { getMenu } from '@/services/menu';
import { treeOperation, CONSTANTS, eventBus, userInfoOperation } from '@/utils';
import { cloneDeep } from 'lodash';

const { NoMenuPages } = CONSTANTS;
const { getTreeLeaf, traverseCopyTrees } = treeOperation;
const { getCurrentUser } = userInfoOperation;

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
  const {
    id,
    name: title,
    menuUrl: url,
    namePath: urlPath,
    iconCls: iconType,
    children,
    rootId,
  } = tree;
  return { id, title, url, urlPath, children, iconType: iconType || 'profile', rootId };
}

export default {
  namespace: 'menu',

  state: {
    /** 菜单树集合 */
    menuTrees: [],
    /** 当前菜单树 */
    currMenuTree: null,
    /** 页签数据 */
    tabData: [NoMenuPages[0]],
    /** 被激活的菜单项 */
    activedMenu: null,
    /** 页签打开模式 spa spa-tab iframe */
    mode: 'iframe',
    /** 所有菜单树的叶子菜单 */
    allLeafMenus: [],
    /** 是否显示登录框 */
    loginVisible: false,
  },

  effects: {
    *getMenus(_, { put, call }) {
      const result = yield call(getMenu);
      const { success, data } = result || {};
      if (success) {
        const menuTrees = traverseCopyTrees(data, adapterMenus);
        const allLeafMenus = getTreeLeaf(menuTrees);
        const payload = {
          menuTrees,
          allLeafMenus,
          currMenuTree: menuTrees[0],
        };
        if (initPathname) {
          const temp = allLeafMenus.concat(NoMenuPages).filter(item => item.url === initPathname);
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
          if (activedMenu.id !== NoMenuPages[0].id) {
            payload.tabData = [NoMenuPages[0], activedMenu];
          } else {
            payload.tabData = [activedMenu];
          }
          payload.activedMenu = activedMenu;
          payload.currMenuTree = currMenuTree;
          initPathname = '';
        }

        yield put({
          type: '_updateState',
          payload,
        });
      }
    },
    *timeoutLogin(_, { put }) {
      const userInfo = getCurrentUser();
      if (userInfo) {
        yield put({
          type: '_updateState',
          payload: {
            loginVisible: true,
          },
        });
      } else {
        router.replace('/user/login');
      }
    },
    *openTab({ payload }, { put, select }) {
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
        type: '_updateState',
        payload: tempPayload,
      });
      return tempPayload;
    },
    *closeTab({ payload }, { put, select }) {
      const menu = yield select(state => state.menu);
      const { tabData, activedMenu } = menu;
      const { tabIds } = payload;
      const tempTabData = tabData.filter(item => !tabIds.includes(item.id) || item.noClosable);
      if (!activedMenu || !tabIds.includes(activedMenu.id)) {
        yield put({
          type: '_updateState',
          payload: {
            tabData: tempTabData,
          },
        });
      } else {
        yield put({
          type: '_updateState',
          payload: {
            tabData: tempTabData,
            activedMenu: cloneDeep(tempTabData).pop(),
          },
        });
      }

      return tempTabData;
    },
    *updateState({ payload }, { put }) {
      yield put({
        type: '_updateState',
        payload,
      });
      return payload;
    },
  },

  subscriptions: {
    setup({ history }) {
      return history.listen(async ({ pathname }) => {
        if (
          !['/', '/DashBoard', '/user/login', '/sso/socialAccount', '/sso/ssoWrapperPage'].includes(
            pathname,
          ) &&
          init
        ) {
          init = false;
          initPathname = pathname;
        }
      });
    },
    eventBusListenter({ dispatch }) {
      eventBus.addListener('timeoutLogin', () => {
        dispatch({
          type: 'timeoutLogin',
        });
      });
      /** 添加监听开页签 */
      eventBus.addListener('openTab', tab => {
        if (tab) {
          const { id, title, url } = tab;
          dispatch({
            type: 'openTab',
            payload: {
              activedMenu: {
                id,
                title,
                url,
              },
            },
          });
        }
      });
      /** 添加监听关闭页签 */
      eventBus.addListener('closeTab', tabIds => {
        if (tabIds && tabIds.length) {
          dispatch({
            type: 'closeTab',
            payload: {
              tabIds,
            },
          });
        }
      });
    },
  },

  reducers: {
    _updateState(state, { payload }) {
      const { currMenuTree, menuTrees } = state;
      const { activedMenu } = payload;
      const { id, activedRefresh, rootId } = activedMenu || {};
      if (activedMenu && activedRefresh) {
        eventBus.emit(`${id}_refresh`);
      }
      if (currMenuTree && rootId && currMenuTree.id !== rootId) {
        const tempArr = menuTrees.filter(item => item.id === rootId);
        const [tempCurrMenuTree] = tempArr;
        // eslint-disable-next-line no-param-reassign
        payload.currMenuTree = tempCurrMenuTree;
      }
      return {
        ...state,
        ...payload,
      };
    },
  },
};
