/** 判断是否为pc端企业微信 */
export const isWeiXin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (/wechat/.test(ua) && /wxwork/.test(ua)) {
    return true;
  }
  return false;
};
