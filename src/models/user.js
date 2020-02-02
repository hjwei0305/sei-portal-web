/*
 * @Author: zp
 * @Date:   2020-01-16 09:17:05
 * @Last Modified by:   zp
 * @Last Modified time: 2020-02-02 10:28:19
 */
import { router } from 'umi';
import { notification } from 'antd';
import { setLocale } from 'umi-plugin-react/locale';
import { userLogin, userLogout } from '@/services/user';
import { userInfoOperation } from '@/utils';

const {
  setCurrentUser,
  setSessionId,
  clearUserInfo,
  getSessionId,
  setCurrentLocale,
  getCurrentLocale,
  adaptLocale,
} = userInfoOperation;

export default {
  namespace: 'user',

  state: {
    userInfo: null,
    sessionId: null,
  },

  effects: {
    *userLogin({ payload }, { put }) {
      const result = yield userLogin({ ...payload, locale: adaptLocale(getCurrentLocale()) });
      const { success, data, message } = result || {};
      const { sessionId, locale, loginStatus } = data || {};
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
        setCurrentLocale(adaptLocale(locale || 'zh_CN'));
        setLocale(adaptLocale(locale || 'zh_CN'));
        router.replace('/');
      } else {
        notification.error({
          message: '接口请求异常',
          description: message,
        });
      }
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
          activedKey: '',
        },
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
