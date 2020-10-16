import React, { PureComponent } from 'react';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Helmet } from 'react-helmet';
import SelectLang from './components/Header/components/SelectLang';
import defaultLogo from '../assets/logonew@2x.png';
import { CONSTANTS } from '@/utils';
import styles from './TempLoginLayout.less';

const { LOCAL_PATH } = CONSTANTS;

export class TempLoginLayout extends PureComponent {
  render() {
    const { children } = this.props;
    return (
      <>
        <Helmet>
          <title>{formatMessage({ id: 'login.login', desc: '登录' })}</title>
          <meta name="description" content={formatMessage({ id: 'login.login', desc: '登录' })} />
        </Helmet>
        <div
          className="canvas-an"
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        >
          <iframe
            title="dynamic-point"
            frameBorder="0"
            src={`${LOCAL_PATH}/ani/index.html`}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className={styles['login-box']}>
          <div className="main-wrapper">
            <div className={cls('logo')}>
              <img src={defaultLogo} alt="" />
            </div>
            <div className={cls('lang-wrapper')}>
              <SelectLang />
            </div>
            <div className={cls('form-box')}>{children}</div>
          </div>
        </div>
      </>
    );
  }
}

export default TempLoginLayout;
