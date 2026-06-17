import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LOCAL_ASSETS from '../assets/images';

export default function ImageGallery({ images }) {
  // Default property images if none provided (prefer local public assets)
  const defaultImages = LOCAL_ASSETS?.gallery || [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571508601633-d7d51ee1d0e5?w=1200&h=800&fit=crop&q=80'
  ];

  const galleryImages = (images && images.length > 0) ? images : defaultImages;
  const [mainIndex, setMainIndex] = useState(0);

  const handlePrev = () => {
    setMainIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNext = () => {
    setMainIndex((prev) => (prev + 1) % galleryImages.length);
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-sand-100 shadow-lg border border-sand-200">
        <img
          src={galleryImages[mainIndex]}
          alt="Main gallery"
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 hover:bg-white p-2 shadow-lg transition"
        >
          <ChevronLeft className="w-6 h-6 text-navy-900" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 hover:bg-white p-2 shadow-lg transition"
        >
          <ChevronRight className="w-6 h-6 text-navy-900" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-navy-900/75 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur">
          {mainIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainIndex(index)}
              className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition ${
                mainIndex === index ? 'border-primary-600 shadow-lg' : 'border-sand-300 hover:border-sand-400'
              }`}
            >
              <img src={image} alt={`thumbnail-${index}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
