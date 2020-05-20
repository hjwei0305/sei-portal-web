/** 判断是否为pc端企业微信 */
export const isWeiXin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/windowswechat/i) === 'windowswechat' && ua.match(/wxwork/i) === 'wxwork') {
    return true;
  }
  return false;
};
