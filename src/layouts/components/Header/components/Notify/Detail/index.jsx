import React from 'react';
import { Skeleton, message, Divider, Empty, Row, Col, Button, Modal } from 'antd';
import { getById, hasKonwn } from '@/services/message';

export default class index extends React.Component {
  state = {
    detail: null,
    loading: false,
  };

  componentDidMount() {
    const { id } = this.props;
    if (id) {
      this.setState({
        loading: true,
      });
      getById({ id })
        .then(result => {
          const { success, data } = result || {};
          if (success) {
            this.setState({
              detail: data,
            });
          }
          this.setState({
            loading: false,
          });
        })
        .catch(err => {
          this.setState(
            {
              loading: false,
            },
            () => {
              message.error(err.message);
            },
          );
        });
    }
  }

  handleBtn = () => {
    const { toggleView } = this.props;
    if (toggleView) {
      toggleView();
    }
  };

  handleHaveKnown = () => {
    const { id } = this.props;
    this.handleBtn();
    hasKonwn({ id, category: 'SEI_BULLETIN' });
  };

  getModalProps = () => ({
    title: '通告详情',
    visible: true,
    width: '80%',
    bodyStyle: {
      // height: 400,
      overflow: 'auto',
    },
    okText: '知道了',
    onCancel: () => {
      this.handleBtn();
    },
    footer: [
      <Button key="submit" type="primary" onClick={this.handleHaveKnown}>
        知道了
      </Button>,
    ],
  });

  render() {
    const { loading, detail } = this.state;
    return (
      <Modal {...this.getModalProps()}>
        <Skeleton loading={loading} active>
          {detail ? (
            <React.Fragment>
              <h1 style={{ padding: 0, textAlign: 'center', fontSize: 20 }}>{detail.subject}</h1>
              <h5 style={{ display: 'inline-block', marginRight: 5 }}>
                有效期：{`${detail.effectiveDate}~${detail.invalidDate}`}
              </h5>
              <h5 style={{ display: 'inline-block' }}>优先级：{`${detail.priorityRemark}`}</h5>
              <Divider
                style={{
                  marginTop: 5,
                }}
              />

              <div
                style={{
                  backgroundColor: 'rgba(208, 205, 205, 0.2)',
                  padding: '12px',
                  color: 'rgba(0, 0, 0, 0.65)',
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: detail.content }}></div>
              </div>
              {/* <Divider style={{
                  marginBottom: -20
                }} dashed={true}>附件{`【${attachNum}】`}</Divider>
                <OrderFileUpload
                  viewType="card"
                  disabled
                  domain={check_host}
                  entityId = {detail.id}
                  onChange = { (docIds) => {
                    this.setState({
                      attachNum: docIds.length
                    });
                  } }
                /> */}
              <Row
                type="flex"
                style={{
                  justifyContent: 'flex-end',
                }}
              >
                <Col
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      marginBottom: 5,
                    }}
                  >
                    {detail.createName}
                  </div>
                  <div>{detail.createTime}</div>
                </Col>
              </Row>
            </React.Fragment>
          ) : (
            <Empty />
          )}
        </Skeleton>
      </Modal>
    );
  }
}
