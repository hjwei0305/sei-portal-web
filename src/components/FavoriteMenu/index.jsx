import React from 'react';
import { Icon, Popover, List } from 'antd';
import { get } from 'lodash';
import cls from 'classnames';
import { ScrollBar } from 'suid';

import styles from './index.less';

export default class FavoriteMenu extends React.Component {
  getItemTitle = item => {
    const { onRemove } = this.props;
    const menuTitle = get(item, 'title', '');
    return (
      <div>
        {menuTitle}
        <Icon
          className="collect-icon"
          theme="twoTone"
          type="star"
          onClick={e => onRemove(e, item)}
        />
      </div>
    );
  };

  getDataList = () => {
    const { data, onSelect } = this.props;
    if (data && data.length) {
      return (
        <div className="favorite-menu-item-wrapper">
          <div className="title">我的收藏</div>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item key={item.id} onClick={() => onSelect(item)}>
                <List.Item.Meta
                  title={this.getItemTitle(item)}
                  description={get(item, 'urlPath', '').slice(1)}
                />
              </List.Item>
            )}
          />
        </div>
      );
    }
    return (
      <div className={cls('empty-wrapper')}>
        <div className="title">我的收藏</div>
        <div className="desc">暂时没有收藏菜单</div>
      </div>
    );
  };

  render() {
    const { className, collapsed } = this.props;

    return (
      <Popover
        overlayClassName={cls({
          [styles['popver-wrapper']]: true,
          [styles['popver-wrapper-collapsed']]: collapsed,
          [styles['popver-wrapper-no-collapsed']]: !collapsed,
          [className]: true,
        })}
        placement={collapsed ? 'rightBottom' : 'bottom'}
        align={{
          offset: collapsed ? [2, -3] : [-88, 5],
        }}
        content={
          <div className="menu-favorite-popver-content">
            <ScrollBar>{this.getDataList()}</ScrollBar>
          </div>
        }
      >
        <div className={cls(styles['favorite-icon-wrapper'])}>
          <Icon className={cls('favorite-icon')} type="star" />
        </div>
      </Popover>
    );
  }
}
