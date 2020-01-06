export default {
  "/api-mock": {
    target: 'http://rddgit.changhong.com:7300/mock/5dfc741736608e42d52b1d7b',
    changeOrigin: true,
    pathRewrite: { "^/api-mock" : "" }
  },
};
