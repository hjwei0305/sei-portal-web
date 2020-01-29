import React from 'react';
import cls from 'classnames';
import { router } from 'umi';
import { connect } from 'dva';
import { Icon, Menu, Avatar } from 'antd';
import FullScreen from '@/components/FullScreen';
import MenuSearch from '@/components/MenuSearch';
import ExtDropdown from '@/components/ExtDropdown';
import { userInfoOperation } from '@/utils';
import ExtList from './components/List';

import styles from './index.less';

const { getCurrentUser } = userInfoOperation;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.currentUser = getCurrentUser();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/getMenus',
    });
  }

  handleUserMenuClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/userLogout',
    });
  };

  /** 获取个人下拉菜单项 */
  getDropdownMenus = () => {
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
          用户
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout" onClick={this.handleUserMenuClick}>
          <Icon type="logout" />
          退出
        </Menu.Item>
      </Menu>
    );

    return menu;
  };

  dropdownRender = () => {
    const { menu, dispatch } = this.props;
    const { menuTrees } = menu;

    return (
      <ExtList
        dataSource={menuTrees}
        selectable="false"
        onItemClick={currMenuTree => {
          dispatch({
            type: 'menu/toggleModule',
            payload: {
              currMenuTree,
            },
          });
        }}
      />
    );
  };

  handleHomeClick = () => {
    const { onHomeClick } = this.props;
    if (onHomeClick) {
      onHomeClick();
    }
  };

  render() {
    const { onCollapse, collapsed, children, menu } = this.props;
    const { allLeafMenus, currMenuTree, activedMenu } = menu;
    const activedKey = activedMenu ? activedMenu.id : '';

    return (
      <section className={cls(styles['header-layout'])}>
        <div
          style={{
            float: 'left',
          }}
        >
          <span
            className={cls('trigger')}
            onClick={() => {
              if (onCollapse) {
                onCollapse();
              }
            }}
          >
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </span>
          <ExtDropdown overlay={this.dropdownRender()} trigger={['click']}>
            <span className={cls('trigger')}>
              <span className="title">{currMenuTree ? currMenuTree.title : ''}</span>
              <Icon type="caret-down" style={{ fontSize: '12px', marginLeft: '4px' }} />
            </span>
          </ExtDropdown>
          <span
            className={cls({ trigger: true, trigger_active: !activedKey })}
            onClick={this.handleHomeClick}
          >
            <Icon type="home" theme="filled" size="14" />
          </span>
        </div>
        <div className={cls('header-layout-right')}>
          <MenuSearch
            className={cls('trigger')}
            data={allLeafMenus}
            onSelect={currMenu => {
              const { dispatch } = this.props;
              dispatch({
                type: 'menu/updateTabState',
                payload: {
                  activedMenu: currMenu,
                },
              }).then(() => router.push(currMenu.url));
            }}
          />
          <ExtDropdown overlay={this.getDropdownMenus()}>
            <span className={`${cls('action', 'account')} ${styles.account}`}>
              <Avatar icon="user" size="13" />
              <span className={cls('username')}>
                {this.currentUser && this.currentUser.userName}
              </span>
            </span>
          </ExtDropdown>
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

export default connect(({ menu }) => ({ menu }))(Header);
