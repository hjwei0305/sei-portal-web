import React from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import { message } from 'suid';
import { weiXinUtils } from '@/utils';

import withUrlQs from '@/components/withUrlQs';

@withUrlQs
@connect(({ user, loading }) => ({ user, loading }))
export default class SsoWrapperPage extends React.PureComponent {
  componentDidMount() {
    const { dispatch, urlQsObj } = this.props;
    if (urlQsObj.sid) {
      if (weiXinUtils.isWeiXin()) {
        router.replace(`/sso/wxTurnPage?sid=${urlQsObj.sid}`);
      } else {
        dispatch({
          type: 'user/getUserByXsid',
          payload: {
            sid: urlQsObj.sid,
          },
        });
      }
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
