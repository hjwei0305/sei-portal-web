export const getLoginPageConfig = () =>
  new Promise(resolve => {
    resolve({
      success: true,
      data: {
        bgi: 'http://10.4.208.86:8100/sei-portal-web/static/login_background@2x.7595a9fe.png',
        loginLogo: 'http://10.4.208.86:8100/sei-portal-web/static/logonew@2x.d8cf732c.png',
      },
    });
  });
