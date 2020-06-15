/*
 * @Author: zp
 * @Date:   2020-01-05 21:56:27
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-15 10:32:09
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

export {
  constants as CONSTANTS,
  weiXinUtils,
  userAuth as userInfoOperation,
  tree as treeOperation,
};
