import { request, } from '@/utils';

export const getSubAppConfig = () => {
  /** 获取子应用注册表 */
  return request.get('/apps.config.json').then(res => {
    // const reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\? i)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/;
    const { success, data } = res || {};
    let apps = [];
    if (success) {
      apps= data.map(item => {
        // if (!reg.test(item.entry)) {
        //   item.entry = window.location.origin + item.entry;
        // }
        return item;
      });
    }

    return {
      apps,
      defer: true,
      // 是否启用 js 沙箱，默认为 false
      jsSandbox: false,
      prefetch: true,
      lifeCycles: {
        afterMount: props => {
          /** todo */
        },
      },
    };
  }).catch(err => {
    return {
      apps: [],
      defer: true,
      jsSandbox: false,
      prefetch: true,
      lifeCycles: {
        afterMount: props => {
          /** todo */
        },
      },
    };
  });
}
