import React, { Component } from 'react';
import { Card, Empty } from 'antd';
import { ExtEcharts } from 'seid';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import { userInfoOperation, CONSTANTS } from '@/utils';
import styles from './index.less';

const { getCurrentUser } = userInfoOperation;
const { COPYRIGHTTEXT } = CONSTANTS;

const barProps = {
  onChartReady: () => {},
  onEvents: {
    click: () => {},
  },
  option: {
    color: ['#003366', '#006699', '#4cabce', '#e5323e'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['Forest', 'Steppe', 'Desert', 'Wetland'],
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['2012', '2013', '2014', '2015', '2016'],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Forest',
        type: 'bar',
        barGap: 0,
        data: [320, 332, 301, 334, 390],
      },
      {
        name: 'Steppe',
        type: 'bar',
        data: [220, 182, 191, 234, 290],
      },
      {
        name: 'Desert',
        type: 'bar',
        data: [150, 232, 201, 154, 190],
      },
      {
        name: 'Wetland',
        type: 'bar',
        data: [98, 77, 101, 99, 40],
      },
    ],
  },
};

const pieProps = {
  onChartReady: () => {},
  onEvents: {
    click: () => {},
  },
  option: {
    title: {
      text: '用户订单',
      x: 'center',
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a}<br/>{b}:{c}({d}%)',
    },
    series: [
      {
        name: '订单量',
        type: 'pie',
        data: [
          {
            value: 1000,
            name: '周一',
          },
          {
            value: 1000,
            name: '周二',
          },
          {
            value: 2000,
            name: '周三',
          },
          {
            value: 1500,
            name: '周四',
          },
          {
            value: 3000,
            name: '周五',
          },
          {
            value: 2000,
            name: '周六',
          },
          {
            value: 1200,
            name: '周日',
          },
        ],
      },
    ],
  },
};

const lineProps = {
  onChartReady: () => {},
  onEvents: {
    click: () => {},
  },
  option: {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['访问IP数', '访问次数'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '访问IP数',
        type: 'line',
        stack: '总量',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '访问次数',
        type: 'line',
        stack: '总量',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
    ],
  },
};

export default class DashBoard extends Component {
  /** 获取自定义组件 */
  getCustomCmp = () => {
    const bodyStyle = { height: 400 };
    const style = {
      marginBottom: 10,
    };
    return (
      <>
        <Card style={style} title="用户订单" bordered={false} bodyStyle={bodyStyle}>
          <ExtEcharts {...pieProps} />
        </Card>

        <Card style={style} title="用户柱状图" bordered={false} bodyStyle={bodyStyle}>
          <ExtEcharts {...barProps} />
        </Card>

        <Card title="用户访问量" bordered={false} bodyStyle={bodyStyle}>
          <ExtEcharts {...lineProps} />
        </Card>
      </>
    );
  };

  getQuickMenuCard = () => (
    <Card
      title="收藏菜单"
      bordered={false}
      bodyStyle={{
        minHeight: 400,
        overflow: 'auto',
        padding: 12,
      }}
    >
      <Empty description="暂无菜单" />
    </Card>
  );

  getMessageCard = () => (
    <Card
      title="消息"
      bordered={false}
      style={{ marginTop: '10' }}
      bodyStyle={{
        minHeight: 400,
        overflow: 'auto',
        padding: 12,
      }}
      extra={<a>更多</a>}
    >
      <Empty description="暂无消息" />
    </Card>
  );

  getOtherCard = () => (
    <Card
      title="其他信息"
      bordered={false}
      style={{ marginTop: '10' }}
      bodyStyle={{
        minHeight: 400,
        overflow: 'auto',
        padding: 12,
      }}
    >
      <Empty description="" />
    </Card>
  );

  getUserGreeting = () =>
    formatMessage({ id: 'dashboard.welcome' }, [
      moment(new Date()).format('A'),
      getCurrentUser().userName,
    ]);

  getUserInfo = () => '开发人员-基础平台部-虹信软件股份有限公司';

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
          <h2>{this.getUserGreeting()}</h2>
          <p>{this.getUserInfo()}</p>
        </header>
        <section className="dashboard-wrapper-content">
          <div className="dashboard-wc-left">{this.getCustomCmp()}</div>
          <div className="dashboard-wc-right">
            {this.getQuickMenuCard()}
            <div style={{ margin: '5px 0' }}></div>
            {this.getMessageCard()}
            <div style={{ margin: '5px 0' }}></div>
            {this.getOtherCard()}
          </div>
        </section>
        <footer className="dashboard-wrapper-footer">{COPYRIGHTTEXT}</footer>
      </section>
    );
  }
}
