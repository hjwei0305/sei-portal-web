import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Row, Col } from 'antd';
import { ExtIcon, ScrollBar } from 'suid';
import ExtDropdown from '@/components/ExtDropdown';

import styles from './index.less';

const tempImgHolder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAESUlEQVRYR+2ZTWxUZRSGn/e2lUAQEoyJgRKtCxN0Z0v9jahxhRpTA11oFCih0BmqVKHVlXYjtcS0FZyGyVAaQ20sTDdi4kYlRINUSAFNdGNsUmpwY4wkttb2HnNvaenPzO3c+VlgepNZzTnveebc851vvvOJW+xRPnitsfF2xqjEoRJpI0YlYGDnQAPIvYJbclkd7/2ea7ycgK3+wCaKnK1ANXBnBjD9YP2sXt6r5mY3A/sFJqGBraFhDZRUY/JAn84mKDAE9GNOnzoOng+jkTGw7Xv7MWTVmNUAK8MEWcT2DGZJflse18nm8cV0A4GtqWk1Y1Qj7QB7ZDGxHL//y886bkLth75Np5US2N5ofBhTDcauHCGydLcrSF0wHldb2+hskRlgi7yzkpLRGqRa4IEsIxXATT2YxdXx/llP3Ae2fY0bQLUYtYgVBYiaq+RZUFztLT0LSsJeb9qF8LJckWuUHP0Ns6O4TlyHWwantdIuOr8rMLkb9EqOgUO660fEUVYti6t5YddQQ5+taavWH+lU/U4xTh3glUxZyOghzO1TcLzX/lValp/W3aFo0gxIYCQ+2qLAJm4NTc/j2h6kzSFI0psa15BimBMP2rZtcO2jTDg7ETXTwFOi4oxBIvaieoKAbO/+MkqK6zB2g60KDS++xFWnOlqSgXEurt+BuTWgx2dq+EaG5/oZI2Ykbiumvb1KfwaKNjRuw+SVzEOLgE/42XTUqQ8O/pz2tV8qXccE9YC3oy74fzI3w6lVehyHDw9XaSAQ/LW3yikyL+s759ldBsXU3hIP9B9Y+wxFTgSjKsguE+Bp//NyOHKkSicCA9fXL6NoeR2mjciNBW2z/h5wobQesQfj/kxKKwzwtJ7XUWKjxbR2vaDrmQSZb2OX7y7jX/cAmNfvi8JoZAN8U1/0uaK1s0oXMwlqg6WbmaARsSkT+1Q2uQHPLF0umWiNVak3VRAbWL8fx94E7soWNLhLZKsq/rZJDsW26l2/Pr8vPeb1zmzlCpfhWcrm0jwDfKH0a+DJJeB8ZmApw/OymZ8usVTD6Yt0KcNLi+7/sOh+Be7JVy8ubEnYkPYm7bTBs7cGMJ97wC8ZBJ7hwvyYwmaYl/25ROSU9Ul449OcnwICn1TF1eqZQUo0aceB7bkSFwRY1q3ykR0e25zJTyRp2+UNTCDr0Wp+ge0bXI6pcqT75lkhRUojSdsiYxviubAZzxNwL7JPVD5yen78wIF2JGlPCV5l6uNkAp8D8AiiB+OEKq7+kC5WRlcG0X67zx/FToEHXr5kAfydD7qmOKGyobHFkpIR8LRI7We2ouQfoghvAWxIeeDM9Igk9TFpx1V59YvFIGd/Hwp4tuON/u2NqGbmXv7BMxj4GtANSqhi+JcwoIGLLoxQNGlPIKKYf1eXGlicQ0roweGuMNqpbLPO8HyxulN2r+MQtUmuzzrmf4wpocph/34iH89/3YwZAhkUC18AAAAASUVORK5CYII=';

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
      <div className={cls('dropdown-wrapper')}>
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
