import React from 'react';
import styles from './index.less';

const DashBoard = () => (
  <section className={styles['dashboard-wrapper']}>
    <iframe title="dashboard" src="/sei-dashboard-web/#/sei-dashboard-web/scene/sei/home" />
  </section>
);

export default DashBoard;
