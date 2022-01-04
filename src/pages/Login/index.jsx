import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import cls from 'classnames';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import md5 from 'md5';
import { utils, Animate } from 'suid';
import { waterMark } from '@/utils';
import SelectLang from '@/components/SelectLang';
import LoginForm from './Form';
import QrCode from './QrCode';
import styles from './index.less';

@connect(({ user, loading }) => ({ user, loading }))
@Form.create()
export default class Login extends Component {
  state = {
    showTenant: false,
    showVertifCode: false,
  };

  loginReqId = utils.getUUID();

  componentDidMount() {
    waterMark.removeWatermark();
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.login();
    }
  };

  login = e => {
    const { dispatch } = this.props;
    this.loginFormRef.onSubmit().then(values => {
      dispatch({
        type: 'user/userLogin',
        payload: { ...values, password: md5(values.password), reqId: this.loginReqId },
      }).then(res => {
        const { success, data } = res || {};
        if (success) {
          /** 多租户 */
          if (data.loginStatus === 'multiTenant') {
            this.setState({
              showTenant: true,
            });
          }
          /** 验证码 */
          if (data.loginStatus === 'captchaError') {
            dispatch({
              type: 'user/getVerifyCode',
              payload: {
                reqId: this.loginReqId,
              },
            }).then(result => {
              const { success: scs } = result || {};
              if (scs) {
                this.setState(
                  {
                    showVertifCode: true,
                  },
                  () => {
                    if (this.loginFormRef) {
                      this.loginFormRef.focusVerifyCodeInput();
                    }
                  },
                );
              }
            });
          }
        }
      });
    });
    if (e) {
      e.preventDefault();
    }
  };

  handleRetrievePwd = () => {
    router.push('/retrievePwd');
  };

  render() {
    const { loading, user } = this.props;
    const { verifyCode } = user;
    const { showTenant, showVertifCode } = this.state;
    const isLoading = loading.effects['user/userLogin'];

    return (
      <div className={styles['container-box']}>
        <div className={cls('form-logo', 'horizontal')}>
          <Animate type="fadeInLeft" delay={400}>
            U
          </Animate>
          <Animate type="tada" delay={800} duration={2000}>
            A
          </Animate>
          <Animate type="fadeInRight" delay={400}>
            P
          </Animate>
        </div>
        <div className="login-form-title vertical">
          <Animate type="flipInY" delay={600}>
            <div className="title">统一应用平台</div>
            <div className="desc">努力超越 追求卓越</div>
          </Animate>
        </div>
        <LoginForm
          onRef={inst => {
            this.loginFormRef = inst;
          }}
          loginReqId={this.loginReqId}
          verifyCode={verifyCode}
          loading={isLoading}
          showTenant={showTenant}
          showVertifCode={showVertifCode}
        >
          <Button
            loading={isLoading}
            type="primary"
            size="large"
            onClick={this.login}
            className="login-form-button"
          >
            {!isLoading
              ? formatMessage({ id: 'login.login', desc: '登录' })
              : formatMessage({ id: 'login.loginning', desc: '登录中...' })}
          </Button>
        </LoginForm>
        <div className="third-login">
          <QrCode />
        </div>
        <div className="tool-box">
          <Button type="link" className="forget-pwd" onClick={this.handleRetrievePwd}>
            <FormattedMessage id="app.login.forgot-password" defaultMessage="忘记密码?" />
          </Button>
          <SelectLang />
        </div>
      </div>
    );
  }
}
