import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchListings } from '../lib/listings';
import { loadListings } from '../data/storage';
import LOCAL_ASSETS from '../assets/images';

export default function Rentals() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAllListings = async () => {
      const localListings = loadListings();
      setListings(Array.isArray(localListings) ? localListings : []);

      try {
        const data = await fetchListings();
        const remoteListings = Array.isArray(data) ? data : [];

        if (remoteListings.length > 0) {
          setListings(remoteListings);
        }
      } catch (err) {
        if (!localListings?.length) {
          setError(err.message || 'Échec du chargement des locations');
        }
      } finally {
        setLoading(false);
      }
    };

    loadAllListings();
  }, []);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const locationQ = params.get('location');
  const checkInQ = params.get('checkIn');
  const checkOutQ = params.get('checkOut');
  const adultsQ = params.get('adults');
  const childrenQ = params.get('children');

  const filtered = listings.filter((l) => {
    if (locationQ) {
      if (!l.location || !l.location.toLowerCase().includes(locationQ.toLowerCase())) return false;
    }

    if (checkInQ && checkOutQ) {
      const inDate = new Date(checkInQ);
      const outDate = new Date(checkOutQ);

      if (!Number.isNaN(inDate.getTime()) && !Number.isNaN(outDate.getTime())) {
        const overlapping = (l.bookings || []).some((b) => {
          const bIn = new Date(b.checkIn);
          const bOut = new Date(b.checkOut);
          return bIn < outDate && bOut > inDate;
        });

        if (overlapping) return false;
      }
    }

    if (adultsQ && parseInt(adultsQ) > 0) {
      const minAdults = parseInt(adultsQ);
      if ((l.capacity?.adults || 6) < minAdults) return false;
    }

    if (childrenQ && parseInt(childrenQ) > 0) {
      const minChildren = parseInt(childrenQ);
      if ((l.capacity?.children || 4) < minChildren) return false;
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero Section with Background Image */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-navy-900 via-primary-700 to-primary-600">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${LOCAL_ASSETS.hero1})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
        
        <div className="relative h-full flex flex-col justify-end px-4 py-12 md:px-8 md:py-16 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Houces Djerbiens à Louer
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mb-6">
            Découvrez nos maisons traditionnelles authentiques à Djerba
          </p>
          
          {(checkInQ || checkOutQ || adultsQ || childrenQ) && (
            <div className="flex flex-wrap gap-3">
              {checkInQ && (
                <span className="px-3 py-1 bg-white/80 rounded-full text-navy-800 text-sm">
                  Arrivée: {new Date(checkInQ).toLocaleDateString()}
                </span>
              )}
              {checkOutQ && (
                <span className="px-3 py-1 bg-white/80 rounded-full text-navy-800 text-sm">
                  Départ: {new Date(checkOutQ).toLocaleDateString()}
                </span>
              )}
              {adultsQ && (
                <span className="px-3 py-1 bg-white/80 rounded-full text-navy-800 text-sm">
                  Adultes: {adultsQ}
                </span>
              )}
              {childrenQ && (
                <span className="px-3 py-1 bg-white/80 rounded-full text-navy-800 text-sm">
                  Enfants: {childrenQ}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-sand-200 shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-navy-900 mb-2">Nos Propriétés</h2>
          <p className="text-navy-600">
            {sorted.length > 0
              ? `${sorted.length} location${sorted.length !== 1 ? 's' : ''} disponible${sorted.length !== 1 ? 's' : ''}`
              : 'Aucune location ne correspond à vos critères'}
          </p>
        </div>

        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">Aucune location disponible pour le moment.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Retour à l'accueil
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-sand-200 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <Link to={`/rentals/${listing.id}`}>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={listing.images?.[0] || LOCAL_ASSETS.hero1}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm font-semibold">{listing.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-navy-900 text-lg mb-1">{listing.title}</h3>
                    <p className="text-sm text-navy-600 mb-2">{listing.location}</p>
                    <p className="text-primary-600 font-bold text-lg mb-3">{listing.price} DT / nuit</p>
                    <p className="text-xs text-navy-700 mb-3 line-clamp-2">{listing.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {listing.amenities?.slice(0, 4).map((amenity) => (
                        <span key={amenity} className="text-xs px-2 py-1 bg-sand-100 text-navy-700 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
