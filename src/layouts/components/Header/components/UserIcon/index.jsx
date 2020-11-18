import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get, cloneDeep } from 'lodash';
import { Icon, Menu, Avatar } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import ExtDropdown from '@/components/ExtDropdown';
import { userInfoOperation, CONSTANTS } from '@/utils';
import { Driver, steps } from '../../../Guide';

import styles from './index.less';

const { NoMenuPages } = CONSTANTS;
const { getCurrentUser } = userInfoOperation;

@connect(() => ({}))
export default class UserIcon extends React.Component {
  constructor(props) {
    super(props);
    this.currentUser = getCurrentUser();
    console.log(this.currentUser);
  }

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/userLogout',
    });
  };

  handleSetting = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openTab',
      payload: {
        activedMenu: cloneDeep(NoMenuPages[0]),
      },
    });
    // .then(({ activedMenu }) => {
    //   router.push(activedMenu.url);
    // });
  };

  handlerDashboardCustom = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openTab',
      payload: {
        activedMenu: {
          id: 'my-dashboard-home',
          title: '自定义首页',
          url: '/sei-dashboard-web/scene/myHome',
        },
      },
    });
  };

  handleGuilde = () => {
    this.guide = new Driver({
      doneBtnText: '完成', // Text on the final button
      closeBtnText: '关闭', // Text on the close button for this step
      nextBtnText: '下一个 →', // Next button text for this step
      prevBtnText: '← 上一个',
      padding: 0,
      overlayClickNext: true,
    });
    this.guide.defineSteps(steps);
    this.guide.start();
  };

  dropdownRender = () => {
    const menu = (
      <Menu selectedKeys={[]} className={cls(styles['user-menu-item'])}>
        <Menu.Item key="setting" onClick={this.handleSetting}>
          <Icon type="setting" />
          个人设置
        </Menu.Item>
        <Menu.Item key="my-dashboard-home" onClick={this.handlerDashboardCustom}>
          <Icon type="home" />
          {formatMessage({ id: 'app.dashboard.custom', desc: '自定义首页' })}
        </Menu.Item>
        <Menu.Item key="user-guide" onClick={this.handleGuilde}>
          <Icon type="question-circle" />
          新手引导
        </Menu.Item>
        <Menu.Item key="logout" onClick={this.handleClick}>
          <Icon type="logout" />
          {formatMessage({ id: 'app.logout', desc: '退出' })}
        </Menu.Item>
      </Menu>
    );

    return menu;
  };

  render() {
    return (
      <ExtDropdown overlay={this.dropdownRender()} trigger={['click']}>
        <span id="user-icon-wrapper" className={cls(styles['user-icon-wrapper'], 'trigger')}>
          <Avatar
            icon={<img alt="" src={get(this.currentUser, 'preferences.portrait')} />}
            size="13"
          />
          <span className={cls('username')}>{this.currentUser && this.currentUser.userName}</span>
        </span>
      </ExtDropdown>
    );
  }
}
