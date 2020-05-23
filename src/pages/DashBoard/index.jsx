import React from 'react';
import Iframe from '@/layouts/components/Tab/Iframe';
import styles from './index.less';

const DashBoard = () => (
  <section className={styles['dashboard-wrapper']}>
    <Iframe
      visible
      title="dashboard"
      url="http://10.4.208.86:8100/sei-dashboard-web/#/sei-dashboard-web/scene/sei/home"
      id="portal-dashboard"
    />
  </section>
);

export default DashBoard;
