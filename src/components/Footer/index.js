import React from 'react';
import logo from '@/assets/logo_hx.png';

const Footer = () => (
  <div
    className="vertical"
    style={{
      position: 'relative',
      marginTop: 16,
      textAlign: 'center',
      width: '100%',
      height: 64,
    }}
  >
    <div className="horizontal">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div className="vertical">
        <div style={{ margin: '0 auto', textAlign: 'left', width: '100%' }}>
          四川虹信软件股份有限公司 <a href="http://www.rcsit.cn">www.rcsit.cn</a> | Copyright © 2020
        </div>
        <div style={{ margin: '0 auto' }}>
          地址：四川省成都市高新区天府四街199号长虹科技大厦A-27 电话：4000-870-780
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
