import React, { Component } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import { Spin } from 'antd';
import { noop } from 'lodash';

import styles from './index.less';

class Iframe extends Component {
  refIframe = null;

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
    loading: false,
  };

  setIframeRef = ref => {
    this.refIframe = ref;
  };

  reload = () => {
    this.refIframe.contentWindow.location.reload(true);
  };

  handleLoaded = () => {
    const { onLoaded, url } = this.props;
    this.setState({ loading: false }, () => {
      onLoaded(url);
    });
  };

  render() {
    const { url = '', visible, key } = this.props;
    const { loading } = this.state;

    const className = classNames({
      [styles['iframe-wrap']]: true,
      [styles['iframe-wrap_hidden']]: !visible,
      [styles['iframe-wrap_loading']]: loading,
    });

    return (
      <div className={className}>
        {loading && <Spin className="iframe-wrap-loading" size="large" tip="加载中..." />}
        <iframe
          ref={this.setIframeRef}
          title={url}
          name={url}
          src={url}
          onLoad={this.handleLoaded}
          id={key}
        />
      </div>
    );
  }
}

export default Iframe;
