import React from 'react';
import propTypes from 'prop-types';
import { noop } from 'lodash';
import { Icon, Modal, Input } from 'antd';
import styles from './index.less';

const { Search } = Input;

export default class MenuSearch extends React.Component {
  static propTypes = {
    /** 外部样式 */
    className: propTypes.string,
    /** 菜单数据 */
    data: propTypes.array,
    /** 选中后回调事件 */
    onSelect: propTypes.func,
    /** 显示字段 */
    showField: propTypes.string,
  };

  static defaultProps = {
    className: '',
    data: [
      {
        id: '59C01B9D-DDD7-11E9-AB96-0242C0A8442那你',
        code: '91039',
        name: '示例',
        rank: 0,
        nodeLevel: 2,
        parentId: '2E7F3BA3-DDDA-11E9-A9A9-0242C0A84421mm',
        codePath: '|91036|91038|91039',
        namePath: '/消息管理/通告/示例',
        children: null,
        featureCode: 'NOTIFY-TGGL-FB',
        featureUrl: '/sei-basic-web/dashboard',
        iconCls: '',
      },
      {
        id: '59C01B9D-DDD7-11E9-AB96-0242C0A84421',
        code: '91039',
        name: '通告发布',
        rank: 0,
        nodeLevel: 2,
        parentId: '2E7F3BA3-DDDA-11E9-A9A9-0242C0A84421',
        codePath: '|91036|91038|91039',
        namePath: '/消息管理/通告/通告发布',
        children: null,
        featureCode: 'NOTIFY-TGGL-FB',
        featureUrl: '/sei-basic-web/moduleName/demo',
        iconCls: '',
      },
    ],
    showField: 'name',
    onSelect: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      /** 过滤后数据 */
      filterData: [],
    };
  }

  // static getDerivedStateFromProps(nextProps) {
  //   return {
  //     filterData: cloneDeep(nextProps.data),
  //   }
  // }

  /** 获取弹框属性 */
  getModalProps = () => {
    const { visible } = this.state;

    return {
      visible,
      style: {
        top: 0,
      },
      closable: false,
      footer: null,
      wrapClassName: styles['menu-search-wrapper-modal'],
      onCancel: () => {
        this.setState({
          visible: false,
        });
      },
    };
  };

  handleClick = () => {
    this.setState({
      visible: true,
    });
  };

  handleSelect = item => {
    const { onSelect } = this.props;

    this.setState(
      {
        visible: false,
      },
      () => {
        onSelect(item);
      },
    );
  };

  handleSearch = value => {
    const { showField, data } = this.props;

    this.setState({
      filterData: data.filter(item => item[showField].includes(value)),
    });
  };

  getFilterDataCmp = () => {
    const { filterData } = this.state;
    const { showField } = this.props;

    return filterData.map(item => (
      <li key={item.id} onClick={() => this.handleSelect(item)}>
        {item[showField]}
        <p>{item.namePath.slice(1)}</p>
      </li>
    ));
  };

  render() {
    const { className } = this.props;

    return (
      <React.Fragment>
        <span onClick={this.handleClick} className={className}>
          <Icon type="search" />
        </span>
        <Modal {...this.getModalProps()}>
          <Search placeholder="输入关键字搜索" onSearch={this.handleSearch} enterButton />
          <ul>{this.getFilterDataCmp()}</ul>
        </Modal>
      </React.Fragment>
    );
  }
}
