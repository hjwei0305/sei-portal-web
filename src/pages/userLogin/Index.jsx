import React, { Component } from 'react';
import { Form, Icon, Button, Input } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { login } from './service';
import styles from './index.less';

const FormItem = Form.Item;

class LoginForm extends Component {
  state = {
    loading: false,
    errorMsg: '',
  }

  login = (e) => {
    const { form, history } = this.props;
    this.setState({
      loading: true,
    });
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        login(values).then((result) => {
          const { success, message, } = result;
          if (success) {
            history.push('/');
          } else {
            this.setState({
              errorMsg: message,
            });
          }
        }).finally((_) => {
          this.setState({
            loading: false,
          });
        });
      }
    });
    e && e.preventDefault();
  }

  render() {
    const { errorMsg, form, showTenant } = this.props;
    const { loading } = this.state;
    const { getFieldDecorator } = form;
    const colorStyle = { color: 'rgba(0,0,0,.25)' };
    const FormItemStyle = {  margin: 0, color: 'red' };
    return (
      <Form className={styles['login-from-wrapper']}>
        {errorMsg ? (
          <FormItem style={FormItemStyle}>
            {getFieldDecorator('errMessage')(
              <span className='errMessage'>{errorMsg}</span>
            )}
          </FormItem>
        ) : null}
        {showTenant ? (
          <FormItem>
            {getFieldDecorator('tenantCode', {
              rules: [{required: false, message: '请输入租户账号!'}]
            })(
              <Input
                disabled={loading}
                prefix={<Icon type="user" style={colorStyle}/>}
                placeholder="租户账号"
              />
            )}
          </FormItem>
        ) : null}
        <FormItem>
          {getFieldDecorator('account', {
            initialValue: '',
            rules: [{required: true, message: '请输入用户名!'}]
          })(
            <Input
              disabled={loading}
              autoFocus="autofocus"
              prefix={<Icon type="user" style={colorStyle} />}
              placeholder={formatMessage({ id: 'user-login.login.userName' })}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            initialValue: '',
            rules: [{required: true, message: '请输入密码!'}]
          })(
            <Input
              disabled={loading}
              prefix={<Icon type="lock" style={colorStyle} />}
              type="password"
              placeholder={formatMessage({ id: 'user-login.login.password' })}
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            loading={loading}
            type="primary"
            onClick={this.login}
            className="login-form-button"
          >
            {!loading ? '登录' : '登录中'}
          </Button>
        </FormItem>
        <div>
          <a
            onClick={() => {
              const { handleFindPassword } = this.props;
              handleFindPassword && handleFindPassword();
            }}
            style={{
              float: 'right',
            }}
          >
            找回密码
          </a>
        </div>
      </Form>
    );
  }
}

export default Form.create({})(LoginForm);
