import React, { Component } from 'react';

class QrCode extends Component {
  componentDidMount() {
    console.log(process.env);
    window.WwLogin({
      id: 'sei-qrcode',
      appid: 'wwdc99e9511ccac381',
      agentid: '1000003',
      redirect_uri: 'http%3A%2F%2Ftsei.changhong.com%3A8090%2Fapi-gateway%2Fsei-auth%2Fsso%2Flogin',
      state: '',
      href: `${window.host}/sei-portal-web/qrcode.css`,
    });
  }

  render() {
    return <div id="sei-qrcode" className="sei-qrcode-wrapper"></div>;
  }
}

export default QrCode;
