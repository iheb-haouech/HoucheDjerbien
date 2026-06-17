import React, { useState } from 'react';
import RoomCard from './RoomCard';
import styles from '../styles/RoomSlider.module.css';

export default function RoomSlider({ rooms = [] }) {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i - 1 + rooms.length) % rooms.length);
  }
  function next() {
    setIndex((i) => (i + 1) % rooms.length);
  }

  return (
    <div className={styles.sliderRoot}>
      <button className={styles.navBtn} onClick={prev} aria-label="Previous">‹</button>

      <div className={styles.slideArea}>
        <RoomCard room={rooms[index]} />
        <div className={styles.dots}>
          {rooms.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={i === index ? styles.dotActive : styles.dot} />
          ))}
        </div>
      </div>

      <button className={styles.navBtn} onClick={next} aria-label="Next">›</button>
    </div>
  );
}
