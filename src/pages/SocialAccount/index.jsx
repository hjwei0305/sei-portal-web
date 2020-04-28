import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from 'antd';
import { connect } from 'dva';
import md5 from 'md5';
import queryString from 'query-string';
import BindForm from './Form';
import styles from './index.less';

@connect(({ user, loading }) => ({ user, loading }))
export default class SocialAccount extends Component {
  constructor(props) {
    super(props);
    this.queryParams = queryString.parse(window.location.href.split('?')[1]);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.handleBind();
    }
  };

  handleBind = e => {
    const { dispatch } = this.props;
    this.bindFormRef.onSubmit().then(values => {
      dispatch({
        type: 'user/bindingSocialAccount',
        payload: { ...values, password: md5(values.password) },
      });
    });
    if (e) {
      e.preventDefault();
    }
  };

  render() {
    const { loading } = this.props;
    const { tenant, openId } = this.queryParams;
    const isLoading = loading.effects['user/bindingSocialAccount'];

    return (
      <>
        <Helmet>
          <title>帐号绑定</title>
          <meta name="description" content="帐号绑定" />
        </Helmet>
        <div className={styles['bind-warpper']}>
          <BindForm
            onRef={inst => {
              this.bindFormRef = inst;
            }}
            tenant={tenant}
            openId={openId}
            loading={isLoading}
          >
            <Button
              loading={isLoading}
              type="primary"
              onClick={this.handleBind}
              className="bind-form-button"
            >
              {!isLoading ? '绑定' : '绑定中...'}
            </Button>
          </BindForm>
        </div>
      </>
    );
  }
}
