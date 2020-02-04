/*
 * @Author: zp
 * @Date:   2020-01-09 15:57:34
 * @Last Modified by:   zp
 * @Last Modified time: 2020-02-04 14:02:29
 */
import { request, CONSTANTS } from '@/utils';

const { PORTALSERVICE } = CONSTANTS;
// `${BASICSERVICE}/menu/getMenuTree`,
export const getMenu = () =>
  request.get(
    `http://rddgit.changhong.com:7300/mock/5dfc741736608e42d52b1d7b${PORTALSERVICE}/getMenus`,
  );
