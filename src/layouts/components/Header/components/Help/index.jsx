import React from 'react';
import { ExtIcon } from 'suid';
import { Tooltip } from 'antd';
import { userInfoOperation } from '@/utils';

const { getCurrentUser } = userInfoOperation;

export default class HelpCenter extends React.PureComponent {
  handleHelp = () => {
    const user = getCurrentUser();
    window.open(`/sei-help-web/#/sei-help-web/sso?_s=${user.sessionId}`);
  };

  render() {
    const { className } = this.props;

    return (
      <Tooltip title="在线帮助" className={className}>
        <span onClick={this.handleHelp}>
          <ExtIcon type="question-circle" style={{ fontSize: 16 }} antd />
        </span>
      </Tooltip>
    );
  }
}
