const routes = [
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
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];

export default routes;
