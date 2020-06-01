import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import * as focus from 'focus-outside';
import { Row, Col } from 'antd';
import { ExtIcon, ScrollBar } from 'suid';
import ExtDropdown from '@/components/ExtDropdown';

import styles from './index.less';

const tempImgHolder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAEY0lEQVRYR+2ZT2hcVRTGz3dfEhy1KBUFhUCZeW9mdLYxKJYideUfBBftQrHWFqOxdFV0rS6zEkSrcYgW0to/1C5UcKMWpZi6sCQ4ZObdN3mSKFSCQqMik8zcIyfOhHEy7828eTOLQi5klXO+83v3fffed8+AbrKBfvCurq7uWltbGzfGjAN4kJnHicgQ0RyAq8aYhaGhoYVkMvlb3HqxgJeWlvbVarWDRHSAiO7pAMNE9CkRXbJt+xMA8kCRR2TglZWV3ZVK5QAzC+j+yBX/S/AFnJnPp9Ppq1E0ugb2PO8RmUlmPkJEu6IU6RB72RhzsVqtTudyufVOuqHA5XL5DmOMvG6BfLiTWMz/32DmS8aYfDabvRKk1RZYa/1QHfKlmBA9pTPzgmVZMyMjI9Ojo6P/NItsARcKhduHh4ePAJggolxPlQaTdNqyrOlkMvmtyG8Cu657fx1UYG8dTN1YqgI77TjO6W2W8DxPbDDBzGOxSsRPZgAfMLOAXmvIBS66Uqm0VyklM/58/NqRFH4SSAACWmnNRKFQ2J3L5f4IkvR9/85qtTrJzBMA9kQqHS34nEDatv11UNri4uJd0FrLCfShZVn5ZDL5Q1gNrfXTRPQKET0ejaV9NIDrzHxyfX1d9uDrQZpaa9lSj8pfA7gRe5mI8mLuMCDXdZNKKZn1l3s5RAB8ZYw5mU6nL4bV8TzvsDHmKIC9Wx6uz3Br3i8CrpR6O5VK3egAfxjAJBHJB0/YqAJ4zxjzfjqdXgwKXF5evq9SqRyvz+jd2zwcANwcN2uMeSeTyYTapVgsjlmWJeByKjaPeQG1bXs67GnK5fJjtVrtGIBnwuJaLREWO0dE7zqOMxsW5Pv+LbJIiWisDhp4zIqO67rHAci6eKCbdREFuKH3u4BUKpWpXC73VzdFWmN839+zsbHxOgDZ84eiaPQC3Kx/joimHMf5sZuipVLpCaXUa0T0aDfx7WLiAjc0rwGYsm37bLsipVLphGVZJ5j53l5BO+0Sver+rZSaSqVSb4mA1jpfX+296m3L69cMbwkbY97MZDJv1IG/ifP6B2mJHeAgD+1YYsfDLd7YscSOJW56S3ie5zNz3+5qg7QEgJ/hed7nzPxkvw77QQIz8xdwXfdZAKF3uCgPM2Dg5zb7Elrr8/UebxS2trEDBL7gOM7BTWBmlv34IwAvxCUeBDAzn3Ic50UA/L/Oj1yr61d36V72NPoMfAVA3rbtj7c+4NtRaa2lJ3yIiJ6KSt0PYGY+C+CM4ziftdYPbWgXi8X9SqlDAAS+q259DOBfmfmMMWY2m80uBH5edjODxWIxY1mW3HAFfFtzo1mjB+A5AU0kEvnW5nXbG0c3wI2Y+fn52xKJxDEikgWQbZcbAfgCgBnbtr+MwtDVa24nKPs3EU02970krgOwNPxkAUn/rhwFNHTRRRFyXXcfAJl1+RksCPj7OuRMFO3YlggrprVOEdGrxpg/G7dmz/NOKaWkjftdXNBG/r/4hnQwy6nGTgAAAABJRU5ErkJggg==';

@connect(({ menu }) => ({ menu }))
export default class SelectModule extends PureComponent {
  static appElm = null;

  static dropdownElm;

  componentDidMount() {
    if (this.appElm) focus.bind(this.appElm, this.dropdownElm.handleOutside);
  }

  componentWillUnmount() {
    if (this.appElm) focus.unbind(this.appElm, this.dropdownElm.handleOutside);
  }

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
      <div
        ref={ref => {
          this.appElm = ref;
        }}
        className={cls('dropdown-wrapper')}
      >
        <ScrollBar>
          <Row className={cls('app-item-wrapper')} gutter={8}>
            {menuTrees.map(menuTree => {
              const { appBase64ImgStr, id } = menuTree;
              return (
                <Col
                  span={8}
                  key={id}
                  className={cls('app-item')}
                  onClick={() => this.handleClick(menuTree)}
                >
                  <img
                    className={cls({
                      'app-logo': true,
                      'app-logo-actived': currMenuTree.id === id,
                    })}
                    alt="应用图标"
                    src={appBase64ImgStr || tempImgHolder}
                  />
                  <p title={menuTree.title} className={cls('desc')}>
                    {menuTree.title}
                  </p>
                </Col>
              );
            })}
          </Row>
        </ScrollBar>
      </div>
    );
  };

  render() {
    const { menu } = this.props;
    const { currMenuTree } = menu;
    return (
      <ExtDropdown
        ref={node => (this.dropdownElm = node)}
        overlay={this.dropdownRender()}
        trigger={['click']}
        overlayClassName={cls(styles['select-module-wrapper'])}
      >
        <span className={cls('trigger')}>
          <span className="title">{currMenuTree ? currMenuTree.title : ''}</span>
          <ExtIcon type="app" style={{ fontSize: '16px', marginLeft: '6px' }} />
        </span>
      </ExtDropdown>
    );
  }
}
