/*
 * @Author: zp
 * @Date:   2020-01-16 09:17:05
 * @Last Modified by:   zp
 * @Last Modified time: 2020-01-16 21:22:38
 */
import { router } from 'umi';
import { userLogin, userLogout } from '@/services/user';
import { userInfoOperation } from '@/utils';

const { setCurrentUser, setSessionId, clearUserInfo, getSessionId } = userInfoOperation;

export default {
  namespace: 'user',

  state: {
    userInfo: null,
    sessionId: null,
  },

  effects: {
    *userLogin({ payload }, { put }) {
      const result = yield userLogin(payload);
      yield put({
        type: 'updateState',
        payload: {
          userInfo: result.data,
          sessionId: result.data.sessionId,
        },
      });
      setCurrentUser(result.data);
      setSessionId(result.data.sessionId);
      router.replace('/');
    },
    *userLogout(_, { put }) {
      yield userLogout({ sid: getSessionId() });
      clearUserInfo();
      router.replace('/user/login');
      yield put({
        type: 'updateState',
        payload: {
          userInfo: null,
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
