import React, { PureComponent } from 'react';
import { Dropdown } from 'antd';
import cls from 'classnames';
import styles from './index.less';

export default class HeaderDropdown extends PureComponent {
  render() {
    const { overlayClassName, ...props } = this.props;
    return <Dropdown overlayClassName={cls(styles.container, overlayClassName)} {...props} />;
  }
}
