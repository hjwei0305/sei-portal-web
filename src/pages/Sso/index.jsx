import React from 'react';
import { Spin, message } from 'antd';
import { connect } from 'dva';
import withUrlQs from '@/components/withUrlQs';

@withUrlQs
@connect(({ user, loading }) => ({ user, loading }))
export default class SsoWrapperPage extends React.PureComponent {
  componentDidMount() {
    const { dispatch, urlQsObj } = this.props;
    if (urlQsObj.sid) {
      dispatch({
        type: 'user/getUserByXsid',
        payload: {
          sid: urlQsObj.sid,
        },
      });
    } else {
      message.error('您没有权限');
    }
  }

  render() {
    const { loading } = this.props;

    return (
      <Spin spinning={loading.effects['user/getUserByXsid']}>
        <div
          style={{
            height: 'calc(100vh)',
          }}
        ></div>
      </Spin>
    );
  }
}
