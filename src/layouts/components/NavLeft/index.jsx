import React, { Fragment } from 'react';
import { Menu, Icon, Row, Col } from 'antd';
import { Link } from 'umi';
import { ScrollBar, ProLayout } from 'suid';
import { formatMessage } from 'umi-plugin-react/locale';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { eventBus } from '@/utils';
import MenuSearch from '@/components/MenuSearch';
import FavoriteMenu from '@/components/FavoriteMenu';
import logo from '../../../assets/logo.png';
import collapsedLogo from '../../../assets/logo_notxt@2x.png';

import styles from './index.less';

const { SubMenu } = Menu;
const { Header, Content, Footer } = ProLayout;

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

  handleCollect = (e, item) => {
    e.stopPropagation();
    const { id, favorite } = item;
    eventBus.emit(favorite ? 'deCollectMenu' : 'collectMenu', id);
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
          <Icon className="collect-icon" type="star" onClick={e => this.handleCollect(e, item)} />
        </Link>
      );
    }
    return (
      <Fragment>
        <span>
          {item.iconType ? <Icon type={item.iconType} /> : null}
          <span>{item.title}</span>
        </span>
        <Icon
          className={cls({
            'collect-icon-actived': item.favorite,
            'collect-icon': true,
          })}
          type="star"
          theme={item.favorite ? 'twoTone' : ''}
          onClick={e => this.handleCollect(e, item)}
        />
      </Fragment>
    );
  };

  // 递归渲染树形菜单
  renderMenu = data =>
    data.map(item => {
      if (item.children && item.children.length) {
        const { collapsed } = this.props;
        const title = (
          <span>
            {item.iconType ? <Icon type={item.iconType} /> : <Icon type="profile" />}
            <span>{item.title}</span>
          </span>
        );

        return (
          <SubMenu title={title} key={item.id}>
            <div
              className={cls('submenu-hover-title')}
              style={{ display: collapsed ? 'block' : 'none' }}
            >
              {item.title}
            </div>
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
    const {
      collapsed,
      menuConfig = [],
      allLeafMenus,
      favoriteMenus,
      onCollapse,
      onSelectSearchMenu,
      tenantSetting,
    } = this.props;
    const collapsedMenuLogo = collapsedLogo;
    const menuLogo = logo;
    // if (tenantSetting && tenantSetting.logo) {
    //   const logoObj = JSON.parse(tenantSetting.logo);
    //   if (!logoObj.disabled) {
    //     ({ collapsedMenuLogo, menuLogo } = logoObj);
    //   }
    // }
    return (
      <div
        className={cls({
          [styles['nav-left-wrapper']]: true,
          [styles['nav-left-wrapper-collapsed']]: collapsed,
        })}
      >
        <ProLayout>
          <Header height={56} gutter={[0, 0]} style={{ padding: 0 }}>
            <div className="layout-logo" onClick={this.handleLogoClick}>
              <img src={collapsed ? collapsedMenuLogo : menuLogo} alt="logo" />
            </div>
          </Header>
          <Header height="auto" gutter={[0, 0]}>
            <div className="layout-menu-search">
              {!collapsed ? (
                <Fragment>
                  <Row type="flex" align="middle" style={{ flex: 1 }}>
                    <Col id="menu-search-container" style={{ flex: 1 }}>
                      <MenuSearch onSelect={onSelectSearchMenu} data={allLeafMenus} />
                    </Col>
                    <Col id="favorite-container" style={{ width: 50 }}>
                      <FavoriteMenu
                        collapsed={collapsed}
                        data={favoriteMenus}
                        onSelect={onSelectSearchMenu}
                        onRemove={this.handleCollect}
                      />
                    </Col>
                  </Row>
                </Fragment>
              ) : (
                <Fragment>
                  <Icon className="collapsed-search-icon" type="search" onClick={onCollapse} />
                  <FavoriteMenu
                    collapsed={collapsed}
                    data={favoriteMenus}
                    onSelect={onSelectSearchMenu}
                    onRemove={this.handleCollect}
                  />
                </Fragment>
              )}
            </div>
          </Header>
          <Content>
            <div
              className="layout-menu"
              onClick={e => {
                if (
                  e.target.className &&
                  e.target.className.includes('scrollbar-container') &&
                  onCollapse &&
                  collapsed
                ) {
                  onCollapse();
                }
              }}
            >
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
          </Content>
          <Footer height={40} gutter={[0, 0]}>
            <div id="collapse-icon-container" className="layout-menu-collapse" onClick={onCollapse}>
              {!collapsed ? (
                <Fragment>
                  <Icon className="collapse-icon" type="double-left" />
                  <span>
                    {formatMessage({ id: 'app.menu.collopse', defaultMessage: '收起菜单' })}
                  </span>
                </Fragment>
              ) : (
                <Icon type="double-right" />
              )}
            </div>
          </Footer>
        </ProLayout>
        {/* <div className="layout-logo" onClick={this.handleLogoClick}>
          <img src={collapsed ? collapsedMenuLogo : menuLogo} alt="logo" />
        </div>
        <div className="layout-menu-search">
          {!collapsed ? (
            <Fragment>
              <Row type="flex" align="middle">
                <Col id="menu-search-container" style={{ flex: 1 }}>
                  <MenuSearch onSelect={onSelectSearchMenu} data={allLeafMenus} />
                </Col>
                <Col id="favorite-container" style={{ width: 50 }}>
                  <FavoriteMenu
                    collapsed={collapsed}
                    data={favoriteMenus}
                    onSelect={onSelectSearchMenu}
                    onRemove={this.handleCollect}
                  />
                </Col>
              </Row>
            </Fragment>
          ) : (
            <Fragment>
              <Icon className="collapsed-search-icon" type="search" onClick={onCollapse} />
              <FavoriteMenu
                collapsed={collapsed}
                data={favoriteMenus}
                onSelect={onSelectSearchMenu}
                onRemove={this.handleCollect}
              />
            </Fragment>
          )}
        </div>
        <div
          className="layout-menu"
          onClick={e => {
            if (
              e.target.className &&
              e.target.className.includes('scrollbar-container') &&
              onCollapse &&
              collapsed
            ) {
              onCollapse();
            }
          }}
        >
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
        <div id="collapse-icon-container" className="layout-menu-collapse" onClick={onCollapse}>
          {!collapsed ? (
            <Fragment>
              <Icon className="collapse-icon" type="double-left" />
              <span>收起菜单</span>
            </Fragment>
          ) : (
            <Icon type="double-right" />
          )}
        </div> */}
      </div>
    );
  }
}

export default NavLeft;
