import React from 'react';
import styles from './nav.module.css'; 

const Navbar: React.FC = () => {
  return (
    <header>
      <nav className={styles.navbar}>
        <a className={styles.logo} href="#">ReNoise</a>
        <ul className={styles.items}>
            <li className={styles.item}>About Us</li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar