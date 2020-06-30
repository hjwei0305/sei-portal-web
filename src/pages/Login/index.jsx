import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import md5 from 'md5';
import { utils } from 'suid';
import { waterMark } from '@/utils';
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
                this.setState({
                  showVertifCode: true,
                });
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

  render() {
    const { loading, user } = this.props;
    const { verifyCode } = user;
    const { showTenant, showVertifCode } = this.state;
    const isLoading = loading.effects['user/userLogin'];

    return (
      <div className={styles['container-box']}>
        <div className="login-form-title">
          <span>{formatMessage({ id: 'login.title', desc: '账号登录' })}</span>
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
            onClick={this.login}
            className="login-form-button"
          >
            {!isLoading
              ? formatMessage({ id: 'login.login', desc: '登录' })
              : formatMessage({ id: 'login.loginning', desc: '登录中...' })}
          </Button>
        </LoginForm>
        <QrCode></QrCode>
      </div>
    );
  }
}
