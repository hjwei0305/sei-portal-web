import { request, CONSTANTS } from '@/utils';

const { NOTIFYSERVICE } = CONSTANTS;

/** 根据消息分类和消息id获取详细明细 */
export function getDetailByIdAndCategory(param = {}) {
  return request.get(`${NOTIFYSERVICE}/message/detail?id=${param.id}&category=${param.category}`);
}

/** 获取消息总数 */
export function getMessageCount(param = '') {
  return request.get(`${NOTIFYSERVICE}/message/unreadCount`, param);
}
/** 获取消息 */
export function getMessageList(param = '') {
  return request.get(`${NOTIFYSERVICE}/message/unreadData`, param);
}

/** 知道了 */
export function hasKonwn(params = {}) {
  return request({
    method: 'POST',
    url: `${NOTIFYSERVICE}/message/read`,
    params,
  });
}

/** 获取优先级高的通告 */
export function getCurrenOnetBulletin(param = '') {
  return request.get(`${NOTIFYSERVICE}/message/getFirstUnreadBulletin`, param);
}

/** 获取消息分类 */
export function getCategory(param = '') {
  return request.get(`${NOTIFYSERVICE}/message/getCategory`, param);
}
