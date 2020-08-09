import React from 'react';
import { ExtIcon } from 'suid';
import { Tooltip } from 'antd';
import { screenCapture } from '@/utils';

export default class HelpCenter extends React.PureComponent {
  handleCapture = () => {
    screenCapture();
  };

  render() {
    const { className } = this.props;

    return (
      <Tooltip title="截屏" className={className}>
        <span onClick={this.handleCapture}>
          <ExtIcon type="picture" style={{ fontSize: 16 }} antd />
        </span>
      </Tooltip>
    );
  }
}
