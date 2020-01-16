/*
 * @Author: zp
 * @Date:   2020-01-09 15:57:34
 * @Last Modified by:   zp
 * @Last Modified time: 2020-01-16 15:35:32
 */
import { request, CONSTANTS } from '@/utils';

const { PORTALSERVICE } = CONSTANTS;

export const getMenu = () =>
  request.post(
    `http://rddgit.changhong.com:7300/mock/5dfc741736608e42d52b1d7b${PORTALSERVICE}/getMenus`,
  );
