import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Icon, Menu } from 'antd';
import ExtDropdown from '@/components/ExtDropdown';

@connect(({ menu }) => ({ menu }))
export default class SelectModule extends React.Component {
  handleClick = currMenuTree => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateState',
      payload: {
        currMenuTree,
      },
    });
  };

  dropdownRender = () => {
    const { menu } = this.props;
    const { menuTrees, currMenuTree } = menu;

    return (
      <Menu selectedKeys={[currMenuTree ? currMenuTree.id : '']}>
        {menuTrees.map(menuTree => (
          <Menu.Item key={menuTree.id} onClick={() => this.handleClick(menuTree)}>
            {menuTree.title}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  render() {
    const { menu } = this.props;
    const { currMenuTree } = menu;

    return (
      <ExtDropdown overlay={this.dropdownRender()} trigger={['click']}>
        <span className={cls('trigger')}>
          <span className="title">{currMenuTree ? currMenuTree.title : ''}</span>
          <Icon type="caret-down" style={{ fontSize: '12px', marginLeft: '4px' }} />
        </span>
      </ExtDropdown>
    );
  }
}
