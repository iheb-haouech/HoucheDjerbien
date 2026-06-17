import React, { useState, useEffect } from 'react';

export default function ListingCarousel({ images = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="rounded-2xl overflow-hidden shadow-soft border border-slate-200">
      <div className="h-32 w-full">
        <img src={images[index]} alt={`carousel-${index}`} className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center justify-between p-3 bg-white">
        <button onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)} className="px-3 py-2 rounded-lg border">Prev</button>
        <div className="text-sm text-slate-600">{index + 1} / {images.length}</div>
        <button onClick={() => setIndex((i) => (i + 1) % images.length)} className="px-3 py-2 rounded-lg border">Next</button>
      </div>
    </div>
  );
}
