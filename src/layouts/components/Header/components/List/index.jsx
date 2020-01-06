import React from 'react';
import { List } from 'antd';
import styles from './index.less';

const ExtList = (props) => {
  const { split=false, size="small", onItemClick, ...rest } = props;
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
              {item.name}
            </span>
          </List.Item>
        )}
        {...rest}
      />
    </div>
  )
}

export default ExtList;
