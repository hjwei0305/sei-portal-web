const routes = [
  {
    path: '/sso',
    routes: [
      {
        name: 'socialAccount',
        path: '/sso/socialAccount',
        component: './SocialAccount',
      },
      {
        name: 'ssoWrapperPage',
        path: '/sso/ssoWrapperPage',
        component: './Sso',
      },
      {
        name: 'wxTurnPage',
        path: '/sso/wxTurnPage',
        component: './WxTurnPage',
      },
      {
        name: 'subPageTurnPage',
        path: '/sso/subPageTurnPage',
        component: './SubAppPageTurnPage',
      },
    ],
  },
  {
    path: '/user',
    component: '../layouts/TempLoginLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './Login',
      },
    ],
  },
  {
    name: 'updatePwd',
    path: '/updatePwd',
    component: './UpdatePassword',
  },
  {
    name: 'retrievePwd',
    path: '/retrievePwd',
    component: './RetrievePwd',
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['./src/components/PrivateRoute'],
    routes: [
      {
        path: '/',
        redirect: '/DashBoard',
      },
      {
        path: '/DashBoard',
        name: 'DashBoard',
        component: './DashBoard',
      },
    ],
  },
];

export default routes;
