import { Helmet } from 'react-helmet';
import React from 'react';
import logo from '../assets/logo@2x.png';
import styles from './LoginLayout.less';

const LoginLayout = props => {
  const { children } = props;

  return (
    <>
      <Helmet>
        <title>登录</title>
        <meta name="description" content="登录" />
      </Helmet>
      <div className={styles['login-wrapper']}>
        <div className="header-wrapper">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
        </div>
        <div className="content-wrapper">
          <div className="login-form">
            <div className="login-form-title">SEI账号登录</div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginLayout;
