/*
 * @Author: zp
 * @Date:   2020-01-29 20:03:21
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-28 16:43:35
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
 * @param  {Fun}   callback 回调函数
 * @param  {Array}  result 结果数组
 * @return {Array}        复制后的树
 */
export const traverseCopyTrees = (trees = [], callback, result = [], rootId = '') => {
  /** 没有回调函数，直接深copy一个树 */
  if (!callback) {
    return cloneDeep(trees);
  }

  for (let i = 0, len = trees.length; i < len; i += 1) {
    const tree = cloneDeep(trees[i]);
    if (!rootId) {
      tree.rootId = tree.id;
    } else {
      tree.rootId = rootId;
    }
    const menuTree = callback(tree) || tree;
    const { children } = menuTree;
    if (children && children.length) {
      menuTree.children = traverseCopyTrees(children, callback, [], menuTree.rootId);
    }
    result.push(menuTree);
  }

  return result;
};
