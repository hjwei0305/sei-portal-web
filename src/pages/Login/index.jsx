import React, { Component } from 'react';
import { Form, Icon, Button, Input } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import md5 from 'md5';
import styles from './index.less';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({ user, loading }))
@Form.create()
export default class Login extends Component {
  state = {
    showTenant: false,
  };

  componentDidMount() {
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
    const { form, dispatch } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/userLogin',
          payload: { ...values, password: md5(values.password) },
        }).then(res => {
          const { success, data } = res || {};
          if (success) {
            if (data.loginStatus === 'multiTenant') {
              this.setState({
                showTenant: true,
              });
            } else {
              dispatch({
                type: 'user/getUserFeatures',
              });
            }
          }
        });
      }
    });
    if (e) {
      e.preventDefault();
    }
  };

  render() {
    const { errorMsg, form, loading } = this.props;
    const { getFieldDecorator } = form;
    const { showTenant } = this.state;
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
