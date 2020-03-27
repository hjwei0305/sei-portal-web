import { utils } from 'suid';
import { notification } from 'antd';
import eventBus from './eventBus';

const { request } = utils;

/** 添加拦截器跳401到登录页面 */
request.interceptors.response.use(
  res => res,
  err => {
    if (err.statusCode === 401) {
      eventBus.emit('redirectLogin');
      notification.error({
        message: '会话异常',
        description: '当前会话超时或失效，请重新登录',
      });
    }
    return err;
  },
);

export default request;
