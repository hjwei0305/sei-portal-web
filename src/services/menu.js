/*
 * @Author: zp
 * @Date:   2020-01-09 15:57:34
 * @Last Modified by:   zp
 * @Last Modified time: 2020-02-24 17:25:21
 */
import { request, CONSTANTS, userInfoOperation } from '@/utils';

const { getCurrentUser } = userInfoOperation;
const { BASICSERVICE } = CONSTANTS;
export const getMenu = () => {
  const { userId } = getCurrentUser() || {};

  return request.get(`${BASICSERVICE}/user/getUserAuthorizedMenus?userId=${userId}`);
};
