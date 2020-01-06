import { getSubAppConfig } from '@/services/microFront';

/** 运行时配置文件 */
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};

export const qiankun = getSubAppConfig();
