// import React from 'react';
import { message } from 'suid';
import { setLocale } from 'umi-plugin-react/locale';
import { userInfoOperation } from '@/utils';
import fetchPolyfill from './fetchPolyfill';

const defaultLanguage = window.navigator.language;
const { setCurrentLocale, getCurrentLocale } = userInfoOperation;

if (!getCurrentLocale() && defaultLanguage) {
  if ('zh-CN'.includes(defaultLanguage)) {
    setLocale('zh-CN');
    setCurrentLocale('zh-CN');
  }

  if ('en-US'.includes(defaultLanguage)) {
    setLocale('en-US');
    setCurrentLocale('en-US');
  }
}

fetchPolyfill();
/** 默认配置message，最多弹出来一个，屏幕弹框吐丝现象 */
message.config({
  maxCount: 1,
});

if ('serviceWorker' in navigator) {
  // unregister service worker
  const { serviceWorker } = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then(sws => {
      sws.forEach(sw => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then(sw => {
    if (sw) sw.unregister();
  });

  // remove all caches
  if (window.caches && window.caches.keys) {
    caches.keys().then(keys => {
      keys.forEach(key => {
        caches.delete(key);
      });
    });
  }
}
