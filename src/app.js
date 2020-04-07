import { notification } from 'antd';
import { getSubAppConfig } from '@/services/microFront';
import fetchPolyfill from './fetchPolyfill';

fetchPolyfill();
// import * as Sentry from '@sentry/browser';

// Sentry.init({
//   dsn: 'http://29bafdd4e03b4da49e57dfd97de78a9f@10.4.208.77:9000/5',
//   release: process.env.RELEASE_VERSION,
// });
/** 运行时配置文件 */
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      notification.error({
        message: '接口请求异常',
        description: err.message,
      });
    },
  },
};

export const qiankun = getSubAppConfig();
