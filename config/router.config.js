const routes = [
  {
    path: '/sso',
    // component: '../layouts/LoginLayout',
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
    ],
  },
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './Login',
      },
    ],
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
