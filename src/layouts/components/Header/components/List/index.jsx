import React from 'react';
import { List } from 'antd';
import styles from './index.less';

const ExtList = props => {
  const { split = false, size = 'small', onItemClick, dataSource } = props;

  return (
    <div className={styles['ext-list-wrapper']}>
      <List
        split={split}
        size={size}
        renderItem={item => (
          <List.Item>
            <span
              className="ext-list-item"
              onClick={() => {
                if (onItemClick) {
                  onItemClick(item);
                }
              }}
            >
              {item.title}
            </span>
          </List.Item>
        )}
        dataSource={dataSource}
        selectable="false"
      />
    </div>
  );
};

export default ExtList;
