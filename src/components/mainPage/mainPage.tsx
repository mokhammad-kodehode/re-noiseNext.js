
"use client"
import styles from './styles.module.css'
import 'fontsource-poppins';
import Link from 'next/link';
import Image from 'next/image';

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
          <section className={styles.conatiner_two}>
          <Image
              src="/SectionTwo.png" // Путь к изображению луны
              alt="Nixes"
              width={600} 
              height={400} 
              className={styles.img_section2}
            />
          </section>
          <section className={styles.conatiner_two}>
            <div className={styles.title} >
              <div>
              <h1 className={styles.title_name} >Create unique mixes</h1>
              <h2 className={styles.descp} >Create unique sounds and share them with other people. Create your sheet and listen to your favorite sounds.</h2>
              </div>
            </div>
            <div className={styles.img_section}>
              <div className={styles.img_moon} ></div>
              <div className={styles.img_rain}></div>
              <div className={styles.img_ocean}></div>
            </div>
          </section>
          <section className={styles.conatiner_two}>
          <Image
              src="/SectionTwo.png" // Путь к изображению луны
              alt="Nixes"
              width={600} 
              height={400} 
              className={styles.img_section2}
            />
          </section>
        </main>
    </div>
  )
}
