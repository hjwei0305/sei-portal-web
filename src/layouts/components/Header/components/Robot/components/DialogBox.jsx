import React, { Component } from 'react';
import { ExtModal, ScrollBar, utils, ExtIcon } from 'suid';
import ReactDOM from 'react-dom';
import cls from 'classnames';
import moment from 'moment';
import { Row, Col, Divider, Input, Button, message, List, Avatar, Spin } from 'antd';
import { userInfoOperation } from '@/utils';
import ContactList from './ContactList';
import HotPostList from './HotPostList';
import { getAnswers } from '../service';

import styles from './DialogBox.less';

const { TextArea } = Input;
const { getCurrentUser } = userInfoOperation;
const { getUUID } = utils;

class DialogBox extends Component {
  state = {
    dialogRecords: [],
    searchVal: '',
  };

  currentUser = getCurrentUser();

  componentDidUpdate() {
    const { visible } = this.props;
    if (this.textAreaRef && visible) {
      const textAreaDom = ReactDOM.findDOMNode(this.textAreaRef);
      textAreaDom.focus();
    }
  }

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleSend();
    }
  };

  handleSend = () => {
    const emptyReg = /^\s+$/;
    const { dialogRecords, searchVal } = this.state;
    if (!searchVal || emptyReg.test(this.searchVal)) {
      message.warn('请输入对话内容！');
    } else {
      dialogRecords.push({
        content: searchVal,
        datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
        avatar: this.currentUser.portrait,
        isCurruser: true,
        userName: this.currentUser.userName,
      });
      const tempId = getUUID();
      this.setState(
        {
          dialogRecords: dialogRecords.concat([
            {
              id: tempId,
              loading: true,
              searchVal,
              content: '客官，莫急。小智正在头脑风暴',
              datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
              avatar: this.currentUser.portrait,
              userName: '小智',
            },
          ]),
          searchVal: '',
        },
        () => {
          this.getAnswers(searchVal, tempId);
        },
      );
    }
  };

  getDialogContentCmp = () => {
    const { dialogRecords } = this.state;

    if (dialogRecords.length) {
      return (
        <List
          dataSource={dialogRecords}
          renderItem={item => {
            const { avatar, content, isCurruser, userName } = item;

            if (isCurruser) {
              return (
                <div className={cls('ext-list-item-meta')}>
                  <div className={cls('ext-list-item-meta-content')}>
                    <h4 className={cls('ext-list-item-meta-title')}>我</h4>
                    <div className={cls('ext-list-item-meta-description')}>
                      <span className={cls('float-content')}>{content}</span>
                    </div>
                  </div>
                  <div className={cls('ext-list-item-meta-avatar')}>
                    <Avatar src={avatar}></Avatar>
                  </div>
                </div>
              );
            }

            return (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon="robot" />}
                  title={userName}
                  description={
                    <>
                      <span className={cls('description-content')}>
                        {item.loading ? (
                          <span>
                            {`${content}和关键词【${item.searchVal}】相关的问题`}{' '}
                            <Spin spinning={item.loading} />
                          </span>
                        ) : (
                          <div>
                            {item.data && item.data.length ? (
                              `客官，和关键词【${item.searchVal}】相关的问题如下：`
                            ) : (
                              <span>
                                {`客官，没有和关键词【${item.searchVal}】相关的问题 `}
                                <a
                                  rel="noopener noreferrer"
                                  target="_blank"
                                  href={`/sei-help-web/#/sei-help-web/post/create?_s=${this.currentUser.sessionId}`}
                                >
                                  去提问
                                </a>
                              </span>
                            )}
                          </div>
                        )}
                        <div
                          style={{
                            overflow: 'hidden',
                            clear: 'both',
                          }}
                        >
                          {!item.loading
                            ? item.data.map(it => (
                                <a
                                  key={it.id}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                  href={`/sei-help-web/#/sei-help-web/postDetail/${it.id}?_s=${this.currentUser.sessionId}`}
                                  style={{
                                    padding: '5px',
                                  }}
                                >
                                  {it.title}
                                </a>
                              ))
                            : null}
                        </div>
                      </span>
                    </>
                  }
                />
              </List.Item>
            );
          }}
        ></List>
      );
    }

    return (
      <Divider className={cls('empty-wrapper')} dashed>
        请在下方输入关键进行提问
      </Divider>
    );
  };

  getAnswers = (quickSearchValue, tempId) => {
    getAnswers({ quickSearchValue }).then(result => {
      const { success, message: msg, data } = result;
      if (success) {
        const { dialogRecords } = this.state;
        this.setState(
          {
            dialogRecords: dialogRecords.map(item => {
              if (item.id === tempId) {
                item.loading = false;
                item.data = data.rows;
              }

              return item;
            }),
          },
          () => {
            if (this.scrollBarRef) {
              this.scrollBarRef.scrollTop = 100000;
            }
          },
        );
      } else {
        message.error(msg);
      }
    });
  };

  render() {
    const { title = '小智', visible, onClose } = this.props;
    const { searchVal } = this.state;

    return (
      <ExtModal
        wrapClassName={cls(styles['dialog-box'])}
        title={
          <span>
            <Avatar style={{ backgroundColor: '#87d068' }} icon="robot" />
            {` ${title}`}
          </span>
        }
        visible={visible}
        footer={null}
        width={700}
        // mask={false}
        bodyStyle={{
          height: 500,
          padding: 0,
        }}
        onCancel={onClose}
        // maskClosable={false}
        closeIcon={<ExtIcon type="minus" antd tooltip={{ title: '最小化' }} />}
      >
        <Row className={cls('item-height')} gutter={8}>
          <Col className={cls('item-height')} span={16}>
            <Row className={cls('item-height')} gutter={8}>
              <Col className={cls('dialog-content')}>
                <ScrollBar containerRef={inst => (this.scrollBarRef = inst)}>
                  {this.getDialogContentCmp()}
                </ScrollBar>
              </Col>
              <Col className={cls('dialog-input')}>
                <TextArea
                  ref={inst => (this.textAreaRef = inst)}
                  autoFocus
                  value={searchVal}
                  onKeyDown={this.handleKeyDown}
                  onChange={e => {
                    this.setState({
                      searchVal: e.target.value,
                    });
                  }}
                />
                <div className={cls('dialog-opt')}>
                  <Button type="primary" onClick={this.handleSend}>
                    发送
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
          <Col className={cls('item-height')} span={8}>
            <Row className={cls('item-right')}>
              <Col className={cls('item-right-top')}>
                <a
                  href={`/sei-help-web/#/sei-help-web/sso?_s=${this.currentUser.sessionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExtIcon type="question-circle" style={{ fontSize: 16 }} antd />
                  {` 前往帮助中心`}
                </a>
              </Col>
              <Col className={cls('item-right-center')}>
                <HotPostList />
              </Col>
              <Col className={cls('item-right-bottom')}>
                <ContactList />
              </Col>
            </Row>
          </Col>
        </Row>
      </ExtModal>
    );
  }
}

export default DialogBox;
