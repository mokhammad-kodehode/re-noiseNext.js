import React from 'react';
import styles from './nav.module.css'; 
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <header>
      <nav className={styles.navbar}>
        <a className={styles.logo}
         href="#">
          <Link href="/" >ReNoise</Link>
          </a>
        <ul className={styles.items}>
            <li className={styles.item}>About Us</li>
            <li className={styles.nav_item}>
                     <Link href="/soundPage" className={styles.nav_item}>Sounds</Link>
              </li>

        </ul>
      </nav>
    </header>
  );
};

export default Navbar