import React, { PureComponent } from 'react';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Helmet } from 'react-helmet';
import SelectLang from './components/Header/components/SelectLang';
import defaultLogo from '../assets/logonew@2x.png';
import defaultLoginBackgroundImg from '../assets/login_background@2x.png';

import styles from './TempLoginLayout.less';

export class TempLoginLayout extends PureComponent {
  render() {
    const { children } = this.props;
    const accountFormWrapperWidth = '360px';

    return (
      <>
        <Helmet>
          <title>{formatMessage({ id: 'login.login', desc: '登录' })}</title>
          <meta name="description" content={formatMessage({ id: 'login.login', desc: '登录' })} />
        </Helmet>
        <div
          className={styles['login-page']}
          style={{
            backgroundImage: `url(${defaultLoginBackgroundImg})`,
          }}
        >
          <div className={cls('logo')}>
            <img src={defaultLogo} alt="" />
          </div>
          <div className={cls('lang-wrapper')}>
            <SelectLang />
          </div>
          <div className={cls('account-pane-wrapper')}>
            <div
              className={cls('account-banner')}
              style={{
                right: accountFormWrapperWidth,
              }}
            ></div>
            <div
              className={cls('account-form-wrapper')}
              style={{
                width: accountFormWrapperWidth,
              }}
            >
              <div className={cls('form-box')}>{children}</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default TempLoginLayout;
