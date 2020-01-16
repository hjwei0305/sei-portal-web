import React from 'react';
import { router } from 'umi';
import { userInfoOperation } from '@/utils';

const { getCurrentUser } = userInfoOperation;

export default props => {
  if (getCurrentUser()) {
    return <>{props.children}</>;
  }
  router.replace('/user/login');
  return null;
};
