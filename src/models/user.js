/*
 * @Author: zp
 * @Date:   2020-01-16 09:17:05
 * @Last Modified by:   zp
 * @Last Modified time: 2020-02-24 13:50:41
 */
import { router } from 'umi';
import { notification } from 'antd';
import { setLocale } from 'umi-plugin-react/locale';
import { userLogin, userLogout, getAuthorizedFeatures } from '@/services/user';
import { userInfoOperation, eventBus } from '@/utils';

const {
  setCurrentUser,
  setSessionId,
  clearUserInfo,
  getSessionId,
  setCurrentLocale,
  getCurrentLocale,
  adaptLocale,
  getCurrentUser,
  setCurrentAuth,
  setCurrentPolicy,
} = userInfoOperation;

export default {
  namespace: 'user',

  state: {
    userInfo: null,
    sessionId: null,
  },

  subscriptions: {
    eventBusListenter({ dispatch }) {
      eventBus.addListener('redirectLogin', () => {
        dispatch({
          type: 'redirectLogin',
        });
      });
    },
  },

  effects: {
    *userLogin({ payload }, { put }) {
      const result = yield userLogin({ ...payload, locale: adaptLocale(getCurrentLocale()) });
      const { success, data, message } = result || {};
      const { sessionId, locale, loginStatus, authorityPolicy } = data || {};
      if (success && loginStatus === 'success') {
        yield put({
          type: 'updateState',
          payload: {
            sessionId,
            userInfo: data,
          },
        });
        setCurrentUser(data);
        setSessionId(sessionId);
        setCurrentPolicy(authorityPolicy);
        setCurrentLocale(adaptLocale(locale || 'zh_CN'));
        setLocale(adaptLocale(locale || 'zh_CN'));
        router.replace('/');
      } else {
        notification.error({
          message: '接口请求异常',
          description: message,
        });
      }

      return result;
    },
    *userLogout(_, { put }) {
      router.replace('/user/login');
      yield userLogout({ sid: getSessionId() });
      clearUserInfo();
      yield put({
        type: 'updateState',
        payload: {
          userInfo: null,
        },
      });
      /** 更新菜单相关状态 */
      yield put({
        type: 'menu/updateState',
        payload: {
          tabData: [],
          activedMenu: null,
        },
      });
    },
    *redirectLogin(_, { put }) {
      router.replace('/user/login');
      /** 更新菜单相关状态 */
      yield put({
        type: 'menu/updateState',
        payload: {
          tabData: [],
          activedMenu: null,
        },
      });
    },
    *getUserFeatures(_, { call }) {
      const user = getCurrentUser();
      const result = yield call(getAuthorizedFeatures, user.userId);
      if (result && result.success) {
        setCurrentAuth(result.data);
      }
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
