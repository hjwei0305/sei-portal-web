import {Button, message, Modal, Tree, Input, Col, Card, Row, Icon, Badge} from "antd";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, {Component} from "react";
import {isEmpty, cloneDeep, get,} from "lodash";
import { StationNewsCard, RichEditor } from 'seid';
import styles from './style.less';

class DashBoard extends Component {
  static propTypes = {
    // 用户id，不传从sessionStorage里取
    userId: PropTypes.string,
    // 用户名称，不传从sessionStorage里取
    userName: PropTypes.string,
    // 标语，默认为{您好！${userName}，祝您工作愉快！}
    slogan: PropTypes.string,
    // ref回调，用作上层组件调用更新方法
    onRef: PropTypes.func
  };

  static defaultProps = {
    slogan: null,
    onRef: () => {
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      chooseMenuVisable: false,
      treeLoading: false,
      flowLoading: false,
      configMenus: [],
      todoSum: 0,
      billSum: 0,
      expandedKeys: [],
      selectedKeys: [],
      autoExpandParent: true,
      allMenus: []
    };
  }

  componentDidMount() {
    const {onRef} = this.props;
    onRef(this);
  }

  getToDoCard = () => {
    const {todoSum, billSum,} = this.state;
    return (
      <Card
        title="我的待办"
        style={{
          marginTop: 10,
        }}
      >
        <Card.Grid>
          <Badge count={todoSum} offset={[20, 8]}>
            <a onClick={() => {
            this.actionClick('flowDetail')
          }}>我的待办</a>
          </Badge>
        </Card.Grid>
        <Card.Grid>
          <Badge offset={[20, 8]}>
            <a onClick={() => {
            this.actionClick('complete')
          }}>我的已办</a>
          </Badge>
        </Card.Grid>
        <Card.Grid>
          <Badge count={billSum} offset={[20, 8]}>
            <a onClick={() => {
            this.actionClick('myDetail')
          }}>我的单据</a>
          </Badge>
        </Card.Grid>
      </Card>
    );
  }
  /** 获取催办card组件 */
  getUrgeToDoCard = () => {
    return (
      <Card
        title="我的崔办"
        style={{
          marginTop: 10,
          minHeight: 400,
        }}
      >
        <Card.Grid>
          寻源管理
        </Card.Grid>
        <Card.Grid>
          定价管理
        </Card.Grid>
        <Card.Grid>
          订单管理
        </Card.Grid>
      </Card>
    );
  }

  getQuickMenuCard = () => {
    const {configMenus,} = this.state;

    return (
      <Card
        title="快速开始/便捷导航"
        style={{
          marginTop: 10,
        }}
        bodyStyle={{
          maxHeight: 150,
          overflow: 'auto',
          padding: 12,
        }}
      >
        {configMenus.map((item, index) => {
          return (
            <Button
              key={item.id}
              className={styles.btnLink}
              title={item.menu.name}
            >
              <span style={{
                width: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{item.menu.name}</span>
            </Button>
          );
        })}
        <Button style={{marginLeft: 13, height: 28, verticalAlign: 'top'}} type="dashed"
                onClick={() => this.actionClick("addMenu")}>
          {'+ 添加'}
        </Button>
      </Card>
    );
  }

  renderCmp = contextLocale => {
    const {
      loading,
      chooseMenuVisable,
      selectedKeys,
      allMenus,
      expandedKeys,
      autoExpandParent,
      configMenus,
      todoSum,
      billSum,
      treeLoading,
    } = this.state;

    const {children, customLocale, userName = "测试", slogan} = this.props;
    const locale = {...contextLocale, ...customLocale};
    this.locale = locale;
    return (
      <div
        style={{
          overflow: 'auto',
          height: '100%',
          backgroundColor: '#e5e4e4',
        }}
      >
        <Row type="flex" justify="space-between" className={styles.breadExtra}>
          <Col
            style={{
              display: "flex",
              alignItems: "center",
              height: 0,
            }}
          >
            {/*头部信息*/}
          </Col>
        </Row>

        <Row>
          <Col span={16} style={{
            padding: '0 10px',
          }}>
            {this.getToDoCard()}
            {
              this.getUrgeToDoCard()
            }
          </Col>
          <Col span={8} style={{
            padding: '0 10px',
          }}>
            {this.getQuickMenuCard()}
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    return (
      <>
        {this.renderCmp()}
      </>
    );
  }
}

export default DashBoard;
