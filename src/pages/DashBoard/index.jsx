import React, { Component } from 'react';
import { Button, Card } from 'antd';
import { userInfoOperation } from '@/utils';
import styles from './index.less';

const { getCurrentUser } = userInfoOperation;

const copyrightText =
  'Copyright 2015 www.changhong.com All Rights Reserved 四川长虹电器股份有限公司 版权所有';

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configMenus: [],
    };
  }

  /** 获取催办card组件 */
  getUrgeToDoCard = () => (
    <Card
      title="自定义内容"
      bordered={false}
      style={{
        minHeight: 400,
      }}
    >
      <Card.Grid>自定义内容</Card.Grid>
      <Card.Grid>自定义内容</Card.Grid>
      <Card.Grid>自定义内容</Card.Grid>
    </Card>
  );

  getQuickMenuCard = () => {
    const { configMenus } = this.state;

    return (
      <Card
        title="收藏菜单(16)"
        bordered={false}
        bodyStyle={{
          minHeight: 150,
          overflow: 'auto',
          padding: 12,
        }}
      >
        {configMenus.map(item => (
          <Button key={item.id} className={styles.btnLink} title={item.menu.name}>
            <span
              style={{
                width: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.menu.name}
            </span>
          </Button>
        ))}
      </Card>
    );
  };

  getMessageCard = () => {
    const { configMenus } = this.state;

    return (
      <Card
        title="消息"
        bordered={false}
        style={{ marginTop: '10' }}
        bodyStyle={{
          minHeight: 150,
          overflow: 'auto',
          padding: 12,
        }}
        extra={<a>更多</a>}
      >
        {configMenus.map(item => (
          <Button key={item.id} className={styles.btnLink} title={item.menu.name}>
            <span
              style={{
                width: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.menu.name}
            </span>
          </Button>
        ))}
      </Card>
    );
  };

  render() {
    return (
      <section className={styles['dashboard-wrapper']}>
        <header className="dashboard-wrapper-header">
          <div className="work-wrapper">
            <ul>
              <li>
                <div>待办</div>
                <a>4</a>
              </li>
              <li>
                <div>已办</div>
                <a>20</a>
              </li>
              <li>
                <div>我的单据</div>
                <a>32</a>
              </li>
            </ul>
          </div>
          <h2>{getCurrentUser().userName}，祝您生活愉快！</h2>
          <p>开发人员-基础平台部-虹信软件股份有限公司</p>
        </header>
        <section className="dashboard-wrapper-content">
          <div className="dashboard-wc-left">{this.getUrgeToDoCard()}</div>
          <div className="dashboard-wc-right">
            {this.getQuickMenuCard()}
            <div style={{ margin: '5px 0' }}></div>
            {this.getMessageCard()}
          </div>
        </section>
        <footer className="dashboard-wrapper-footer">{copyrightText}</footer>
      </section>
    );
  }
}

export default DashBoard;
