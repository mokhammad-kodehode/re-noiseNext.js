
"use client"
import styles from './styles.module.css'
import 'fontsource-poppins';
import Link from 'next/link';

export default function MainPage() {

  return (
    <div>
        <main className={styles.main}>
          <section className={styles.conatiner_main}>
            <div className={styles.title} >
              <div>
              <h1 className={styles.title_name} >Harmony Haven</h1>
              <h2 className={styles.descp} >Curated melodies for serenity and focus.</h2>
              </div>
              <Link href="/soundPage">
                     <button className={styles.btn} >Start Now</button>
              </Link>
            </div>
            <div className={styles.img_section}>
              <div className={styles.img_moon} ></div>
              <div className={styles.img_rain}></div>
              <div className={styles.img_ocean}></div>
            </div>
          </section>
        </main>
    </div>
  )
}
