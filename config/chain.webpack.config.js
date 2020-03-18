/*
 * @Author: zp
 * @Date:   2020-01-06 10:45:03
 * @Last Modified by: zp
 * @Last Modified time: 2020-03-18 15:09:51
 */
const gitSha = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();
const SentryPlugin = require('@sentry/webpack-plugin');
const path = require('path');
process.env.RELEASE_VERSION = gitSha; //将记录赋值给RELEASE_VERSION

/**
 * 添加webpack配置
 * @param  {object} config
 */
export const webpackPlugin = config => {
  /** 处理webpack配置 */
  if (process.env.NODE_ENV === 'production') {
    config.plugin('sentry').use(SentryPlugin, [
      {
        release: process.env.RELEASE_VERSION,
        ignore: ['node_modules'],
        include: path.join(__dirname, '../dist/'),
        deleteAfterCompile: true,
        configFile: '../.sentryclirc', //配置文件地址
        urlPrefix: '~/sei-portal-web',
      },
    ]);
  }
};
