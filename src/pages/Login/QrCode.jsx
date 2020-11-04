import React, { Component } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { Avatar, Tooltip } from 'antd';
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
        <Tooltip title={<FormattedMessage id="app.login.wechat" defaultMessage="企业微信登录" />}>
          <Avatar src={webChatBase64} size={28} />
        </Tooltip>
      </a>
    );
  }
}

export default QrCode;
