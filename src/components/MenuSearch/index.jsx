import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import { noop, groupBy } from 'lodash';
import { Input, Popover, Empty, Divider } from 'antd';
import { ScrollBar } from 'suid';
import cls from 'classnames';
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
    placeholder: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
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
      searchValue: value,
    });
  };

  getFilterDataCmp = () => {
    const { filterData, searchValue } = this.state;
    const { showField } = this.props;
    if (filterData && filterData.length) {
      const menuMaps = groupBy(filterData, 'rootName');
      const mapKeys = Object.keys(menuMaps);
      return mapKeys.map(mapKey => (
        <Fragment>
          <Divider>{mapKey}</Divider>
          <ul key={mapKey}>
            {menuMaps[mapKey].map((item, idx) => {
              const index = item[showField].indexOf(searchValue);
              const beforeStr = item[showField].substr(0, index);
              const afterStr = item[showField].substr(index + searchValue.length);
              const namePath = item.urlPath.slice(1);
              const title =
                index > -1 ? (
                  <span>
                    {beforeStr}
                    <span className="menu-search-value">{searchValue}</span>
                    {afterStr}
                  </span>
                ) : (
                  <span>{item[showField]}</span>
                );
              return (
                <li
                  key={item.id}
                  className={cls({ un_bottom: idx === menuMaps[mapKey].length - 1 })}
                  onClick={() => this.handleSelect(item)}
                >
                  {title}
                  <p title={namePath}>{namePath}</p>
                </li>
              );
            })}
          </ul>
        </Fragment>
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
            <div
              className={styles['menu-search-popver-content']}
              style={{ maxHeight: 400, overflow: 'auto' }}
            >
              <ScrollBar>{this.getFilterDataCmp()}</ScrollBar>
            </div>
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
