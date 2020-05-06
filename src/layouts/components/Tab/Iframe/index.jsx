import React, { Component } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
// import { Spin } from 'antd';
import { PageLoader } from 'suid';
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
    /** id */
    id: propTypes.string,
    /** 标题 */
    title: propTypes.string,
  };

  static defaultProps = {
    onLoaded: noop,
    id: '',
    title: '',
  };

  state = {
    loading: true,
  };

  componentWillUnmount() {
    if (this.refIframe && this.refIframe.contentWindow) {
      this.refIframe.contentWindow.document.write('');
      this.refIframe.contentWindow.document.clear();
    }
    this.refIframe = null;
  }

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
    const { url = '', visible, id, title } = this.props;
    const { loading } = this.state;

    const className = classNames({
      [styles['iframe-wrap']]: true,
      [styles['iframe-wrap_hidden']]: !visible,
      [styles['iframe-wrap_loading']]: loading,
    });

    return (
      <div className={className}>
        {loading && <PageLoader className="iframe-wrap-loading" size="large" tip="加载中..." />}
        <iframe
          ref={this.setIframeRef}
          title={title}
          src={url}
          onLoad={this.handleLoaded}
          id={id}
        />
      </div>
    );
  }
}

export default Iframe;
