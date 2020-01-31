/*
 * @Author: zp
 * @Date:   2020-01-09 15:49:41
 * @Last Modified by:   zp
 * @Last Modified time: 2020-01-31 13:25:02
 */
// import { getMenu } from '@/services/menu';
import { treeOperation, userInfoOperation } from '@/utils';

const { getTreeLeaf, traverseCopyTrees } = treeOperation;
const { getCurrentLocale } = userInfoOperation;

const tempResult = {
  status: null,
  success: true,
  statusCode: 200,
  message: '请求数据成功',
  data: [
    {
      id: '47953A97-DDD7-11E9-AB96-0242C0A84421',
      code: '91036',
      name: '消息管理',
      rank: 8,
      nodeLevel: 0,
      parentId: '',
      codePath: '|91036',
      namePath: '/消息管理',
      children: [
        {
          id: '2E7F3BA3-DDDA-11E9-A9A9-0242C0A84421',
          code: '91038',
          name: '通告',
          rank: 1,
          nodeLevel: 1,
          parentId: '47953A97-DDD7-11E9-AB96-0242C0A84421',
          codePath: '|91036|91038',
          namePath: '/消息管理/通告',
          children: [
            {
              id: '59C01B9D-DDD7-11E9-AB96-0242C0A84421',
              code: '91039',
              name: '通告主数据',
              rank: 0,
              nodeLevel: 2,
              parentId: '2E7F3BA3-DDDA-11E9-A9A9-0242C0A84421',
              codePath: '|91036|91038|91039',
              namePath: '/消息管理/通告/通告主数据',
              children: null,
              featureCode: 'NOTIFY-TGGL-FB',
              featureUrl: '/sei-notify-web/metaData/notifyContent',
              iconCls: '',
            },
            {
              id: '59C01B9D-DDD7-11E9-AB96-0242C0A844212',
              code: '91039',
              name: '通告发布',
              rank: 0,
              nodeLevel: 2,
              parentId: '2E7F3BA3-DDDA-11E9-A9A9-0242C0A8442123',
              codePath: '|91036|91038|91039',
              namePath: '/消息管理/通告/通告发布',
              children: null,
              featureCode: 'NOTIFY-TGGL-FB',
              featureUrl: '/sei-notify-web/metaData/bulletin',
              iconCls: '',
            },
          ],
          featureCode: null,
          featureUrl: null,
          iconCls: '',
        },
      ],
      featureCode: null,
      featureUrl: null,
      iconCls: '',
    },
  ],
};

const tempEnResult = {
  status: null,
  success: true,
  statusCode: 200,
  message: '请求数据成功',
  data: [
    {
      id: '47953A97-DDD7-11E9-AB96-0242C0A84421',
      code: '91036',
      name: 'message management',
      rank: 8,
      nodeLevel: 0,
      parentId: '',
      codePath: '|91036',
      namePath: '/message management',
      children: [
        {
          id: '2E7F3BA3-DDDA-11E9-A9A9-0242C0A84421',
          code: '91038',
          name: 'notify',
          rank: 1,
          nodeLevel: 1,
          parentId: '47953A97-DDD7-11E9-AB96-0242C0A84421',
          codePath: '|91036|91038',
          namePath: '/message management/notify',
          children: [
            {
              id: '59C01B9D-DDD7-11E9-AB96-0242C0A84421',
              code: '91039',
              name: 'notify master data',
              rank: 0,
              nodeLevel: 2,
              parentId: '2E7F3BA3-DDDA-11E9-A9A9-0242C0A84421',
              codePath: '|91036|91038|91039',
              namePath: '/message management/notify/notify master data',
              children: null,
              featureCode: 'NOTIFY-TGGL-FB',
              featureUrl: '/sei-notify-web/metaData/notifyContent',
              iconCls: '',
            },
            {
              id: '59C01B9D-DDD7-11E9-AB96-0242C0A844212',
              code: '91039',
              name: 'notify publish',
              rank: 0,
              nodeLevel: 2,
              parentId: '2E7F3BA3-DDDA-11E9-A9A9-0242C0A8442123',
              codePath: '|91036|91038|91039',
              namePath: '/message management/notify/notify publish',
              children: null,
              featureCode: 'NOTIFY-TGGL-FB',
              featureUrl: '/sei-notify-web/metaData/bulletin',
              iconCls: '',
            },
          ],
          featureCode: null,
          featureUrl: null,
          iconCls: '',
        },
      ],
      featureCode: null,
      featureUrl: null,
      iconCls: '',
    },
  ],
};

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
  const { id, name: title, featureUrl: url, namePath: urlPath, children } = tree;
  return { id, title, url, urlPath, children, iconType: 'profile' };
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
      // const result = yield getMenu();
      const result = getCurrentLocale() === 'en-US' ? tempEnResult : tempResult;
      const menuTrees = traverseCopyTrees(result.data, adapterMenus);
      const allLeafMenus = getTreeLeaf(menuTrees);
      const payload = {
        menuTrees,
        allLeafMenus,
        currMenuTree: menuTrees[0],
      };
      if (initPathname) {
        const temp = allLeafMenus.filter(item => item.url === initPathname);
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
