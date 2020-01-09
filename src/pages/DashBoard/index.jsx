import React, { Component } from 'react';
import { Button, Card } from 'antd';
import styles from './index.less';

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
      title="我的崔办"
      bordered={false}
      style={{
        minHeight: 400,
      }}
    >
      <Card.Grid>寻源管理</Card.Grid>
      <Card.Grid>定价管理</Card.Grid>
      <Card.Grid>订单管理</Card.Grid>
    </Card>
  );

  getQuickMenuCard = () => {
    const { configMenus } = this.state;

    return (
      <Card
        title="收藏菜单(16)"
        bordered={false}
        bodyStyle={{
          maxHeight: 150,
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
          <h2>早安，张盼，祝您生活愉快！</h2>
          <p>开发人员-基础平台部-虹信软件股份有限公司</p>
        </header>
        <section className="dashboard-wrapper-content">
          <div className="dashboard-wc-left">{this.getUrgeToDoCard()}</div>
          <div className="dashboard-wc-right">{this.getQuickMenuCard()}</div>
        </section>
      </section>
    );
  }
}

export default DashBoard;
