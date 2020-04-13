/*
 * @Author: zp
 * @Date: 2020-04-13 15:01:55
 * @Last Modified by:   zp
 * @Last Modified time: 2020-04-13 15:01:55
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { ExtModal, utils } from 'suid';
import { Button } from 'antd';
import md5 from 'md5';
import { userInfoOperation } from '@/utils';

import LoginForm from './Form';

const { getCurrentUser } = userInfoOperation;

@connect(({ user, loading }) => ({ user, loading }))
export class ConfirmLoginModal extends Component {
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

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.handleQuickLogin();
    }
  };

  handleVertify = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getVerifyCode',
      payload: {
        reqId: this.loginReqId,
      },
    });
  };

  handleQuickLogin = e => {
    const { dispatch, afterSuccess } = this.props;
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
          if (data.loginStatus === 'success') {
            dispatch({
              type: 'menu/updateState',
              payload: {
                loginVisible: false,
              },
            }).then(() => {
              if (afterSuccess) {
                afterSuccess();
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

  handleReLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateState',
      payload: {
        loginVisible: false,
      },
    }).then(() => {
      router.replace('/user/login');
    });
  };

  render() {
    const { loading, user, visible } = this.props;
    const { verifyCode } = user;
    const { showTenant, showVertifCode } = this.state;
    const isLoading = loading.effects['user/quickLogin'];
    const userInfo = getCurrentUser();
    console.log('ConfirmLoginModal -> render -> userInfo', userInfo);
    const { account, tenantCode } = userInfo || {};

    return (
      <ExtModal title="过期登录" closable={false} footer={null} visible={visible}>
        <LoginForm
          onRef={inst => {
            this.loginFormRef = inst;
          }}
          verifyCode={verifyCode}
          loading={isLoading}
          showTenant={showTenant}
          showVertifCode={showVertifCode}
          account={account}
          tenantCode={tenantCode}
        >
          <div style={{ float: 'right' }}>
            <Button loading={isLoading} onClick={this.handleReLogin} style={{ marginRight: 10 }}>
              重新登录
            </Button>
            <Button loading={isLoading} type="primary" onClick={this.handleQuickLogin}>
              快速登录
            </Button>
          </div>
        </LoginForm>
      </ExtModal>
    );
  }
}

export default ConfirmLoginModal;
