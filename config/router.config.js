const routes = [
// {
//     path: '/user',
//     component: '../layouts/LoginLayout',
//     routes: [
//       {
//         name: 'login',
//         path: '/user/login',
//         component: './userLogin',
//       },
//     ],
//   },
//   {
//     path: '/',
//     component: '../layouts/BasicLayout',
//     routes: [
//       {
//         path: '/',
//         redirect: '/DashBoard',
//       },
//       {
//         path: '/DashBoard',
//         name: 'DashBoard',
//         component: './DashBoard',
//       },
//       {
//         component: './DashBoard',
//         // component: './404',
//       },
//     ],
//   },
  {
    path: '/user',
    component: './DashBoard',
    // component: './404',
  },
];

export default routes;
