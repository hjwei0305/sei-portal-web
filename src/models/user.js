/*
 * @Author: zp
 * @Date:   2020-01-16 09:17:05
 * @Last Modified by:   zp
 * @Last Modified time: 2020-01-31 13:07:00
 */
import { router } from 'umi';
import { notification } from 'antd';
import { userLogin, userLogout } from '@/services/user';
import { userInfoOperation } from '@/utils';

const {
  setCurrentUser,
  setSessionId,
  clearUserInfo,
  getSessionId,
  setCurrentLocale,
} = userInfoOperation;

export default {
  namespace: 'user',

  state: {
    userInfo: null,
    sessionId: null,
  },

  effects: {
    *userLogin({ payload }, { put }) {
      const result = yield userLogin(payload);
      const { successful, data, message } = result.data || {};
      if (successful) {
        yield put({
          type: 'updateState',
          payload: {
            userInfo: data,
            sessionId: data.sessionId,
          },
        });
        setCurrentUser(data);
        setSessionId(data.sessionId);
        setCurrentLocale(data.locale);
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
