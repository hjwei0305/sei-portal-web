import React from 'react';
import styles from './index.less';

const  DashBoard=() => {
    return (
      <section className={styles['dashboard-wrapper']}>
         <iframe src="/sei-dashboard-web/#/sei-dashboard-web/scene/sei/home"/>
      </section>
    );
}
export default DashBoard;
