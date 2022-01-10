import { Icon, Menu, Dropdown } from 'antd';
import { formatMessage, getLocale, setLocale } from 'umi-plugin-react/locale';
import React from 'react';
import cls from 'classnames';
import { userInfoOperation } from '@/utils';

import styles from './index.less';

const { setCurrentLocale, getCurrentLocale } = userInfoOperation;

const SelectLang = props => {
  const { className } = props;
  const selectedLang = getCurrentLocale() || getLocale();
  const changeLang = ({ key }) => {
    setLocale(key);
    setCurrentLocale(key);
  };
  const locales = ['zh-CN', 'en-US'];
  const languageLabels = {
    'zh-CN': '简体中文',
    'en-US': 'English',
  };

  const languageIcons = {
    'zh-CN': '🇨🇳',
    'en-US': '🇺🇸',
  };
  const langMenu = (
    <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={changeLang}>
      {locales.map(locale => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown trigger={['click']} overlay={langMenu} className={cls(styles.trigger)}>
      <span className={cls(styles.dropDown, className)}>
        <Icon type="global" title={formatMessage({ id: 'app.lang', desc: '语种' })} />
        <span style={{ fontSize: 12 }}>{languageLabels[selectedLang]}</span>
        <Icon type="down" title={formatMessage({ id: 'app.lang', desc: '语种' })} />
      </span>
    </Dropdown>
  );
};

export default SelectLang;
