import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ user, loading }) => ({ user, loading }))
class QrCode extends Component {
  componentDidMount() {
    const { user, dispatch } = this.props;
    const { qrConfig } = user;

    if (qrConfig) {
      window.WwLogin({
        id: 'sei-qrcode',
        ...qrConfig,
        // appid: '',
        // agentid: '',
        // redirect_uri: 'http%3A%2F%2Ftsei.changhong.com%3A8090%2Fapi-gateway%2Fsei-auth%2Fsso%2Flogin',
        // state: '',
        // href: `${window.location.origin}/sei-portal-web/qrcode.css`,
      });
    } else {
      dispatch({
        type: 'user/authorizeData',
      }).then(result => {
        const { success, data } = result || {};
        if (success) {
          window.WwLogin({
            id: 'sei-qrcode',
            ...data,
          });
        }
      });
    }
  }

  render() {
    return <div id="sei-qrcode" className="sei-qrcode-wrapper"></div>;
  }
}

export default QrCode;
