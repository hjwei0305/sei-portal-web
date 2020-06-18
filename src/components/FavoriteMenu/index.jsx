import React from 'react';
import { Icon, Popover, Empty } from 'antd';
import cls from 'classnames';
import { ScrollBar } from 'suid';

import styles from './index.less';

export default class FavoriteMenu extends React.Component {
  renderDataList = () => {
    const { data, onSelect, onRemove } = this.props;
    if (data && data.length) {
      return data.map(item => {
        const { id, title } = item;
        return (
          <div
            className={cls({
              'favorite-item': true,
            })}
            onClick={() => {
              if (onSelect) {
                onSelect(item);
              }
            }}
            key={id}
          >
            {title}
            <span
              onClick={e => {
                // e.stopPropagation();
                if (onRemove) {
                  onRemove(e, item);
                }
              }}
              className="favorite-item-close"
            >
              x
            </span>
          </div>
        );
      });
    }
    return <Empty description="没有收藏菜单"></Empty>;
  };

  render() {
    const { className } = this.props;

    return (
      <Popover
        overlayClassName={cls({
          [styles['popver-wrapper']]: true,
          [className]: true,
        })}
        placement="rightTop"
        align={{
          points: ['tl', 'tr'], // align top left point of sourceNode with top right point of targetNode
          offset: [5, 5],
        }}
        content={
          <div className="menu-search-popver-content">
            <ScrollBar>{this.renderDataList()}</ScrollBar>
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
