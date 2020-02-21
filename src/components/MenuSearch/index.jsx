import React from 'react';
import propTypes from 'prop-types';
import { noop } from 'lodash';
import { Icon, Modal, Input } from 'antd';
import { ScrollBar, } from 'seid';
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
    /** 搜索占位字符串 */
    placeholder: propTypes.string,
  };

  static defaultProps = {
    className: '',
    data: [],
    showField: 'title',
    onSelect: noop,
    placeholder: '输入关键字搜索',
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      /** 过滤后数据 */
      filterData: [],
    };
  }

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
        <p>{item.urlPath.slice(1)}</p>
      </li>
    ));
  };

  render() {
    const { className, placeholder } = this.props;

    return (
      <React.Fragment>
        <span onClick={this.handleClick} className={className}>
          <Icon type="search" />
        </span>
        <Modal {...this.getModalProps()}>
          <Search placeholder={placeholder} onSearch={this.handleSearch} enterButton />
          <ul style={{ maxHeight: 400, overflow: 'auto', }}>
            <ScrollBar>
              {this.getFilterDataCmp()}
            </ScrollBar>
          </ul>
        </Modal>
      </React.Fragment>
    );
  }
}
