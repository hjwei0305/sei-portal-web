import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Helmet } from 'react-helmet';
import { formatMessage } from 'umi-plugin-react/locale';
import Header from './components/Header';
import NavLeft from './components/NavLeft';
import Tab from './components/Tab';

import styles from './BasicLayout.less';

const { TabPane, TabHeader } = Tab;

@connect(({ base, menu }) => ({ base, menu }))
export default class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /** 是否折叠菜单 */
      collapsed: false,
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

  handleToggleTab = (id, activedMenu) => {
    this.updateTabState({
      activedMenu,
    });
  };

  handleMenuClick = activedMenu => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateTabState',
      payload: {
        activedMenu,
      },
    });
  };

  handleHomeClick = () => {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'menu/updateTabState',
      payload: {
        activedMenu: null,
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

  getBreadCrumb = () => {
    const { menu } = this.props;
    const { urlPath = '' } = menu.activedMenu || {};
    if (urlPath) {
      const urlPaths = urlPath.slice(1).split('/');
      let preUrlPath = urlPaths.slice(0, -1).join('/');
      if (preUrlPath) {
        preUrlPath += '/';
      }

      return (
        <div className={cls(styles['breadcrumb-wrapper'])}>
          <span className="pre-urlpath">{preUrlPath}</span>
          <span className="curr-urlpath">{urlPaths.pop()}</span>
        </div>
      );
    }

    return urlPath;
  };

  render() {
    const { collapsed } = this.state;
    const { children, history, menu } = this.props;
    const { tabData, mode, currMenuTree, activedMenu } = menu;
    const isSubAppRouter = this.isSubAppRouter();
    let activedKey = '';
    let title = formatMessage({ id: 'app.dashboard', desc: '平台首页' });
    if (activedMenu) {
      const { id, title: tempTitle } = activedMenu;
      activedKey = id;
      title = tempTitle;
    }
    return (
      <section className={cls(styles['portal-layout'])}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={title} />
        </Helmet>
        <nav
          className={cls({
            'layout-sidebar': true,
            'layout-sidebar-collapsed': collapsed,
          })}
        >
          <NavLeft
            menuConfig={currMenuTree ? [currMenuTree] : []}
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
              {mode === 'spa' ? (
                this.getBreadCrumb()
              ) : (
                <TabHeader
                  data={tabData}
                  activedKey={activedKey}
                  onClose={this.handleCloseTab}
                  onChange={this.handleToggleTab}
                  onReload={this.handleReload}
                  mode={mode}
                  history={history}
                />
              )}
            </Header>
          </header>
          <content className={cls('layout-center-content')}>
            {!isSubAppRouter && !activedKey ? children : null}
            {mode === 'iframe' ? (
              <TabPane
                style={activedKey === '' ? { display: 'none' } : {}}
                data={tabData}
                activedKey={activedKey}
                ref={inst => {
                  this.tabPaneRef = inst;
                }}
              />
            ) : (
              <div
                id="root-subapp"
                style={{
                  display: isSubAppRouter ? 'block' : 'none',
                }}
              ></div>
            )}
          </content>
        </section>
      </section>
    );
  }
}
