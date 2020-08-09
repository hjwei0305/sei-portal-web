/*
 * @Author: zp
 * @Date:   2020-01-05 21:56:27
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-16 16:14:47
 */
import * as constants from './constant';
import * as userAuth from './userAuth';
import * as tree from './tree';
import * as weiXinUtils from './wx';

export { default as request } from './request';
export { default as eventBus } from './eventBus';
export { default as speech } from './speechSynthesis';
// export { default as nofity } from './notify';
export { default as waterMark } from './waterMark';
export { default as screenCapture } from './screenCapture';

export {
  constants as CONSTANTS,
  weiXinUtils,
  userAuth as userInfoOperation,
  tree as treeOperation,
};
