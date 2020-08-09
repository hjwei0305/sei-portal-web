import { request, CONSTANTS } from '@/utils';

const { HELPSERVICE } = CONSTANTS;

export const getAnswers = params =>
  request({
    method: 'GET',
    url: `${HELPSERVICE}/index/`,
    params,
  });

/** 获取本周热贴 */
export const getHotPosts = () => request.get(`${HELPSERVICE}/topic/hot`);

/** 获取联系负责人 */
export const getContacts = () => request.get(`${HELPSERVICE}/contractInfo/findAllUnfrozen`);
