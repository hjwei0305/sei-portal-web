import React, { Component, Fragment } from 'react';
import { List, Typography, Skeleton, message } from 'antd';
import { ExtIcon, ScrollBar } from 'suid';
import cls from 'classnames';
import { getContacts } from '../../service';

import styles from './index.less';

const { Text } = Typography;

class ContactList extends Component {
  state = {
    loading: true,
    dataSource: [],
  };

  componentDidMount() {
    this.getContacts();
  }

  getContacts = () => {
    this.setState({ loading: true });
    getContacts().then(result => {
      const { success, data: dataSource, message: msg } = result;
      if (success) {
        this.setState(
          {
            dataSource,
            loading: false,
          },
          () => {
            if (this._scrollBarRef) {
              this._scrollBarRef.updateScroll();
            }
          },
        );
      } else {
        message.error(msg);
      }
    });
  };

  getTitle = post => {
    const { name, telNumber } = post;
    return (
      <Fragment>
        <span>{name}</span>
        <span style={{ float: 'right' }}>
          <Text copyable={{ text: telNumber }} />
          {` ${telNumber}`}
        </span>
      </Fragment>
    );
  };

  getContactList = () => {
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
    this.getContacts();
  };

  render() {
    const { loading } = this.state;
    return (
      <div className={cls(styles['contact-list'])}>
        <div className={cls('contact-list-title')}>
          联系人
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
        <div className={cls('contact-list-items')}>
          <ScrollBar ref={inst => (this._scrollBarRef = inst)}>
            {loading ? <Skeleton active /> : this.getContactList()}
          </ScrollBar>
        </div>
      </div>
    );
  }
}

export default ContactList;
