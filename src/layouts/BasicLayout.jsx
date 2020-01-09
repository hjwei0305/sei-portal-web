import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import Header from './components/Header';
import NavLeft from './components/NavLeft';

import styles from './BasicLayout.less';
import Tab from './components/Tab';

const { TabPane, TabHeader } = Tab;

class BasicLayout extends React.Component {
  cachePages = {};

  constructor(props) {
    super(props);
    // const { history, } = this.props;
    // let activedKey = '';
    // let tabData = [];
    // const pathname = history.location.pathname;
    // if (!['/', '/DashBoard'].includes(pathname)) {
    //   activedKey = pathname;
    //   tabData = [{
    //     id: pathname,
    //     title: '新增',
    //     url: pathname,
    //   }]
    // }
    this.state = {
      /** 被激活的页签key */
      // activedKey,
      /** 页签数据 */
      // tabData,
      /** 是否折叠菜单 */
      collapsed: false,
      /** 页签打开模式 */
      mode: 'spa',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
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
  };

  handleCloseTab = (ids, isCloseAll) => {
    const { menu } = this.props;
    const { tabData } = menu;
    const filterData = tabData.filter(item => ids.findIndex(id => item.id === id) === -1);
    if (isCloseAll) {
      this.handleHomeClick();
    }
    this.updateTabState({
      tabData: filterData,
    });
  };

  handleReload = id => {
    if (this.tabPaneRef && id) {
      this.tabPaneRef.reload(id);
    }
  };

  /** 更新页签相关的状态 */
  updateTabState = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateState',
      payload,
    });
  };

  handleToggleTab = id => {
    this.updateTabState({
      activedKey: id,
    });
  };

  handleMenuClick = menuItem => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateTabState',
      payload: {
        menuItem,
      },
    });
  };

  menuConvert = (treeData, cTreeData) => {
    if (!treeData || !treeData.id) {
      return null;
    }
    const tempCTreeData = cTreeData;
    tempCTreeData.title = treeData.name;
    tempCTreeData.id = treeData.id;
    tempCTreeData.iconType = 'profile'; // treeData.iconCls;
    tempCTreeData.path = treeData.featureUrl;

    if (treeData.children) {
      tempCTreeData.children = [];
      treeData.children.forEach(item => {
        const temp = {};
        tempCTreeData.children.push(this.menuConvert(item, temp));
      });
    }
    return tempCTreeData;
  };

  handleHomeClick = () => {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'menu/updateTabState',
      payload: {
        activedKey: '',
      },
    }).then(() => {
      history.push('/DashBoard');
    });
  };

  /** 判断是否是子应用路由 */
  isSubAppRouter = () => {
    const { base, history } = this.props;
    return base.apps.some(item => history.location.pathname.startsWith(item.base));
  };

  /** 适配页签数据 */
  adapterTabData = data => data.map(item => ({ id: item.id, url: item.path, title: item.title }));

  render() {
    const { collapsed, mode } = this.state;
    const { children, history, menu } = this.props;
    const { currModule, activedKey, tabData } = menu;
    if (!this.cachePages[activedKey]) {
      this.cachePages[activedKey] = children;
    }

    const tempTabData = this.adapterTabData(tabData);
    const tempCurrModule = this.menuConvert(currModule, {});
    return (
      <section className={cls(styles['portal-layout'])}>
        <nav
          className={cls({
            'layout-sidebar': true,
            'layout-sidebar-collapsed': collapsed,
          })}
        >
          <NavLeft
            menuConfig={tempCurrModule ? [tempCurrModule] : []}
            onMenuClick={this.handleMenuClick}
            collapsed={collapsed}
            activedMenuKey={activedKey}
            mode={mode}
          />
        </nav>
        <section className={cls('layout-center')}>
          <header className={cls('layout-center-header')}>
            <Header
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
            {mode === 'iframe' ? (
              <TabPane
                style={activedKey === '' ? { display: 'none' } : {}}
                data={tempTabData}
                activedKey={activedKey}
                ref={inst => {
                  this.tabPaneRef = inst;
                }}
              />
            ) : (
              <div id="root-subapp"></div>
            )}
          </content>
        </section>
      </section>
    );
  }
}

export default connect(state => ({ base: state.base, menu: state.menu }))(BasicLayout);
