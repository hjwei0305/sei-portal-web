import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Row, Col, Drawer } from 'antd';
import { ExtIcon, ScrollBar } from 'suid';

import styles from './index.less';

const tempImgHolder =
  'data:image/png;base64,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';

@connect(({ menu }) => ({ menu }))
export default class SelectModule extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showShadow: false,
    };
  }

  handleClick = currMenuTree => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateState',
      payload: {
        currMenuTree,
      },
    });
    this.handlerClose();
  };

  handlerVisibleChange = visible => {
    this.setState({
      visible,
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  handlerClose = () => {
    this.setState({
      visible: false,
    });
  };

  handerScrollDown = () => {
    this.setState({ showShadow: true });
  };

  handerYReachStart = () => {
    this.setState({ showShadow: false });
  };

  renderAppList = () => {
    const { menu } = this.props;
    const { menuTrees, currMenuTree } = menu;
    return (
      <div
        ref={ref => {
          this.appElm = ref;
        }}
        className={cls('app-box-wrapper')}
      >
        <ScrollBar onYReachStart={this.handerYReachStart} onScrollDown={this.handerScrollDown}>
          <Row className={cls('app-box')} gutter={0}>
            {menuTrees.map(menuTree => {
              const { appBase64ImgStr, id } = menuTree;
              return (
                <Col
                  span={8}
                  key={id}
                  className={cls('app-item-wrap')}
                  onClick={() => this.handleClick(menuTree)}
                >
                  <div className="logo-wrap">
                    <div
                      className={cls({
                        'app-logo': true,
                        actived: currMenuTree.id === id,
                      })}
                    >
                      <img alt="应用图标" src={appBase64ImgStr || tempImgHolder} />
                    </div>
                  </div>
                  <div title={menuTree.title} className={cls('desc')}>
                    {menuTree.title}
                  </div>
                </Col>
              );
            })}
          </Row>
        </ScrollBar>
      </div>
    );
  };

  renderTitle = () => (
    <>
      <ExtIcon
        type="app"
        onClick={this.handlerClose}
        style={{ fontSize: '16px', marginRight: '24px', color: '#a6a6a6' }}
      />
      我的应用
    </>
  );

  render() {
    const { menu } = this.props;
    const { currMenuTree } = menu;
    const { visible, showShadow } = this.state;
    const headerStyle = {
      boxShadow: showShadow ? ' 0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
    };
    return (
      <>
        <span className={cls('trigger', { 'trigger-open': visible })} onClick={this.showDrawer}>
          <span className="title">{currMenuTree ? currMenuTree.title : '加载中...'}</span>
          <ExtIcon type="app" style={{ fontSize: '16px', marginLeft: '6px', color: '#a6a6a6' }} />
        </span>
        <Drawer
          headerStyle={headerStyle}
          title={this.renderTitle()}
          visible={visible}
          placement="left"
          maskClosable
          width={325}
          closable={false}
          maskStyle={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
          onClose={this.handlerClose}
          className={cls(styles['select-module-wrapper'])}
          afterVisibleChange={this.handlerVisibleChange}
        >
          {this.renderAppList()}
        </Drawer>
      </>
    );
  }
}
