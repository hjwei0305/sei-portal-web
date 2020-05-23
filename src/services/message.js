import { request, CONSTANTS } from '@/utils';

const { NOTIFYSERVICE } = CONSTANTS;

/** 根据id获取通告信息 */
export function getById(param = {}) {
  return request.get(`${NOTIFYSERVICE}/bulletin/getBulletin?id=${param.id}`);
}

/** 获取消息总数 */
export function getMessageCount(param = '') {
  return request.get(`${NOTIFYSERVICE}/bulletinMsg/unreadCount`, param);
}
/** 获取消息 */
export function getMessageList(param = '') {
  return request.get(`${NOTIFYSERVICE}/bulletinMsg/unreadData`, param);
}

/** 知道了 */
export function hasKonwn(params = {}) {
  return request({
    method: 'POST',
    url: `${NOTIFYSERVICE}/bulletinMsg/read`,
    params,
  });
}

/** 获取优先级高的通告 */
export function getCurrenOnetBulletin(param = '') {
  return request.get(`${NOTIFYSERVICE}/bulletinMsg/getFirstUnreadBulletin`, param);
}

/** 获取消息分类 */
export function getCategory(param = '') {
  return request.get(`${NOTIFYSERVICE}/bulletinMsg/getCategory`, param);
}
