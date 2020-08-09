import React from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Icon } from 'antd';
import FullScreen from '@/components/FullScreen';
import SelectModule from './components/SelectModule';
// import CaptureScreen from './components/CaptureScreen';
import UserIcon from './components/UserIcon';
import Notify from './components/Notify';
// import Help from './components/Help';
import Robot from './components/Robot';

import styles from './index.less';

@connect(({ menu }) => ({ menu }))
export default class Header extends React.Component {
  handleHomeClick = () => {
    const { onHomeClick } = this.props;
    if (onHomeClick) {
      onHomeClick();
    }
  };

  render() {
    const { children, menu } = this.props;
    const { activedMenu } = menu;
    const activedKey = activedMenu ? activedMenu.id : '';

    return (
      <section className={cls(styles['header-layout'])}>
        <div
          style={{
            float: 'left',
          }}
        >
          <SelectModule />
          <span
            className={cls({ trigger: true, trigger_active: !activedKey })}
            onClick={this.handleHomeClick}
          >
            <Icon type="home" size="14" />
          </span>
        </div>
        <div className={cls('header-layout-right')}>
          {/* <CaptureScreen className={cls('trigger')} /> */}
          <Robot className={cls('trigger')} />
          {/* <Help className={cls('trigger')} /> */}
          <Notify className={cls('trigger')} />
          <UserIcon />
          <FullScreen className={cls('trigger')} />
        </div>
        <div
          style={{
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </section>
    );
  }
}
