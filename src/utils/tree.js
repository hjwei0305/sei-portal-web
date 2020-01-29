/*
 * @Author: zp
 * @Date:   2020-01-29 20:03:21
 * @Last Modified by:   zp
 * @Last Modified time: 2020-01-29 20:49:17
 */
import { cloneDeep } from 'lodash';

/** 获取树的所有叶子结点 */
export const getTreeLeaf = (trees = [], result = []) => {
  for (let i = trees.length - 1; i >= 0; i -= 1) {
    const item = trees[i];
    if (item.children && item.children.length) {
      getTreeLeaf(item.children, result);
    } else {
      result.push(item);
    }
  }

  return result;
};

/**
 * 遍历复制树
 * @param  {Array} trees  菜单树
 * @param  {Array}  result 结果数组
 * @return {Array}        复制后的树
 */
export const traverseCopyTrees = (trees = [], callback, result = []) => {
  /** 没有回调函数，直接深copy一个树 */
  if (!callback) {
    return cloneDeep(trees);
  }

  for (let i = 0, len = trees.length; i < len; i += 1) {
    const tree = cloneDeep(trees[i]);
    const menuTree = callback(tree) || tree;
    const { children } = menuTree;
    if (children && children.length) {
      menuTree.children = traverseCopyTrees(children, callback, []);
    }
    result.push(menuTree);
  }

  return result;
};
