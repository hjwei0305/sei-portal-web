import React from 'react';
import propTypes from 'prop-types';
import Iframe from '../Iframe';

class TabPane extends React.Component {

  static propTypes = {
    /** tabpane 数据 */
    data: propTypes.arrayOf(propTypes.shape({
      /** 页签id */
      id: propTypes.string,
      /** 页签名称 */
      title: propTypes.string,
      /** 页签url地址 */
      url: propTypes.string
    })).isRequired,
    /** 当前正在展示的iframe */
    activedKey: propTypes.string.isRequired,
  };

  ref = {}

  reload = id => {
    if (this.ref[id]) {
      this.ref[id].reload();
    }
  };

  renderIframes() {
    const { data = [], activedKey } = this.props;

    return data.map(({ url, id }) => {
      const temp = url.split('/');

      return (
        <Iframe
          url={`/${temp[1]}/#${url}`}
          key={id}
          ref={ref => {
            this.ref[id] = ref;
          }}
          visible={activedKey === id}
        />
      );
    });
  }

  render() {
    const { style } = this.props;
    return (
      <div style={{
        position: 'relative',
        display: 'flex',
        height: '100%',
        ...style,
      }}>
        {this.renderIframes()}
      </div>
    );
  }
}

export default TabPane;
