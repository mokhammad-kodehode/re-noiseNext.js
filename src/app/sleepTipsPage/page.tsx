"use client"

import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';

const SleepTipsPage: React.FC = () => {
  



  return (
    <div className={styles.container}>
        <div>
            <h1>Sleep Tips</h1>
            <ul className={styles.sleep_tips}>
                <li><span>Maintain a regular sleep schedule: </span> Try to go to bed and wake up at the same time every day, even on weekends, to establish a sleep rhythm.</li>
                <li><span>Create a comfortable environment: </span> Ensure a quiet, dark, and cool sleep environment. Use curtains, sleep masks, and white noise if they help you fall asleep.</li>
                <li><span>Avoid caffeine and nicotine: </span>Limit caffeine and nicotine intake, especially in the afternoon and evening, as they can interfere with sleep.</li>
                <li><span>Limit screen time before bed: </span>  The blue light emitted by screens can interfere with your body natural sleep-wake cycle. Try to avoid screens at least an hour before bedtime, or use blue light filters on your devices.</li>
                <li><span>Monitor your diet: </span>Avoid heavy meals, spicy foods, and excessive liquids close to bedtime, as they can cause discomfort and disrupt your sleep. Opt for light snacks if youre hungry before bed.</li>
                <li><span>Limit napping: </span>While short naps can be beneficial, especially for improving alertness and performance, avoid napping for too long or too late in the day, as it can interfere with your ability to fall asleep at night.</li>
                <li><span>Establish a bedtime routine: </span>Engage in relaxing activities before bed, such as reading a book, taking a warm bath, or practicing gentle yoga stretches, to signal to your body that its time to wind down.</li>
            </ul>
        </div>
        <Image
              src="/Sleep.jpg" // Путь к изображению луны
              alt="Nixes"
              width={700} 
              height={500} 
              className={styles.img_section2}
            />
    </div>
  );
};

export default SleepTipsPage;

