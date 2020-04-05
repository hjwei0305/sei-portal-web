import React from 'react';
import styles from './index.less';

const  DashBoard=() => {
    return (
      <section className={styles['dashboard-wrapper']}>
         <iframe 
           style={{ display: 'block',flex: 1,border: 'none',boxShadow: 'none',width:'100%',height:'100%'}} 
           src='/sei-dashboard-web/#/sei-dashboard-web/scene/kanban/p3g3wn' 
         />
      </section>
    );
}
export default DashBoard;
