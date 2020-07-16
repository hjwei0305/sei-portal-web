import React from 'react';
import { ExtIcon } from 'suid';
import { Tooltip } from 'antd';
import DialogBox from './components/DialogBox';

export default class Robot extends React.PureComponent {
  state = {
    visible: false,
  };

  handleQuestion = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const { className } = this.props;
    const { visible } = this.state;

    return (
      <>
        <Tooltip title="智多星" className={className}>
          <span onClick={this.handleQuestion}>
            <ExtIcon type="robot" style={{ fontSize: 16 }} antd />
          </span>
        </Tooltip>
        <DialogBox
          visible={visible}
          onClose={() => {
            this.setState({
              visible: false,
            });
          }}
        ></DialogBox>
      </>
    );
  }
}
