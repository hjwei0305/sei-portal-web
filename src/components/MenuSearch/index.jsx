import React from 'react';
import propTypes from 'prop-types';
import { noop } from 'lodash';
import { Input, Popover, Empty } from 'antd';
import { ScrollBar } from 'suid';
import styles from './index.less';

const { Search } = Input;

export default class MenuSearch extends React.Component {
  static propTypes = {
    /** 外部样式 */
    // className: propTypes.string,
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
    // className: '',
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

  handleVisibleChange = visible => {
    if (!visible) {
      this.setState({ visible });
    }
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
      visible: true,
    });
  };

  getFilterDataCmp = () => {
    const { filterData } = this.state;
    const { showField } = this.props;
    if (filterData && filterData.length) {
      return filterData.map(item => (
        <li key={item.id} onClick={() => this.handleSelect(item)}>
          {item[showField]}
          <p>{item.urlPath.slice(1)}</p>
        </li>
      ));
    }

    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  };

  render() {
    const { placeholder } = this.props;

    return (
      <React.Fragment>
        <Popover
          overlayClassName={styles['popver-wrapper']}
          placement="bottomLeft"
          content={
            <ul
              className={styles['menu-search-popver-content']}
              style={{ maxHeight: 400, overflow: 'auto' }}
            >
              <ScrollBar>{this.getFilterDataCmp()}</ScrollBar>
            </ul>
          }
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Search placeholder={placeholder} onSearch={this.handleSearch} />
        </Popover>
      </React.Fragment>
    );
  }
}
