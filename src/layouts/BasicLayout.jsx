import React, { Suspense } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Icon, } from 'antd';
import Header from './components/Header';
import NavLeft from './components/NavLeft';

import styles from './BasicLayout.less';
import Tab from './components/Tab';

const { TabPane, TabHeader, } = Tab;

class BasicLayout extends React.Component {

  constructor(props) {
    super(props);
    const { history, } = this.props;
    let activedKey = '';
    let tabData = [];
    const pathname = history.location.pathname;
    if (!['/', '/DashBoard'].includes(pathname)) {
      activedKey = pathname;
      tabData = [{
        id: pathname,
        title: '新增',
        url: pathname,
      }]
    }
    this.state = {
      /** 被激活的页签key */
      activedKey,
      /** 页签数据 */
      tabData,
      /** 是否折叠菜单 */
      collapsed: false,
      /** 模块菜单 */
      moduleMenus: [],
      /** 页签打开模式 */
      mode: 'spa'
    };
  }

  cachePages = {}

  componentDidMount() {
    const { dispatch, } = this.props;
    /** 动态获取子模块配置，并且启动微前端应用 */
    dispatch({
      type: 'base/getApps',
    });
  }

  toggoleCollapsed = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  }

  handleCloseTab = (ids, isCloseAll) => {
    const { tabData } = this.state;
    const filterData = tabData.filter(item => (ids.findIndex(id => item.id === id) === -1));
    if (isCloseAll) {
      this.handleHomeClick();
    }
    this.setState({
      tabData: filterData,
    });
  }

  handleReload = (id) => {
    if (this.tabPaneRef && id) {
      this.tabPaneRef.reload(id);
    }
  }

  handleToggleTab = (id) => {
    this.setState({
      activedKey: id
    });
  }

  handleMenuClick = (menuItem) => {
    const { tabData, activedKey } = this.state;
    let isExist = tabData.some(item => item.id === menuItem.id);
    if (isExist) {
      if (menuItem.id !== activedKey) {
        this.setState({
          activedKey: menuItem.id
        });
      }
    } else {
      this.setState({
        tabData: tabData.concat(menuItem),
        activedKey: menuItem.id,
      });
    }
  }

  menuConvert = (treeData, cTreeData) => {
    cTreeData.title = treeData.name;
    cTreeData.id = treeData.id;
    cTreeData.iconType = 'profile';//treeData.iconCls;
    cTreeData.path = treeData.featureUrl;

    if (treeData.children) {
      cTreeData.children = [];
      treeData.children.forEach(item => {
        const temp = {};
        cTreeData.children.push(this.menuConvert(item, temp));
      });
    }
    return cTreeData;
  }

  handleModuleChange = (module) => {
    this.setState({
      moduleMenus: [this.menuConvert(module, {})],
    });
  }

  handleHomeClick = () => {
    const { history, } = this.props;
    this.setState({
      activedKey: ''
    }, () => {
      history.push('/DashBoard');
    });
  }

  /** 判断是否是子应用路由 */
  isSubAppRouter = () => {
    const { base, history, } = this.props;
    return base.apps.some(item => history.location.pathname.startsWith(item.base));
  }

  /** 适配页签数据 */
  adapterTabData = (data) => {
    return data.map(item => ({id: item.id, url: item.path, title: item.title }));
  }

  render() {
    const { collapsed, activedKey, tabData, moduleMenus, mode, hsi} = this.state;
    const { children, history, } = this.props;
    if (!this.cachePages[activedKey]) {
      this.cachePages[activedKey] = children;
    }

    const tempTabData = this.adapterTabData(tabData);

    return (
      <section className={cls(styles['portal-layout'])}>
        <nav className={cls({
          'layout-sidebar': true,
          'layout-sidebar-collapsed': collapsed,
        })}>
          <NavLeft
            menuConfig={moduleMenus}
            onMenuClick={this.handleMenuClick}
            collapsed={collapsed}
            activedMenuKey={activedKey}
            mode={mode}
          />
        </nav>
        <section className={cls('layout-center')}>
          <header className={cls('layout-center-header')}>
            <Header
              onModuleChange={this.handleModuleChange}
              onCollapse={this.toggoleCollapsed}
              collapsed={collapsed}
              onHomeClick={this.handleHomeClick}
            >
              <TabHeader
                data={tempTabData}
                activedKey={activedKey}
                onClose={this.handleCloseTab}
                onChange={this.handleToggleTab}
                onReload={this.handleReload}
                mode={mode}
                history={history}
              />
            </Header>
          </header>
          <content className={cls('layout-center-content')}>
            {!this.isSubAppRouter() && !activedKey ? children : null}
            { mode === 'iframe' ? (
              <TabPane
                style={activedKey==='' ? {display: 'none'}: {}}
                data={tempTabData}
                activedKey={activedKey}
                ref={ inst => this.tabPaneRef = inst }
              />
            ) : <div id="root-subapp"></div>}
          </content>
        </section>
      </section>
    );
  }
}

export default connect((state) => ({ base: state.base }))(BasicLayout);
