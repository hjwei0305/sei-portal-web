/*
 * @Author: zp
 * @Date:   2020-01-16 10:51:41
 * @Last Modified by:   zp
 * @Last Modified time: 2020-01-16 15:36:48
 */
import { utils } from 'seid';

const { sessionStorage } = utils.storage;
const { CONST_GLOBAL } = utils.constants;
const { CURRENT_USER, SESSION } = CONST_GLOBAL;

/** 用户信息保存到session */
export const setCurrentUser = user => {
  sessionStorage.set(CURRENT_USER, user);
};

/** 获取当前用户信息 */
export const getCurrentUser = () => sessionStorage.get(CURRENT_USER);

/** sid保存到session */
export const setSessionId = sid => {
  sessionStorage.set(SESSION, sid);
};

/** 获取当前sid */
export const getSessionId = () => sessionStorage.get(SESSION);

/** 根据键清空 */
export const clearUserInfo = () => sessionStorage.clear([CURRENT_USER, SESSION]);
