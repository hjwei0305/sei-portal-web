import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'umi';
import cls from 'classnames';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import logo from '../../../assets/logo@2x.png';
import collapsedLogo from '../../../assets/logo_notxt@2x.png';

import styles from './index.less';

const { SubMenu } = Menu;

class NavLeft extends React.Component {
  static propTypes = {
    /** 页签打开模式 */
    mode: PropTypes.string,
  };

  static defaultProps = {
    mode: 'iframe',
  };

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
        openKeys: this.getInitOpenKeys(),
      });
    }
  }

  getInitOpenKeys = menuConfig => {
    if (menuConfig && menuConfig.length) {
      return [menuConfig[0].id];
    }
    return null;
  };

  handleOpenChange = openKeys => {
    this.setState({
      openKeys,
    });
    // console.log(openKeys);
    // const {
    //   menuConfig
    // } = this.props;
    // const menus = curModuleMenu.children;
    // const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    // const key = menus.find(item => item.id === latestOpenKey);
    // if (!key) {
    //   this.setState({
    //     openKeys
    //   });
    // } else {
    //   this.setState({
    //     openKeys: latestOpenKey ? [latestOpenKey] : [],
    //   });
    // }
  };

  handleMenuClick = item => {
    const { onMenuClick } = this.props;
    this.updateCurrentSelected(item.id);
    if (onMenuClick) {
      onMenuClick(item);
    }
  };

  updateCurrentSelected = key => {
    this.setState({
      currentSelectedKeys: [key],
    });
  };

  /** 根据页签模式获取页面 */
  getMenuNavItemByMode = item => {
    const { mode } = this.props;

    if (mode !== 'iframe') {
      return (
        <Link to={item.url}>
          <Icon type={item.iconType} />
          <span>{item.title}</span>
        </Link>
      );
    }

    return (
      <a>
        <Icon type={item.iconType} />
        <span>{item.title}</span>
      </a>
    );
  };

  // 递归渲染树形菜单
  renderMenu = data =>
    data.map(item => {
      if (item.children && item.children.length) {
        const title = (
          <span>
            <Icon type={item.iconType} />
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
    const { collapsed, menuConfig = [] } = this.props;

    return (
      <div
        className={cls({
          [styles['nav-left-wrapper']]: true,
          [styles['nav-left-wrapper-collapsed']]: collapsed,
        })}
      >
        <div className="layout-logo">
          <img src={collapsed ? collapsedLogo : logo} alt="logo" />
        </div>
        <Menu
          selectedKeys={currentSelectedKeys}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          onOpenChange={this.handleOpenChange}
          openKeys={openKeys}
        >
          {this.renderMenu(menuConfig)}
        </Menu>
      </div>
    );
  }
}

export default NavLeft;
