import { utils } from 'suid';

const { NODE_ENV } = process.env;

const { CONST_GLOBAL } = utils.constants;

export { CONST_GLOBAL };

export const HOST = '';

export const CONTEXTPATH = NODE_ENV === 'development' ? '/api-gateway' : '/api-gateway'; // '/api-gateway';

export const IS_DEVELOPMENT = NODE_ENV === 'development';

export const BASEURL = `${HOST}${CONTEXTPATH}`;

export const PORTALSERVICE = `/portal-service`;

export const SEIAUTHSERVICE = `${BASEURL}/sei-auth`;

export const BASICSERVICE = `${BASEURL}/sei-basic`;
export const NOTIFYSERVICE = `${BASEURL}/sei-notify`;
export const HELPSERVICE = `${BASEURL}/sei-help`;

export const COPYRIGHTTEXT =
  'Copyright 2015 www.changhong.com All Rights Reserved 四川长虹电器股份有限公司 版权所有';

/** 非菜单页面 */
export const NoMenuPages = [
  // {
  //   id: 'flow-homepage',
  //   url: '/sei-flow-web/homepage',
  //   title: '我的任务',
  //   noClosable: true,
  //   /** 激活刷新 */
  //   activedRefresh: true,
  // },
  {
    id: 'userProfile',
    title: '个人设置',
    url: '/sei-basic-web/userProfile',
    // closeActiveParentTab: true,
  },
];

export const RECENT_MENUS_KEY = 'recent_menus_by';

export const RECENT_APP_EKY = 'recent_app_by';
