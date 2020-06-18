/*
 * @Author: zp
 * @Date:   2020-01-09 15:49:41
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-18 14:22:38
 */
import { router } from 'umi';
import { utils } from 'suid';
import { cloneDeep, set, has } from 'lodash';
import { getMenu, collectMenu, deCollectMenu } from '@/services/menu';
import { treeOperation, CONSTANTS, eventBus, userInfoOperation } from '@/utils';
import { traverseTrees } from '@/utils/tree';

const { storage } = utils;

const { NoMenuPages, RECENT_MENUS_KEY, RECENT_APP_EKY } = CONSTANTS;
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
    children,
    rootId,
    rootName,
    favorite,
    name: title,
    menuUrl: url,
    namePath: urlPath,
    iconCls: iconType,
    iconFileData: appBase64ImgStr,
  } = tree;
  return {
    id,
    title,
    url,
    urlPath,
    children,
    iconType,
    rootId,
    rootName,
    appBase64ImgStr,
    favorite,
  };
}

function processTabs(visibleTabs, moreTabs, showCount) {
  let visibleTabData = [].concat(visibleTabs);
  let moreTabData = [].concat(moreTabs);
  const tempLen = showCount - visibleTabs.length;
  /** 页签没有填满可视区域 */
  if (tempLen > 0) {
    visibleTabData = visibleTabData.concat(moreTabData.slice(0, tempLen));
    moreTabData = moreTabData.slice(tempLen);
  }
  /** 可见页签超过了可见页签数量 */
  if (tempLen < 0) {
    moreTabData = visibleTabData.slice(tempLen).concat(moreTabData);
    visibleTabData = visibleTabData.slice(0, showCount);
  }

  return {
    visibleTabData,
    moreTabData,
  };
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
    /** 可视页签 */
    visibleTabData: [NoMenuPages[0]],
    /** 页签可视区域，下拉中的页签数据 */
    moreTabData: [],
    /** 可视区域能够显示页签的数量 */
    showTabCounts: undefined,
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
        let tmpCurrMenuTree = menuTrees[0];
        // 获取用户最后一次使用的应用如果有就默认作为当前应用
        const userInfo = getCurrentUser();
        if (userInfo && userInfo.userId) {
          const key = `${RECENT_APP_EKY}_${userInfo.userId}`;
          const recentApp = storage.localStorage.get(key);
          if (recentApp) {
            const recentMenuTree = menuTrees.filter(m => m.id === recentApp.id);
            if (recentMenuTree.length === 1) {
              [tmpCurrMenuTree] = recentMenuTree;
            }
          }
        }
        const allLeafMenus = getTreeLeaf(menuTrees);
        const payload = {
          menuTrees,
          allLeafMenus,
          currMenuTree: tmpCurrMenuTree,
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
    *collectMenu({ payload }, { call, select, put }) {
      // const { id: menuId, } = payload;
      const { currMenuTree, menuTrees } = yield select(state => state.menu);
      traverseTrees([currMenuTree], item => {
        if (item.id === payload.id) {
          item.favorite = true;
        }
      });

      traverseTrees([menuTrees], item => {
        if (item.id === payload.id) {
          item.favorite = true;
        }
      });

      const allLeafMenus = getTreeLeaf(menuTrees);
      const result = yield call(collectMenu, payload);
      const { success } = result || {};
      if (success) {
        yield put({
          type: '_updateState',
          payload: {
            currMenuTree,
            menuTrees,
            allLeafMenus,
          },
        });
      }
      return result;
    },
    *deCollectMenu({ payload }, { call, select, put }) {
      const { currMenuTree, menuTrees } = yield select(state => state.menu);
      traverseTrees([currMenuTree], item => {
        if (item.id === payload.id) {
          item.favorite = false;
        }
      });

      traverseTrees([menuTrees], item => {
        if (item.id === payload.id) {
          item.favorite = false;
        }
      });
      const allLeafMenus = getTreeLeaf(menuTrees);
      const result = yield call(deCollectMenu, payload);
      const { success } = result || {};
      if (success) {
        yield put({
          type: '_updateState',
          payload: {
            currMenuTree,
            menuTrees,
            allLeafMenus,
          },
        });
      }

      return result;
    },
    *updateShowTabCounts({ payload }, { put }) {
      /** 更新页签状态 */
      yield put({
        type: 'updateTabs',
        payload,
      });
    },
    *updateTabs({ payload }, { select, put }) {
      const menu = yield select(state => state.menu);
      const { closeTabIds, showTabCounts: newShowCounts, activedMenu: newActivedMenu } = payload;

      let { visibleTabData, moreTabData, activedMenu, showTabCounts } = menu;

      if (newActivedMenu) {
        const newTabHasInMore = moreTabData.some(item => item.id === newActivedMenu.id);
        const newTabHasInVisile = visibleTabData.some(item => item.id === newActivedMenu.id);
        /** 被激活的页签在更多页签数据里面 */
        if (newTabHasInMore) {
          visibleTabData = moreTabData
            .filter(item => item.id === newActivedMenu.id)
            .concat(visibleTabData);
          moreTabData = [visibleTabData.pop()].concat(
            moreTabData.filter(item => item.id !== newActivedMenu.id),
          );
        }

        /** 被激活的页签是新开的页签 */
        if (!newTabHasInVisile && !newTabHasInMore) {
          visibleTabData.unshift(newActivedMenu);
          ({ visibleTabData, moreTabData } = processTabs(
            visibleTabData,
            moreTabData,
            showTabCounts,
          ));
        }

        activedMenu = newActivedMenu;
      }

      /** 可显示页签数变化时处理页签逻辑 */
      if (newShowCounts) {
        const tempLen = newShowCounts - visibleTabData.length;
        /** 页签没有填满可视区域 */
        if (tempLen > 0) {
          visibleTabData = visibleTabData.concat(moreTabData.slice(0, tempLen));
          moreTabData = moreTabData.slice(tempLen);
        }
        /** 可见页签超过了可见页签数量 */
        if (tempLen < 0) {
          moreTabData = visibleTabData.slice(tempLen).concat(moreTabData);
          visibleTabData = visibleTabData.slice(0, newShowCounts);
          if (activedMenu && moreTabData.some(item => item.id === activedMenu.id)) {
            moreTabData = visibleTabData.slice(-1).concat(moreTabData);
            moreTabData = moreTabData.filter(item => item.id !== activedMenu.id);
            visibleTabData.unshift(activedMenu);
            visibleTabData.pop();
          }
        }

        showTabCounts = newShowCounts;
      }

      /** 关闭页签 */
      if (closeTabIds && closeTabIds.length) {
        const hasActivedTabInDelTabs = activedMenu
          ? closeTabIds.some(id => activedMenu.id === id)
          : false;
        /** 删除的页签中包含激活的页签 */
        if (hasActivedTabInDelTabs) {
          const tempVisibleTabs = visibleTabData.filter(
            item => item.id === activedMenu.id || !closeTabIds.includes(item.id),
          );
          const tempMoreTabs = moreTabData.filter(item => !closeTabIds.includes(item.id));
          const addVisibleTabs = tempMoreTabs.slice(0, showTabCounts - tempVisibleTabs.length + 1);
          moreTabData = tempMoreTabs.slice(showTabCounts + 1 - tempVisibleTabs.length);
          visibleTabData = tempVisibleTabs.concat(addVisibleTabs);
          const activedIndex = visibleTabData.findIndex(item => item.id === activedMenu.id);
          const temepActivedMenu =
            visibleTabData[activedIndex - 1] || visibleTabData[activedIndex + 1];
          visibleTabData = visibleTabData.filter(item => item.id !== activedMenu.id);
          activedMenu = temepActivedMenu;
        } else {
          const tempVisibleTabs = visibleTabData.filter(item => !closeTabIds.includes(item.id));
          const tempMoreTabs = moreTabData.filter(item => !closeTabIds.includes(item.id));
          const addVisibleTabs = tempMoreTabs.slice(0, showTabCounts - tempVisibleTabs.length);
          moreTabData = tempMoreTabs.slice(showTabCounts - tempVisibleTabs.length);
          visibleTabData = tempVisibleTabs.concat(addVisibleTabs);
        }
      }

      yield put({
        type: '_updateState',
        payload: {
          moreTabData,
          visibleTabData,
          activedMenu,
          showTabCounts,
        },
      });
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
    /** 打开收藏菜单 */
    *openFavoriteMenu({ payload }, { put, select }) {
      const { activedMenu } = payload;
      const { allLeafMenus } = yield select(state => state.menu);
      if (activedMenu) {
        const [tempactivedMenu] = allLeafMenus.filter(m => m.id === activedMenu.id);
        /** 更新开业页签 */
        yield put({
          type: 'openTab',
          payload: {
            activedMenu: tempactivedMenu || activedMenu,
          },
        });
      }

      return payload;
    },
    *openTab({ payload }, { put }) {
      const { activedMenu } = payload;
      if (activedMenu) {
        const originMenus = NoMenuPages.filter(m => m.id === activedMenu.id);
        if (originMenus.length === 0 && has(activedMenu, 'urlPath')) {
          // 按用户记录打开的菜单
          const userInfo = getCurrentUser();
          if (userInfo && userInfo.userId) {
            const key = `${RECENT_MENUS_KEY}_${userInfo.userId}`;
            const recentMenus = storage.localStorage.get(key) || {};
            const tmpMenu = cloneDeep(activedMenu);
            tmpMenu.date = Date.now();
            set(recentMenus, tmpMenu.id, tmpMenu);
            storage.localStorage.set(key, recentMenus);
          }
        }
        /** 更新页签状态 */
        yield put({
          type: 'updateTabs',
          payload: {
            activedMenu,
          },
        });
      }

      return payload;
    },
    *closeTab({ payload }, { put }) {
      const { tabIds } = payload;
      /** 更新页签状态 */
      yield put({
        type: 'updateTabs',
        payload: {
          closeTabIds: tabIds,
        },
      });
      return tabIds;
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
      /** 添加监听收藏页签 */
      eventBus.addListener('collectMenu', tabId => {
        if (tabId) {
          dispatch({
            type: 'collectMenu',
            payload: {
              id: tabId,
            },
          });
        }
      });
      // /** 添加监听取消收藏页签 */
      eventBus.addListener('deCollectMenu', tabId => {
        if (tabId) {
          dispatch({
            type: 'deCollectMenu',
            payload: {
              id: tabId,
            },
          });
        }
      });
      /** 添加打开收藏页签事件 */
      eventBus.addListener('openFavoriteMenu', activedMenu => {
        if (activedMenu) {
          dispatch({
            type: 'openFavoriteMenu',
            payload: {
              activedMenu,
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
