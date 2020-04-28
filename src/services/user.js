/*
 * @Author: zp
 * @Date:   2020-01-16 09:17:57
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-28 09:28:09
 */
import { request, CONSTANTS } from '@/utils';

const { SEIAUTHSERVICE, BASICSERVICE } = CONSTANTS;

/**
 * 绑定社交帐号
 * @param {object} data 参数
 */
export const bindingSocialAccount = data =>
  request.post(`${SEIAUTHSERVICE}/sso/binding/socialAccount`, data);

/**
 * 登录方法
 * @param {object} params [参数]
 * account {string} 帐号
 * password {string} 密码
 * tenant {string} 租户
 * id {string} 唯一值
 */
export async function userLogin(params) {
  return request.post(`${SEIAUTHSERVICE}/auth/login`, params, {
    headers: {
      needToken: false,
    },
  });
}

/**
 * 用户退出
 * @param  {object} params {sid: ''}
 */
export async function userLogout(params) {
  return request({
    url: `${SEIAUTHSERVICE}/auth/logout`,
    method: 'POST',
    data: params.sid,
  });
}

/** 获取验证码 */
export async function getVerifyCode(reqId) {
  return request({
    method: 'GET',
    url: `${SEIAUTHSERVICE}/auth/verifyCode?reqId=${reqId}`,
    headers: {
      needToken: false,
    },
  });
}

/** 获取当前用户有权限的功能项集合 */
export async function getAuthorizedFeatures(userId) {
  return request.get(`${SEIAUTHSERVICE}/auth/getAuthorizedFeatures?userId=${userId}`);
}

/** 清除用户缓存 */
export async function clearUserAuthCaches(userId) {
  return request.post(`${BASICSERVICE}/user/clearUserAuthorizedCaches/${userId}`);
}
