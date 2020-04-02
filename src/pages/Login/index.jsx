import React, { Component } from 'react';
import { Form, Icon, Button, Input } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import md5 from 'md5';
import { utils } from 'suid';
import styles from './index.less';

const FormItem = Form.Item;
@connect(({ user, loading }) => ({ user, loading }))
@Form.create()
export default class Login extends Component {
  state = {
    showTenant: false,
    showVertifCode: false,
  };

  loginReqId = utils.getUUID();

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  handleVertify = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getVerifyCode',
      payload: {
        reqId: this.loginReqId,
      },
    });
  };

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.login();
    }
  };

  login = e => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
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
            // else {
            // dispatch({
            //   type: 'user/getUserFeatures',
            // });
            // }
          }
        });
      }
    });
    if (e) {
      e.preventDefault();
    }
  };

  render() {
    const { errorMsg, form, loading, user } = this.props;
    const { verifyCode } = user;
    const { getFieldDecorator } = form;
    const { showTenant, showVertifCode } = this.state;
    const isLoading = loading.effects['user/userLogin'];
    const colorStyle = { color: 'rgba(0,0,0,.25)' };
    const FormItemStyle = { margin: 0, color: 'red' };
    return (
      <Form className={styles['login-from-wrapper']}>
        {errorMsg ? (
          <FormItem style={FormItemStyle}>
            {getFieldDecorator('errMessage')(<span className="errMessage">{errorMsg}</span>)}
          </FormItem>
        ) : null}
        {showTenant ? (
          <FormItem>
            {getFieldDecorator('tenant', {
              rules: [{ required: true, message: '请输入租户账号!' }],
            })(
              <Input
                disabled={isLoading}
                prefix={<Icon type="user" style={colorStyle} />}
                placeholder="租户账号"
              />,
            )}
          </FormItem>
        ) : null}
        <FormItem>
          {getFieldDecorator('account', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'login.userName-invalid', desc: '请输入用户名!' }),
              },
            ],
          })(
            <Input
              disabled={isLoading}
              autoFocus="autofocus"
              prefix={<Icon type="user" style={colorStyle} />}
              placeholder={formatMessage({ id: 'login.userName' })}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'login.password-invalid', desc: '请输入密码!' }),
              },
            ],
          })(
            <Input
              disabled={isLoading}
              prefix={<Icon type="lock" style={colorStyle} />}
              type="password"
              placeholder={formatMessage({ id: 'login.password' })}
            />,
          )}
        </FormItem>
        {showVertifCode && verifyCode ? (
          <FormItem>
            {getFieldDecorator('verifyCode', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请输入验证码!',
                },
              ],
            })(
              <Input
                disabled={isLoading}
                prefix={<Icon type="code" style={colorStyle} />}
                placeholder="验证码"
                addonAfter={<img alt="验证码" onClick={this.handleVertify} src={verifyCode} />}
              />,
            )}
          </FormItem>
        ) : null}
        <FormItem>
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
        </FormItem>
        {/*
          <div>
            <a
              onClick={() => {
                const { handleFindPassword } = this.props;
                if (handleFindPassword) {
                  handleFindPassword();
                }
              }}
              style={{
                float: 'right',
              }}
            >
              {formatMessage({ id: 'login.forgot-password', desc: '忘记密码' })}
            </a>
          </div>
        */}
      </Form>
    );
  }
}
