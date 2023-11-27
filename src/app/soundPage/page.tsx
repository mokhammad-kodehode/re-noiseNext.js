import Navbar from '@/components/navbar/navbar'
import RelaxSoundsMap from '@/components/SoundMap/SoundMap'
import styles from './styles.module.css'

export default function SoundPage() {
  return (
    <main className={styles.main}>
          <Navbar/>
          <RelaxSoundsMap/>
    </main>
  )
}
