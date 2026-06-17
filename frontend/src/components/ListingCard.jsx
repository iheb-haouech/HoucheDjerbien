import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, Badge } from './ui';
import { MapPin, Star, Heart, Users, Wifi, Car, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import ImageEditor from './ImageEditor';
import LOCAL_ASSETS from '../assets/images';

export default function ListingCard({ listing, index, onImageChange }) {
  const { t } = useTranslation();
  const { formatCurrency } = useSettings();
  const { user } = useAuth();
  // Default property images for fallback
  const defaultImages = LOCAL_ASSETS?.gallery || [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571508601633-d7d51ee1d0e5?w=800&h=600&fit=crop&q=80'
  ];
  const availableImages = listing.images && listing.images.length > 0 ? listing.images : defaultImages;
  const [currentImage, setCurrentImage] = useState(availableImages[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const isAdminMode = user?.role === 'admin';

  useEffect(() => {
    setCurrentImage(availableImages[0]);
  }, [availableImages]);

  useEffect(() => {
    if (!isHovering || availableImages.length <= 1) return;
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % availableImages.length);
      setCurrentImage(availableImages[(imageIndex + 1) % availableImages.length]);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovering, imageIndex, availableImages]);

  const handleImageChange = (newUrl) => {
    setCurrentImage(newUrl);
    if (onImageChange) {
      onImageChange(listing.id, newUrl);
    }
  };

  const handleImageNav = (direction, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newIndex = direction === 'next' 
      ? (imageIndex + 1) % availableImages.length
      : (imageIndex - 1 + availableImages.length) % availableImages.length;
    setImageIndex(newIndex);
    setCurrentImage(availableImages[newIndex]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link to={`/rentals/${listing.id}`} className="block h-full">
        <Card className="h-full group overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          {/* Image with Editor */}
          <div 
            className="relative aspect-[4/3] overflow-hidden bg-gray-200"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <ImageEditor 
              imageUrl={currentImage}
              onImageChange={handleImageChange}
              isAdminMode={isAdminMode}
              size="large"
            />

            {/* Image Navigation Arrows */}
            {availableImages.length > 1 && (
              <>
                <button
                  onClick={(e) => handleImageNav('prev', e)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 hover:bg-white p-1.5 shadow-lg transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5 text-navy-900" />
                </button>
                <button
                  onClick={(e) => handleImageNav('next', e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 hover:bg-white p-1.5 shadow-lg transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5 text-navy-900" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-navy-900/70 text-white px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur">
                  {imageIndex + 1}/{availableImages.length}
                </div>
              </>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                // Handle favorite toggle
              }}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart className="w-4 h-4 text-navy-900" />
            </button>

            {/* Status Badge */}
            {listing.status === 'available' && (
              <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                {t('listings.available')}
              </Badge>
            )}
          </div>

          <CardContent className="p-6 space-y-4">
            {/* Location */}
            <div className="flex items-center text-sm text-navy-600">
              <MapPin className="w-4 h-4 mr-1" />
              {listing.location}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-navy-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    const coords = listing.coordinates;
                    if (coords && coords.lat && coords.lng) {
                      const url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
                      window.open(url, '_blank');
                    } else if (listing.location) {
                      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location)}`;
                      window.open(url, '_blank');
                    }
                  } catch (err) {
                    console.error('Open maps error', err);
                  }
                }}
                className="underline"
              >
                {listing.title}
              </a>
            </h3>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium text-navy-900">{listing.rating}</span>
              <span className="text-navy-600">({listing.reviews} {t('listings.reviews')})</span>
            </div>

            {/* Amenities Preview */}
            <div className="flex items-center space-x-3 text-sm text-navy-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {listing.guests} {t('listings.guests')}
              </div>
              {listing.amenities.includes('wifi') && (
                <div className="flex items-center">
                  <Wifi className="w-4 h-4 mr-1" />
                  WiFi
                </div>
              )}
              {listing.amenities.includes('parking') && (
                <div className="flex items-center">
                  <Car className="w-4 h-4 mr-1" />
                  {t('listings.parking')}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-2xl font-bold text-navy-900">{formatCurrency(listing.price)}</span>
                <span className="text-navy-600"> / {t('listings.night')}</span>
              </div>

              <div className="text-sm text-navy-600">
                <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-semibold shadow-sm">{t('listings.book')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
