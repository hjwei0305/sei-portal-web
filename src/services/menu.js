/*
 * @Author: zp
 * @Date:   2020-01-09 15:57:34
 * @Last Modified by:   zp
 * @Last Modified time: 2020-02-24 11:17:09
 */
import { request, CONSTANTS, userInfoOperation } from '@/utils';

const { getCurrentUser } = userInfoOperation;
const { userId } = getCurrentUser() || {};
const { BASICSERVICE } = CONSTANTS;
export const getMenu = () =>
  request.get(
    `${BASICSERVICE}/user/getUserAuthorizedMenus?userId=${userId}`,
    // `${BASICSERVICE}/menu/getMenuTree`,
  );
