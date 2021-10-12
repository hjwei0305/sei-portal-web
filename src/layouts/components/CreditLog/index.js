import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Drawer, Tooltip } from 'antd';
import { ListCard, Space, BannerTitle } from 'suid';
import { CONSTANTS, userInfoOperation } from '@/utils';
import styles from './index.less';

const { BASEURL } = CONSTANTS;
const { getCurrentUser } = userInfoOperation;
const { Search } = Input;

class LogList extends Component {
  static listCardRef;

  static propTypes = {
    showLog: PropTypes.bool,
    closeLog: PropTypes.func,
  };

  handlerClose = () => {
    const { closeLog } = this.props;
    if (closeLog) {
      closeLog();
    }
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  renderCustomTool = () => {
    const placeholder = formatMessage(
      { id: 'app.search.tip', defaultMessage: '输入{field}关键字查询' },
      {
        field: `${formatMessage({
          id: 'creditRecord.log.event',
          defaultMessage: '考核事件',
        })}、${formatMessage({ id: 'creditRecord.log.eventNote', defaultMessage: '事件说明' })}`,
      },
    );
    return (
      <>
        <Search
          placeholder={placeholder}
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerPressEnter}
          style={{ width: '100%' }}
        />
      </>
    );
  };

  renderTitle = item => {
    const tipTitle = formatMessage({ id: 'creditRecord.log.source', defaultMessage: '考核来源' });
    return (
      <Space>
        <Tooltip title={`${tipTitle}:${item.source}`}>{item.event}</Tooltip>
        <Tooltip title={item.createdDate}>
          <em style={{ fontSize: 10, color: '#999' }}>{`${moment(item.createdDate).fromNow()}`}</em>
        </Tooltip>
      </Space>
    );
  };

  renderScore = item => {
    const score = get(item, 'score');
    return (
      <Space direction="vertical" size={0}>
        <Tooltip
          title={formatMessage({ id: 'creditRecord.log.score', defaultMessage: '分值变化' })}
        >
          <div
            style={{
              color: score >= 0 ? '#52c41a' : '#f5222d',
              backgroundColor: 'transparent',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {score}
          </div>
        </Tooltip>
      </Space>
    );
  };

  render() {
    const { showLog } = this.props;
    const userData = getCurrentUser() || {};
    const listCardProps = {
      showSearch: false,
      onSelectChange: this.handlerSelectRow,
      showArrow: false,
      searchProperties: ['event', 'eventNote'],
      itemField: {
        title: this.renderTitle,
        description: item => item.eventNote,
        extra: this.renderScore,
      },
      onListCardRef: ref => (this.listCardRef = ref),
      customTool: this.renderCustomTool,
    };
    if (showLog) {
      Object.assign(listCardProps, {
        store: {
          url: `${BASEURL}/soms-v6/employeeCreditLog/findByEmployee`,
        },
        cascadeParams: {
          employeeCode: get(userData, 'credit.employeeCode'),
        },
      });
    }
    return (
      <Drawer
        width={460}
        destroyOnClose
        getContainer={false}
        placement="right"
        visible={showLog}
        title={
          <BannerTitle
            title={formatMessage({ id: 'my', defaultMessage: '我的' })}
            subTitle={formatMessage({ id: 'my.credit.log', defaultMessage: '信用记录' })}
          />
        }
        className={cls(styles['container-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        <ListCard {...listCardProps} />
      </Drawer>
    );
  }
}

export default LogList;
