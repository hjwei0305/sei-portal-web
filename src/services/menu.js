/*
 * @Author: zp
 * @Date:   2020-01-09 15:57:34
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-12 15:03:28
 */
import { request, CONSTANTS, userInfoOperation } from '@/utils';

const { getCurrentUser } = userInfoOperation;
const { BASICSERVICE } = CONSTANTS;
export const getMenu = () => {
  const { userId } = getCurrentUser() || {};

  return request.get(`${BASICSERVICE}/user/getUserAuthorizedMenus?userId=${userId}`);
};

/** 收藏菜单 */
export const collectMenu = ({ id }) => request.post(`${BASICSERVICE}/userMenu/insertMenu/${id}`);
