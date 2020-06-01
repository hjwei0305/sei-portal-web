import React from 'react';
import Iframe from '@/layouts/components/Tab/Iframe';
import styles from './index.less';

const DashBoard = () => (
  <section className={styles['dashboard-wrapper']}>
    <Iframe
      visible
      title="dashboard"
      // url="/sei-dashboard-web/#/sei-dashboard-web/scene/sei/home"
      url="http://www.baidu.com"
      id="portal-dashboard"
    />
  </section>
);

export default DashBoard;
