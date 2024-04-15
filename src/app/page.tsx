
import Image from 'next/image';
import styles from './page.module.css'
import Link from 'next/link';
import RelaxSoundsMap from './soundPage/page';
import 'fontsource-poppins';

export default function Home() {

  return (
    <div>
        <RelaxSoundsMap />
    </div>
  )
}
