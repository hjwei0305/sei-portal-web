/*
 * @Author: zp
 * @Date:   2020-01-16 09:17:57
 * @Last Modified by:   zp
 * @Last Modified time: 2020-01-16 21:22:34
 */
import { request, CONSTANTS } from '@/utils';

const { SEIAUTHSERVICE } = CONSTANTS;

/**
 * 登录方法
 * @param {object} params [参数]
 * account {string} 帐号
 * password {string} 密码
 * tenant {string} 租户
 * id {string} 唯一值
 */
export async function userLogin(params) {
  return request.post(`${SEIAUTHSERVICE}/auth/login`, params);
}

/**
 * 用户退出
 * @param  {object} params {sid: ''}
 */
export async function userLogout(params) {
  return request({
    url: `${SEIAUTHSERVICE}/auth/logout`,
    method: 'POST',
    data: params,
  });
}
