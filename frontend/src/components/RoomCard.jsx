import React, { useState } from 'react';
import styles from '../styles/RoomCard.module.css';

export default function RoomCard({ room }) {
  const [imgIndex, setImgIndex] = useState(0);
  if (!room) return null;

  const { images = [], title, location, price, rating, description } = room;

  function prevImg() {
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  }
  function nextImg() {
    setImgIndex((i) => (i + 1) % images.length);
  }

  return (
    <article className={styles.card}>
      <div className={styles.carousel}>
        <img src={images[imgIndex]} alt={title} />
        {images.length > 1 && (
          <>
            <button className={styles.imgNav} onClick={prevImg} aria-label="Previous image">‹</button>
            <button className={styles.imgNav} onClick={nextImg} aria-label="Next image">›</button>
          </>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.headline}>
          <div>
            <h3>{title}</h3>
            <p className={styles.location}>{location}</p>
          </div>
          <div className={styles.price}>${price}/night</div>
        </div>

        <div className={styles.meta}>
          <div>⭐ {rating}</div>
          <p className={styles.desc}>{description}</p>
        </div>
      </div>
    </article>
  );
}
