import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { router } from 'umi';
import { Helmet } from 'react-helmet';
import { Modal, message } from 'antd';
import { ScrollBar } from 'suid';
import { formatMessage } from 'umi-plugin-react/locale';
import { userInfoOperation, weiXinUtils } from '@/utils';
import ConfirmLoginModal from '@/pages/Login/ConfirmLoginModal';
import { getWeChatCfg } from '@/services/user';
import Header from './components/Header';
import NavLeft from './components/NavLeft';
import Tab from './components/Tab';

import styles from './BasicLayout.less';

const { confirm } = Modal;
const { TabPane, TabHeader } = Tab;
const { getCurrentUser } = userInfoOperation;

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
    const { userId } = getCurrentUser() || {};
    /** 动态获取子模块配置，并且启动微前端应用 */
    dispatch({
      type: 'base/getApps',
    });
    if (userId) {
      dispatch({
        type: 'menu/updateState',
        payload: {
          menuTrees: [],
          currMenuTree: null,
        },
      }).then(() => {
        dispatch({
          type: 'menu/getMenus',
          payload: {
            userId,
          },
        });
      });
      dispatch({
        type: 'user/getUserFeatures',
        payload: {
          userId,
        },
      });
    }
    window.addEventListener('message', this.delegateTab, false);
    if (weiXinUtils.isWeiXin()) {
      this.showOpenDefaultBrowserConfirm();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.delegateTab);
  }

  handleAfterSuccess = () => {
    const { menu } = this.props;
    const { activedMenu } = menu;
    if (activedMenu) {
      this.handleReload(activedMenu.id);
    }
  };

  delegateTab = e => {
    const { data } = e;
    const { tabAction, item } = data || {};
    if (['open', 'close'].includes(tabAction)) {
      const { id, name: title, featureUrl: url } = item || {};
      let params = {
        activedMenu: { id, title, url },
      };
      if (tabAction === 'close') {
        params = {
          tabIds: [id],
        };
      }
      this.handleTabs(tabAction, params);
    }
  };

  handleTogCollapsed = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  handleCloseTab = (ids, isCloseAll) => {
    this.handleTabs('close', {
      tabIds: ids,
    }).then(() => {
      if (isCloseAll) {
        this.handleHomeClick();
      }
    });
  };

  handleReload = id => {
    if (this.tabPaneRef && id) {
      this.tabPaneRef.reload(id);
    }
  };

  handleToggleTab = (id, activedMenu) => {
    this.handleTabs('open', {
      activedMenu,
    });
  };

  handleResize = showTabCounts => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateShowTabCounts',
      payload: {
        showTabCounts,
      },
    });
  };

  /** 页签操作 */
  handleTabs = (type, payload) => {
    const { dispatch } = this.props;
    return dispatch({
      type: `menu/${type}Tab`,
      payload,
    });
  };

  handleHomeClick = () => {
    this.handleTabs('open', {
      activedMenu: null,
    }).then(() => {
      router.push('/DashBoard');
    });
  };

  showOpenDefaultBrowserConfirm = () => {
    confirm({
      title: '是否需要使用系统默认浏览器打开该应用?',
      onOk() {
        return new Promise((resolve, reject) => {
          getWeChatCfg()
            .then(result => {
              const { success, data, message: msg } = result || {};
              if (success) {
                const { corpid, signature, nonceStr, timestamp, url } = data;
                window.wx.config({
                  beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: corpid, // 必填，企业微信的corpID
                  timestamp, // 必填，生成签名的时间戳
                  nonceStr, // 必填，生成签名的随机串
                  signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
                  jsApiList: ['openDefaultBrowser'], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
                });
                window.wx.ready(() => {
                  const { sessionId: sid } = getCurrentUser() || {};
                  window.wx.invoke(
                    'openDefaultBrowser',
                    {
                      url: `${url}#/sso/ssoWrapperPage?sid=${sid}`, // 在默认浏览器打开redirect_uri，并附加code参数；也可以直接指定要打开的url，此时不会附带上code参数。
                    },
                    res => {
                      // eslint-disable-next-line no-console
                      if (res.err_msg === 'openDefaultBrowser:ok') {
                        window.wx.closeWindow();
                        window.close();
                      }
                      resolve();
                    },
                  );
                });
              } else {
                message.warn(msg);
                reject();
              }
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  handleLogoClick = () => {
    getWeChatCfg().then(result => {
      const { success, data } = result || {};
      if (success) {
        const { corpid, signature, nonceStr, timestamp, url } = data;
        window.wx.config({
          beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: corpid, // 必填，企业微信的corpID
          timestamp, // 必填，生成签名的时间戳
          nonceStr, // 必填，生成签名的随机串
          signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
          jsApiList: ['openDefaultBrowser'], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        });
        window.wx.ready(() => {
          const { sessionId: sid } = getCurrentUser() || {};
          window.wx.invoke(
            'openDefaultBrowser',
            {
              url: `${url}#/sso/ssoWrapperPage?sid=${sid}`, // 在默认浏览器打开redirect_uri，并附加code参数；也可以直接指定要打开的url，此时不会附带上code参数。
            },
            res => {
              // eslint-disable-next-line no-console
              if (res.err_msg === 'openDefaultBrowser:ok') {
                window.wx.closeWindow();
                window.close();
              }
            },
          );
        });
      }
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
    const { children, menu } = this.props;
    const {
      tabData,
      mode,
      currMenuTree,
      activedMenu,
      loginVisible,
      allLeafMenus,
      showTabCounts,
      visibleTabData,
      moreTabData,
    } = menu;
    const isSubAppRouter = this.isSubAppRouter();
    let activedKey = '';
    let title = formatMessage({ id: 'app.dashboard', desc: '平台首页' });
    if (activedMenu) {
      const { id, title: tempTitle } = activedMenu;
      activedKey = id;
      title = `${currMenuTree && currMenuTree.title}-${tempTitle}`;
    }
    return (
      <ScrollBar>
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
              onSelectSearchMenu={currMenu => {
                const { dispatch } = this.props;
                dispatch({
                  type: 'menu/openTab',
                  payload: {
                    activedMenu: currMenu,
                  },
                });
                // .then(() => router.push(currMenu.url));
              }}
              allLeafMenus={allLeafMenus}
              onLogoClick={this.handleLogoClick}
              menuConfig={currMenuTree ? currMenuTree.children || [] : []}
              onMenuClick={currMenu => {
                this.handleTabs('open', {
                  activedMenu: currMenu,
                });
              }}
              collapsed={collapsed}
              activedMenuKey={activedKey}
              mode={mode}
              onCollapse={this.handleTogCollapsed}
            />
          </nav>
          <section className={cls('layout-center')}>
            <header className={cls('layout-center-header')}>
              <Header
                // onCollapse={this.handleTogCollapsed}
                // collapsed={collapsed}
                onHomeClick={this.handleHomeClick}
              >
                {mode === 'spa' ? (
                  this.getBreadCrumb()
                ) : (
                  <TabHeader
                    data={tabData}
                    activedKey={activedKey}
                    activedMenu={activedMenu}
                    onClose={this.handleCloseTab}
                    onChange={this.handleToggleTab}
                    onReload={this.handleReload}
                    onResize={this.handleResize}
                    visibleTabData={visibleTabData}
                    moreTabData={moreTabData}
                    showTabCounts={showTabCounts}
                    mode={mode}
                  />
                )}
              </Header>
            </header>
            <content className={cls('layout-center-content')}>
              {!isSubAppRouter && !activedKey ? children : null}
              {mode === 'iframe' ? (
                <TabPane
                  style={activedKey === '' ? { visibility: 'hidden', height: 0 } : {}}
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
          {loginVisible ? (
            <ConfirmLoginModal
              title="用户登录"
              visible={loginVisible}
              footer={null}
              afterSuccess={this.handleAfterSuccess}
            />
          ) : null}
        </section>
      </ScrollBar>
    );
  }
}
