/*
 * @Author: zp
 * @Date:   2020-01-09 15:57:34
 * @Last Modified by:   zp
 * @Last Modified time: 2020-01-09 20:08:08
 */
import { request, CONSTANTS } from '@/utils';

const { PORTALSERVICE } = CONSTANTS;

export const getMenu = () => request.post(`${PORTALSERVICE}/getMenus`);
