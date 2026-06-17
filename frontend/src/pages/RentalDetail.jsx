import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ImageGallery from '../components/ImageGallery';
import BookingForm from '../components/BookingForm';
import { loadListings } from '../data/storage';

export default function RentalDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const listings = loadListings();
    const found = listings.find((item) => String(item.id) === String(id));

    setListing(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-navy">Loading listing...</div>;
  }

  if (!listing) {
    return (
      <div className="p-8 text-center text-navy">
        Listing not found.{' '}
        <Link className="text-primary-700 font-semibold" to="/rentals">
          Back to rentals
        </Link>
      </div>
    );
  }

  const images = Array.isArray(listing.images) ? listing.images : [];
  const amenities = Array.isArray(listing.amenities) ? listing.amenities : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-sand-50">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-extrabold text-navy-900">
            {listing.title || 'Untitled rental'}
          </h1>

          <p className="text-navy-600 mt-2">
            {listing.location || 'Location not specified'}
          </p>

          {listing.rating && (
            <small className="text-sm text-gray-500">⭐ {listing.rating}</small>
          )}

          <ImageGallery images={images} />

          <div className="bg-white rounded-[28px] border border-sand-200 shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-navy-900 mb-3">Description</h2>
            <p className="text-navy-700 leading-relaxed">
              {listing.description || 'No description available.'}
            </p>
          </div>

          <div className="bg-white rounded-[28px] border border-sand-200 shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-navy-900 mb-3">Amenities</h2>
            {amenities.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {amenities.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No amenities listed.</p>
            )}
          </div>

          <div className="bg-white rounded-[28px] border border-sand-200 shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-navy-900 mb-3">Host</h2>
            <div className="flex items-center gap-3">
              {listing.host?.avatar ? (
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={listing.host.avatar}
                  alt={listing.host?.name || 'Host'}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center text-sm text-gray-500">
                  N/A
                </div>
              )}

              <div>{listing.host?.name || 'Host information unavailable'}</div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] border border-sand-200 shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-navy-900 mb-3">Map</h2>
            <div className="h-64 bg-sand rounded-3xl flex items-center justify-center text-navy-500">
              Map placeholder
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-white rounded-[32px] border border-sand-200 shadow-xl p-6">
            <BookingForm listing={listing} />
          </div>
        </aside>
      </div>
    </div>
  );
}