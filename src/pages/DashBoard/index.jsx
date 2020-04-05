import React from 'react';
import styles from './index.less';

const  DashBoard=() => {
  const url=`/sei-dashboard-web/#/sei-dashboard-web/scene/kanban/76yxlo?rand=${Date.now()}`;
    return (
      <section className={styles['dashboard-wrapper']}>
         <iframe src={url}/>
      </section>
    );
}
export default DashBoard;
