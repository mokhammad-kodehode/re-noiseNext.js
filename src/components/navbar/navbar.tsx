"use client"

import React from 'react';
import styles from './nav.module.css'; 
import Link from 'next/link';
import { useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.navbar}>
      <button className={styles.burger} onClick={toggleMenu}>
        <div className={`${styles.line} ${isOpen ? styles.open : ""}`}></div>
        <div className={`${styles.line} ${isOpen ? styles.open : ""}`}></div>
        <div className={`${styles.line} ${isOpen ? styles.open : ""}`}></div>
      </button>

      <div className={`${styles.menu} ${isOpen ? styles.show : ""}`}>
        <ul className={styles.menuList}>
        <li className={styles.menuItem}>
                     <Link href="/soundPage" >Sounds</Link>
              </li>
              <li className={styles.menuItem}>
                     <Link href="/videoPage" >Backgrounds</Link>
              </li>
              <li className={styles.menuItem}>
                     <Link href="/sleepTipsPage" >Sleeping and Contractions</Link>
              </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
