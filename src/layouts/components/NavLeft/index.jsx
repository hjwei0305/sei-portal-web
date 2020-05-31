import React, { Fragment } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'umi';
import { ScrollBar } from 'suid';
import cls from 'classnames';
import { isEqual } from 'lodash';
import MenuSearch from '@/components/MenuSearch';
import logo from '../../../assets/logo.svg';
import collapsedLogo from '../../../assets/logo_notxt@2x.png';

import styles from './index.less';

const { SubMenu } = Menu;

class NavLeft extends React.Component {
  constructor(props) {
    super(props);
    const { activedMenuKey, menuConfig } = props;

    this.state = {
      currentSelectedKeys: [activedMenuKey],
      openKeys: this.getInitOpenKeys(menuConfig),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { activedMenuKey, menuConfig } = this.props;
    if (activedMenuKey !== nextProps.activedMenuKey) {
      this.updateCurrentSelected(nextProps.activedMenuKey);
    }
    if (!isEqual(menuConfig, nextProps.menuConfig)) {
      this.setState({
        openKeys: this.getInitOpenKeys(nextProps.menuConfig),
      });
    }
  }

  getInitOpenKeys = menuConfig => {
    if (menuConfig && menuConfig.length) {
      return [menuConfig[0].id];
    }
    return null;
  };

  handleMenuClick = item => {
    const { onMenuClick } = this.props;
    this.updateCurrentSelected(item.id);
    if (onMenuClick) {
      onMenuClick(item);
    }
  };

  handleLogoClick = () => {
    const { onLogoClick } = this.props;
    if (onLogoClick) {
      onLogoClick();
    }
  };

  updateCurrentSelected = key => {
    this.setState({
      currentSelectedKeys: [key],
    });
  };

  getMenuNavItemByMode = item => {
    const { mode } = this.props;
    if (mode !== 'iframe') {
      return (
        <Link to={item.url}>
          {item.iconType ? <Icon type={item.iconType} /> : null}
          <span>{item.title}</span>
        </Link>
      );
    }
    return (
      <span>
        {item.iconType ? <Icon type={item.iconType} /> : null}
        <span>{item.title}</span>
      </span>
    );
  };

  // 递归渲染树形菜单
  renderMenu = data =>
    data.map(item => {
      if (item.children && item.children.length) {
        const title = (
          <span>
            {item.iconType ? <Icon type={item.iconType} /> : <Icon type="profile" />}
            <span>{item.title}</span>
          </span>
        );

        return (
          <SubMenu title={title} key={item.id}>
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      }

      return (
        <Menu.Item
          title={item.title}
          key={item.id}
          onClick={() => {
            this.handleMenuClick(item);
          }}
        >
          {this.getMenuNavItemByMode(item)}
        </Menu.Item>
      );
    });

  render() {
    const { currentSelectedKeys, openKeys } = this.state;
    const { collapsed, menuConfig = [], allLeafMenus, onCollapse, onSelectSearchMenu } = this.props;
    return (
      <div
        className={cls({
          [styles['nav-left-wrapper']]: true,
          [styles['nav-left-wrapper-collapsed']]: collapsed,
        })}
      >
        <div className="layout-logo" onClick={this.handleLogoClick}>
          <img src={collapsed ? collapsedLogo : logo} alt="logo" />
        </div>
        <div className="layout-menu-search">
          {!collapsed ? (
            <MenuSearch onSelect={onSelectSearchMenu} data={allLeafMenus} />
          ) : (
            <Icon className="collapsed-search-icon" type="search" onClick={onCollapse} />
          )}
        </div>
        <div className="layout-menu">
          {openKeys ? (
            <ScrollBar>
              <Menu
                defaultOpenKeys={openKeys}
                selectedKeys={currentSelectedKeys}
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
              >
                {this.renderMenu(menuConfig)}
              </Menu>
            </ScrollBar>
          ) : null}
        </div>
        <div className="layout-menu-collapse" onClick={onCollapse}>
          {!collapsed ? (
            <Fragment>
              <Icon className="collapse-icon" type="double-left" />
              <span>收起菜单</span>
            </Fragment>
          ) : (
            <Icon type="double-right" />
          )}
        </div>
      </div>
    );
  }
}

export default NavLeft;
