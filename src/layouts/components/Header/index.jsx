import React from 'react';
import cls from 'classnames';
import { Icon, Menu, Avatar, } from 'antd';
import HeaderDropdown from './components/HeaderDropdown';
import ExtList from './components/List';
import { request, CONSTANTS } from '@/utils';
import styles from './index.less';

const { PORTALSERVICE, } = CONSTANTS;

export default class Header extends React.Component {

  state = {
    modules: [],
    currModuleName: '',
  }

  componentDidMount() {
    request.post(`${PORTALSERVICE}/getMenus`)
    .then(result => {
      const modules = result.data;
      this.setState({
        modules,
        currModuleName: modules[0].name,
      }, () => {
        const { onModuleChange } = this.props;
        if (onModuleChange) {
          onModuleChange(modules[0]);
        }
      });
    });
  }

  /** 获取个人下拉菜单项 */
  getDropdownMenus = () => {
    const { onMenuClick } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
          用户
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出
        </Menu.Item>
      </Menu>
    );

    return menu;
  }

  dropdownRender = () => {
    const { modules } = this.state;
    return (
      <ExtList
        dataSource={modules}
        onItemClick={(item) => {
          this.setState({
            currModuleName: item.name,
          }, () => {
            const { onModuleChange } = this.props;
            if (onModuleChange) {
              onModuleChange(item);
            }
          });
        }}
      />
    );
  }

  handleHomeClick = () => {
    const { onHomeClick, } = this.props;
    if (onHomeClick) {
      onHomeClick();
    }
  }

  render() {
    const { onCollapse, collapsed, children } = this.props;
    const { currModuleName, } = this.state;
    return (
      <section className={cls(styles['header-layout'])}>
        <div style={{
          float: 'left',
        }}>
          <span
            className={cls('trigger')}
            onClick={() => { onCollapse && onCollapse() }}
          >
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </span>
          <HeaderDropdown overlay={this.dropdownRender()} trigger={["click"]}>
            <span className={cls('trigger')}>
              <span className="title">{currModuleName}</span>
              <Icon
                type="caret-down"
                style={{fontSize: '12px', marginLeft: '4px'}}
              />
            </span>
          </HeaderDropdown>
          <span
            className={cls('trigger')}
            onClick={this.handleHomeClick}
          >
            <Icon type="home" theme="filled" size="14" />
          </span>
        </div>
        <div className={cls('header-layout-right')}>
          <HeaderDropdown overlay={this.getDropdownMenus()}>
            <span className={`${cls('action', 'account')} ${styles.account}`}>
              <Avatar icon="user" size="14" />
              <span className={cls('username')}>
                张盼
              </span>
            </span>
          </HeaderDropdown>
        </div>
        <div style={{
          overflow: 'hidden'
        }}>{children}</div>
      </section>
    );
  }
}
