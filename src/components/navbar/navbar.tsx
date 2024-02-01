import React from 'react';
import styles from './nav.module.css'; 
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <header>
      <nav className={styles.navbar}>
          <Link className={styles.logo} href="/" >ReNoise</Link>
        <ul className={styles.items}>
            <li className={styles.nav_item}>
                     <Link href="/soundPage" className={styles.nav_item}>Sounds</Link>
              </li>
              <li className={styles.nav_item}>
                     <Link href="/videoPage" className={styles.nav_item}>Relax Video</Link>
              </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar