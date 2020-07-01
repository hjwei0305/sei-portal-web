/*
 * @Author: zp
 * @Date: 2020-03-11 16:46:55
 * @Last Modified by: zp
 * @Last Modified time: 2020-07-01 10:28:20
 */
import React from 'react';
import { router } from 'umi';
import { userInfoOperation } from '@/utils';
import SentryBoundary from '../SentryBoundary';

const { getCurrentUser } = userInfoOperation;

export default props => {
  if (getCurrentUser()) {
    return <SentryBoundary>{props.children}</SentryBoundary>;
  }
  router.replace('/user/login');
  return null;
};
