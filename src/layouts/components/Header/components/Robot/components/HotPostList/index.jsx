import React, { Component } from 'react';
import { List, Icon, Skeleton } from 'antd';
import { ExtIcon, ScrollBar, message } from 'suid';
import cls from 'classnames';
import { userInfoOperation } from '@/utils';
import { getHotPosts } from '../../service';

import styles from './index.less';

const { getCurrentUser } = userInfoOperation;

class HotPostList extends Component {
  state = {
    loading: true,
    dataSource: [],
  };

  currentUser = getCurrentUser();

  componentDidMount() {
    this.getHotPosts();
  }

  getHotPosts = () => {
    this.setState({ loading: true });
    getHotPosts().then(result => {
      const { success, data: dataSource, message: msg } = result;
      if (success) {
        this.setState({
          dataSource,
          loading: false,
        });
      } else {
        message.error(msg);
      }
    });
  };

  getTitle = post => {
    const { title, commentCount, id } = post;

    return (
      <>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={`/sei-help-web/#/sei-help-web/postDetail/${id}?_s=${this.currentUser.sessionId}`}
        >
          {title}
        </a>
        <span style={{ float: 'right' }}>
          <Icon type="message" />
          {` ${commentCount}`}
        </span>
      </>
    );
  };

  getPostList = () => {
    const { dataSource } = this.state;

    return (
      <List
        itemLayout="horizontal"
        dataSource={dataSource}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta title={this.getTitle(item)} />
          </List.Item>
        )}
      />
    );
  };

  handleRefresh = () => {
    this.getHotPosts();
  };

  render() {
    const { loading } = this.state;
    return (
      <div className={cls(styles['hot-post-list'])}>
        <div className={cls('post-list-title')}>
          本周热议
          <span className={cls('extra')}>
            <ExtIcon
              disabled={loading}
              spin={loading}
              onClick={this.handleRefresh}
              type="sync"
              antd
            />
          </span>
        </div>
        <div className={cls('post-list-items')}>
          <ScrollBar>{loading ? <Skeleton active /> : this.getPostList()}</ScrollBar>
        </div>
      </div>
    );
  }
}

export default HotPostList;
