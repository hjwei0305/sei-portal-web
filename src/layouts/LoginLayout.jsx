import React from 'react';
import { Helmet } from 'react-helmet';
import { formatMessage } from 'umi-plugin-react/locale';
import { getLoginPageConfig } from '@/services/config';
import SelectLang from './components/Header/components/SelectLang';
import defaultLogo from '../assets/logonew@2x.png';
import defaultLoginBackgroundImg from '../assets/login_background@2x.png';
import styles from './LoginLayout.less';

class LoginLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgi: defaultLoginBackgroundImg,
      logo: defaultLogo,
    };
  }

  componentDidMount() {
    getLoginPageConfig().then(res => {
      const { success, data } = res;
      if (success) {
        const { bgi, loginLogo } = data;
        this.setState({
          bgi,
          logo: loginLogo,
        });
      }
    });
  }

  render() {
    const { children } = this.props;
    const { bgi, logo } = this.state;

    return (
      <>
        <Helmet>
          <title>{formatMessage({ id: 'login.login', desc: '登录' })}</title>
          <meta name="description" content={formatMessage({ id: 'login.login', desc: '登录' })} />
        </Helmet>
        <div
          className={styles['login-wrapper']}
          style={{
            backgroundImage: `url(${bgi})`,
          }}
        >
          <div className="header-wrapper">
            <div className="lang-wrapper">
              <SelectLang />
            </div>
            <div className="logo">{logo ? <img src={logo} alt="logo" /> : null}</div>
          </div>
          <div className="content-wrapper">
            <div className="login-form">{children}</div>
          </div>
        </div>
      </>
    );
  }
}

export default LoginLayout;
