/*
 * @Author: zp
 * @Date:   2020-01-16 09:17:05
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-08 14:28:10
 */
import { router } from 'umi';
import { notification, message } from 'antd';
import { setLocale } from 'umi-plugin-react/locale';
import {
  userLogin,
  userLogout,
  bindingSocialAccount,
  getAuthorizedFeatures,
  clearUserAuthCaches,
  getVerifyCode,
  getUserByXsid,
  updatePwd,
  authorizeData,
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
    verifyCode: null,
    qrConfig: null,
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
    *processUser({ payload }, { put }) {
      const { userInfo } = payload;
      const { sessionId, locale, authorityPolicy } = userInfo || {};
      yield put({
        type: 'updateState',
        payload: {
          userInfo,
          sessionId,
        },
      });
      setCurrentUser(userInfo);
      setSessionId(sessionId);
      setCurrentPolicy(authorityPolicy);
      setCurrentLocale(adaptLocale(locale || 'zh_CN'));
      setLocale(adaptLocale(locale || 'zh_CN'));
    },
    *bindingSocialAccount({ payload }, { call }) {
      const result = yield call(bindingSocialAccount, payload);
      const { success, data, message: msg } = result || {};
      if (success) {
        if (data && data.redirectUrl) {
          window.open(data.redirectUrl, '_self');
        }
        // yield put({
        //   type: 'processUser',
        //   payload: {
        //     userInfo: data,
        //   },
        // });
        // router.replace('/');
      } else {
        notification.error({
          message: '请求错误',
          description: msg,
        });
      }
    },
    *getUserByXsid({ payload }, { put, call }) {
      const result = yield call(getUserByXsid, payload);
      const { success, data, message: msg } = result || {};
      if (success) {
        yield put({
          type: 'processUser',
          payload: {
            userInfo: data,
          },
        });
        router.replace('/');
      } else {
        notification.error({
          message: '请求错误',
          description: msg,
        });
      }

      return result;
    },
    *userLogin({ payload }, { put }) {
      const result = yield userLogin({ ...payload, locale: adaptLocale(getCurrentLocale()) });
      const { success, data, message: msg } = result || {};
      const { loginStatus } = data || {};
      if (success && loginStatus === 'success') {
        yield put({
          type: 'menu/updateState',
          payload: {
            loginVisible: false,
          },
        });
        yield put({
          type: 'processUser',
          payload: {
            userInfo: data,
          },
        });
        router.replace('/');
      } else {
        notification.error({
          message: '请求错误',
          description: msg,
        });
        if (loginStatus === 'passwordExpire') {
          router.replace(`/updatePwd?account=${data.account}&tenant=${data.tenantCode}`);
        }
      }

      return result;
    },
    *updatePwd({ payload }, { call }) {
      const result = yield call(updatePwd, payload);
      const { success, message: msg } = result || {};
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *authorizeData(_, { call, put }) {
      const result = yield call(authorizeData);
      const { success, message: msg, data } = result || {};
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            qrConfig: data,
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
    *quickLogin({ payload }, { put }) {
      const result = yield userLogin({ ...payload, locale: adaptLocale(getCurrentLocale()) });
      const { success, data, message: msg } = result || {};
      const { loginStatus } = data || {};
      if (success && loginStatus === 'success') {
        yield put({
          type: 'processUser',
          payload: {
            userInfo: data,
          },
        });
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
          visibleTabData: [NoMenuPages[0]],
          moreTabData: [],
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
          visibleTabData: [NoMenuPages[0]],
          moreTabData: [],
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
    *getVerifyCode({ payload }, { call, put }) {
      const result = yield call(getVerifyCode, payload.reqId);
      const { success, data, message: msg } = result || {};
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            verifyCode: data,
          },
        });
      } else {
        message.error(msg);
      }
      return result;
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
