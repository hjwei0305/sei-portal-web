/*
 * @Author: zp
 * @Date:   2020-01-16 09:17:05
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-01 14:55:22
 */
import { router } from 'umi';
import { notification, message } from 'antd';
import { setLocale } from 'umi-plugin-react/locale';
import {
  userLogin,
  userLogout,
  getAuthorizedFeatures,
  clearUserAuthCaches,
  getVerifyCode,
} from '@/services/user';
import { userInfoOperation, eventBus, CONSTANTS } from '@/utils';

const { NoMenuPages } = CONSTANTS;
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
    verifyCode:
      'data:image/jpeg;base64,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',
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
      const { success, data, message: msg } = result || {};
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
          message: '请求错误',
          description: msg,
        });
      }

      return result;
    },
    *userLogout(_, { put }) {
      router.replace('/user/login');
      const user = getCurrentUser();
      yield clearUserAuthCaches(user.userId);
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
          tabData: [NoMenuPages[0]],
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
          tabData: [NoMenuPages[0]],
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
    *getVerifyCode(_, { call, put }) {
      const result = yield call(getVerifyCode, 'test');
      const { success, data, message: msg } = result || {};
      if (success) {
        put({
          type: 'updateState',
          payload: {
            verifyCode: data,
          },
        });
      } else {
        message.error(msg);
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
