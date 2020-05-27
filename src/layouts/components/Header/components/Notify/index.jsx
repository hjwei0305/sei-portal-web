import React from 'react';
import { Tooltip, Badge, Icon, Dropdown, Card, List, Avatar, Tabs, Skeleton, Empty } from 'antd';
import cls from 'classnames';
import { eventBus } from '@/utils';
import {
  getMessageList,
  getMessageCount,
  getCurrenOnetBulletin,
  getCategory,
} from '@/services/message';
import MsgDetail from './Detail';
import msgLogo from './imgs/msg.png';
import styles from './index.less';

const { TabPane } = Tabs;

export default class index extends React.Component {
  cateGoryMap = {};

  constructor(props) {
    super(props);
    this.state = {
      isDetail: false,
      isFirst: false,
      messageTypeData: {},
      visible: false,
      loading: false,
      messageCount: 0,
    };
  }

  componentDidMount() {
    this.getMessageCount();
    this.messageCountInterval = setInterval(() => {
      this.getMessageCount();
    }, 36000);
    getCurrenOnetBulletin().then(result => {
      const { data, success } = result;
      if (success && data) {
        this.msg = data;
        this.setState({
          isDetail: true,
          isFirst: true,
        });
      }
    });
    getCategory().then(result => {
      const { success, data } = result || {};
      if (success) {
        this.cateGoryMap = data || {};
      }
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.messageCountInterval);
  }

  getMessageCount = () => {
    getMessageCount().then(result => {
      const { success, data: messageCount } = result || {};
      if (success) {
        this.setState({
          messageCount,
        });
      }
    });
  };

  getMessageList = () => {
    getMessageList().then(result => {
      const { success, data } = result;
      if (success) {
        this.setState({
          messageTypeData: data,
          loading: false,
        });
      }
    });
  };

  handleViewDetail = (item, e) => {
    const { onViewDetail } = this.props;
    this.msg = item;
    this.setState(
      {
        isDetail: true,
        isFirst: false,
        visible: false,
      },
      () => {
        if (onViewDetail) {
          onViewDetail(item);
        }
      },
    );
    e.stopPropagation();
  };

  getTab = () => {
    const { messageTypeData } = this.state;
    return (
      <div
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {Object.entries(messageTypeData).length ? (
          <Tabs
            onChange={key => {
              this.TabKey = key;
            }}
          >
            {Object.entries(messageTypeData).map((item, idx) => {
              if (idx === 0) {
                [this.TabKey] = item;
              }
              return this.getTabPane(item);
            })}
          </Tabs>
        ) : (
          <>
            <Empty description="暂无消息" />
            {this.getMoreRender()}
          </>
        )}
      </div>
    );
  };

  getTabPane = ([type, data]) => (
    <TabPane
      key={type}
      tab={`${this.cateGoryMap[type]}(${data.length})`}
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={data.slice(0, 5)}
        renderItem={item => (
          <List.Item
            className={cls(styles['custom_ant-list-item'])}
            onClick={e => {
              this.handleViewDetail(item, e);
            }}
          >
            <List.Item.Meta
              avatar={<Avatar src={msgLogo} />}
              title={<a>{item.subject}</a>}
              description={`${item.priorityRemark}`}
            />
          </List.Item>
        )}
      />
      {this.getMoreRender()}
    </TabPane>
  );

  getMoreRender = () => (
    <div
      style={{
        height: '46px',
        borderTop: '1px solid #e8e8e8',
        borderRadius: '0 0 4px 4px',
        color: 'rgba(0,0,0,.65)',
        lineHeight: '46px',
        textAlign: 'center',
        transition: 'all .3s',
        cursor: 'pointer',
      }}
      onClick={() => {
        eventBus.emit('openTab', {
          id: 'userMessageView',
          title: '用户消息',
          url: `/sei-notify-web/metaData/userBulletin?category=${this.TabKey}`,
        });
        this.setState({
          visible: false,
        });
      }}
    >
      查看更多内容
    </div>
  );

  toggleViewNotify = () => {
    this.setState({
      isDetail: false,
      isFirst: false,
    });
  };

  getDropdownProps = () => {
    const { visible, loading } = this.state;
    return {
      overlay: (
        <div>
          <Card bodyStyle={{ width: 350, padding: 0 }}>
            <Skeleton loading={loading} active>
              {this.getTab()}
            </Skeleton>
          </Card>
        </div>
      ),
      visible,
      placement: 'bottomLeft',
      trigger: ['click'],
      onVisibleChange: show => {
        this.setState({
          visible: show,
          loading: show,
        });
        if (show) {
          this.getMessageList();
        }
      },
    };
  };

  render() {
    const { messageCount, isDetail, isFirst } = this.state;
    const { className } = this.props;
    // seiIntl.get({key: "app.help-online", desc: "用户服务中心"})
    return (
      <React.Fragment>
        <Dropdown {...this.getDropdownProps()}>
          <Tooltip title="用户消息">
            <span className={className}>
              <Badge count={messageCount}>
                <Icon type="bell" style={{ padding: 6, fontSize: 20 }} />
              </Badge>
            </span>
          </Tooltip>
        </Dropdown>
        {isDetail ? (
          <MsgDetail
            key={Math.random()}
            id={this.msg.id}
            isFirst={isFirst}
            msgCategory={this.msg.category}
            toggleView={() => {
              this.toggleViewNotify();
            }}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
