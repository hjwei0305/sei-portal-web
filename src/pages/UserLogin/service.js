/*
* @Author: zp
* @Date:   2019-12-20 13:55:55
* @Last Modified by:   zp
* @Last Modified time: 2020-01-06 14:29:18
*/
import { request, CONSTANTS, } from '@/utils';

const { PORTALSERVICE, } = CONSTANTS;

/**
 * 登录方法
 * @param {object} params [参数]
 * account {string} 帐号
 * password {string} 密码
 */
export async function login(params) {
  return request.post(`${PORTALSERVICE}/login`, {
    params,
  });
}
