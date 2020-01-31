import { request } from '@/utils';

export const getSubAppConfig = () =>
  /** 获取子应用注册表 */
  request
    .get(`/apps.config.json?random=${new Date().getTime()}`)
    .then(res => {
      const { success, data } = res || {};
      let apps = [];
      if (success) {
        apps = data.map(item => item);
      }

      return {
        apps,
        defer: true,
        // 是否启用 js 沙箱，默认为 false
        jsSandbox: false,
        prefetch: true,
        // lifeCycles: {
        //   afterMount: props => {
        //     /** todo */
        //   },
        // },
      };
    })
    .catch(() => ({
      apps: [],
      defer: true,
      jsSandbox: false,
      prefetch: true,
      // lifeCycles: {
      //   afterMount: props => {
      //     /** todo */
      //   },
      // },
    }));
