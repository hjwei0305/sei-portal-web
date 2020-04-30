import { Helmet } from 'react-helmet';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from './components/Header/components/SelectLang';
import logo from '../assets/logonew@2x.png';
import styles from './LoginLayout.less';

const LoginLayout = props => {
  const { children } = props;

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: 'login.login', desc: '登录' })}</title>
        <meta name="description" content={formatMessage({ id: 'login.login', desc: '登录' })} />
      </Helmet>
      <div className={styles['login-wrapper']}>
        <div className="header-wrapper">
          <div className="lang-wrapper">
            <SelectLang />
          </div>
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
        </div>
        <div className="content-wrapper">
          <div className="login-form">{children}</div>
        </div>
      </div>
    </>
  );
};

export default LoginLayout;
