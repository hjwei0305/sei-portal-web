import React, { Component } from 'react';
import { message } from 'suid';
import { getWeChatCfg } from '@/services/user';
import withUrlQs from '@/components/withUrlQs';

@withUrlQs
class WxTurnPage extends Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    const { urlQsObj } = this.props;
    if (urlQsObj.sid) {
      getWeChatCfg()
        .then(result => {
          const { success, data, message: msg } = result || {};
          if (success) {
            const { corpid, signature, nonceStr, timestamp, url } = data;
            window.wx.config({
              beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: corpid, // 必填，企业微信的corpID
              timestamp, // 必填，生成签名的时间戳
              nonceStr, // 必填，生成签名的随机串
              signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
              jsApiList: ['openDefaultBrowser'], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
            });
            window.wx.ready(() => {
              window.wx.invoke(
                'openDefaultBrowser',
                {
                  url: `${url}#/sso/ssoWrapperPage?sid=${urlQsObj.sid}`, // 在默认浏览器打开redirect_uri，并附加code参数；也可以直接指定要打开的url，此时不会附带上code参数。
                },
                res => {
                  // eslint-disable-next-line no-console
                  if (res.err_msg === 'openDefaultBrowser:ok') {
                    window.wx.closeWindow();
                    window.close();
                  }
                },
              );
            });
          } else {
            message.warn(msg);
          }
        })
        .catch(err => {
          const { message: msg } = err || {};
          message.error(msg);
        });
    } else {
      message.error('您没有权限');
    }
  }

  render() {
    const { loading } = this.state;

    return (
      <div>
        {loading ? (
          <span>正在使用默认浏览器打开应用</span>
        ) : (
          <span>加载完成，请在浏览器上查看相关信息…</span>
        )}
      </div>
    );
  }
}

export default WxTurnPage;
