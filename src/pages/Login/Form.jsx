import React, { Component } from 'react';
import { Form, Icon, Input } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

const FormItem = Form.Item;

@connect(() => ({}))
@Form.create()
class LoginForm extends Component {
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  onSubmit = () => {
    const { form } = this.props;
    return new Promise((resolve, reject) => {
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          resolve(values);
        }
        reject(err);
      });
    });
  };

  handleVertify = () => {
    const { dispatch, loginReqId } = this.props;
    dispatch({
      type: 'user/getVerifyCode',
      payload: {
        reqId: loginReqId,
      },
    });
  };

  focusVerifyCodeInput = () => {
    if (this.verifyCodeInputRef) {
      const input = document.getElementById('verifyCode');
      if (input) {
        input.focus();
        input.select();
      }
    }
  };

  render() {
    const {
      loading,
      verifyCode,
      form,
      errorMsg,
      children,
      showTenant,
      showVertifCode,
      tenantCode,
      account,
    } = this.props;
    const { getFieldDecorator } = form;
    const colorStyle = { color: 'rgba(0,0,0,.25)' };
    const FormItemStyle = { margin: 0, color: 'red' };

    return (
      <Form className="login-from-wrapper">
        {errorMsg ? (
          <FormItem style={FormItemStyle}>
            {getFieldDecorator('errMessage')(<span className="errMessage">{errorMsg}</span>)}
          </FormItem>
        ) : null}
        {showTenant ? (
          <FormItem>
            {getFieldDecorator('tenant', {
              initialValue: tenantCode,
              rules: [{ required: true, message: '请输入租户账号!' }],
            })(
              <Input
                disabled={loading || !!tenantCode}
                prefix={<Icon type="user" style={colorStyle} />}
                placeholder="租户账号"
              />,
            )}
          </FormItem>
        ) : null}
        <FormItem>
          {getFieldDecorator('account', {
            initialValue: account,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'login.userName-invalid', desc: '请输入用户名!' }),
              },
            ],
          })(
            <Input
              disabled={loading || !!account}
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
              disabled={loading}
              prefix={<Icon type="lock" style={colorStyle} />}
              type="password"
              placeholder={formatMessage({ id: 'login.password' })}
            />,
          )}
        </FormItem>
        {showVertifCode ? (
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
                disabled={loading}
                ref={inst => (this.verifyCodeInputRef = inst)}
                allowClear
                autoFocus
                prefix={<Icon type="code" style={colorStyle} />}
                placeholder="验证码"
                addonAfter={<img alt="验证码" onClick={this.handleVertify} src={verifyCode} />}
              />,
            )}
          </FormItem>
        ) : null}
        <FormItem>{children}</FormItem>
      </Form>
    );
  }
}

export default LoginForm;
