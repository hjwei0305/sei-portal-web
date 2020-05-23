import React from 'react';
import cls from 'classnames';
import { router } from 'umi';
import { connect } from 'dva';
import { Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import FullScreen from '@/components/FullScreen';
import MenuSearch from '@/components/MenuSearch';
import SelectModule from './components/SelectModule';
import UserIcon from './components/UserIcon';
import Notify from './components/Notify';

import styles from './index.less';

@connect(({ menu }) => ({ menu }))
export default class Header extends React.Component {
  handleHomeClick = () => {
    const { onHomeClick } = this.props;
    if (onHomeClick) {
      onHomeClick();
    }
  };

  render() {
    const { onCollapse, collapsed, children, menu } = this.props;
    const { allLeafMenus, activedMenu } = menu;
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
          <SelectModule />
          <span
            className={cls({ trigger: true, trigger_active: !activedKey })}
            onClick={this.handleHomeClick}
          >
            <Icon type="home" size="14" />
          </span>
        </div>
        <div className={cls('header-layout-right')}>
          <MenuSearch
            className={cls('trigger')}
            data={allLeafMenus}
            placeholder={formatMessage({
              id: 'app.menusearch.placeholder',
              desc: '请输入关键字查询',
            })}
            onSelect={currMenu => {
              const { dispatch } = this.props;
              dispatch({
                type: 'menu/openTab',
                payload: {
                  activedMenu: currMenu,
                },
              }).then(() => router.push(currMenu.url));
            }}
          />
          <Notify className={cls('trigger')} />
          <UserIcon />
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
