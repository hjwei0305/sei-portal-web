/*
 * @Author: zp
 * @Date:   2020-01-09 15:57:34
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-12 16:15:45
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

/** 移除收藏菜单 */
export const deCollectMenu = ({ id }) => request.post(`${BASICSERVICE}/userMenu/removeMenu/${id}`);
