import React, { Component } from 'react';
import { connect } from 'dva';
import webChatBase64 from '@/assets/wechat.logo.png';

@connect(({ user, loading }) => ({ user, loading }))
class QrCode extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/authorizeData',
    });
  }

  handleClick = () => {
    const { user } = this.props;
    const { qrConfig } = user;
    if (qrConfig) {
      const { appid, agentid, redirect_uri: redirectUri, state } = qrConfig;
      const qstr = `?appid=${appid}&agentid=${agentid}&redirect_uri=${redirectUri}&state=${state}`;
      window.open(`https://open.work.weixin.qq.com/wwopen/sso/qrConnect${qstr}`, '_self');
    }
  };

  render() {
    return (
      <a onClick={this.handleClick} className="sei-qrcode-wrapper">
        <img alt="企业微信图标" src={webChatBase64} />
        <span>企业微信</span>
      </a>
    );
  }
}

export default QrCode;
