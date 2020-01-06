import React, { Component } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import { Spin } from 'antd';
import { noop } from 'lodash';

import styles from "./index.less";

let iframeId = "";

class Iframe extends Component {

  static propTypes = {
    /** iframe 加载成功后的回调函数 */
    onLoaded: propTypes.func,
    /** iframe src地址 */
    url: propTypes.string.isRequired,
    /** 是否显示这个iframe */
    visible: propTypes.bool.isRequired,
  };

  static defaultProps = {
    onLoaded: noop,
  };

  state = {
    loading: true,
  }

  refIframe = null

  setIframeRef = ref => {
    this.refIframe = ref;
  }

  reload = () => {
    this.refIframe.contentWindow.location.reload(true);
  }

  handleLoaded = () => {
    const { onLoaded, url } = this.props;
    this.setState({ loading: false }, () => {
      onLoaded(url);
    });
  }

  handlePostMessage = e => {
    const { history, onLogout } = this.props;

    if (
      e.origin === window.location.origin &&
      typeof e.data === 'object' &&
      e.data.constructor === Object
    ) {
      const { type, path } = e.data;

      switch (type) {
        case 'reload':
          console.log(`Post message reload: ${window.location}`);
          window.location.reload(true);
          break;
        case 'redirect':
          console.log(`Post message redireact: ${path}`);
          history.push(path);
          break;
        case 'logout':
          console.log(`Post message logout: ${window.location}`);
          onLogout(false);
          break;
        default:
          break;
      }
    }
  }

  componentDidMount() {
    window.addEventListener('message', this.handlePostMessage);
  }

  conponentWillUnmount() {
    window.removeEventListener('message', this.handlePostMessage);
  }

  render() {
    const { url = '', visible } = this.props;
    const { loading } = this.state;

    const className = classNames({
      [styles['iframe-wrap']]: true,
      [styles['iframe-wrap_hidden']]: !visible,
      [styles['iframe-wrap_loading']]: loading,
    });

    return (
      <div className={className}>
        {loading && (
          <Spin
            className="iframe-wrap-loading"
            size="large"
            tip={'加载中...'}
          />
        )}
        <iframe
          ref={this.setIframeRef}
          title={url}
          name={url}
          src={url}
          onLoad={this.handleLoaded}
          id={iframeId}
        />
      </div>
    );
  }
}

export default Iframe;
