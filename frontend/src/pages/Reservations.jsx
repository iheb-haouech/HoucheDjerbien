import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { fetchMyBookings } from '../lib/bookings';

export default function Reservations() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchMyBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };

    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    loadBookings();
  }, [user, authLoading]);

  const formatDate = (value) => {
    if (!value) return 'N/A';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';

    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (authLoading || loading) {
    return <div className="p-8 text-center text-navy">Loading reservations...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 bg-sand-50 rounded-[32px] shadow-xl text-center">
        <h1 className="text-4xl font-bold text-navy-900 mb-4">My Reservations</h1>
        <p className="text-navy-600 mb-6">You need to log in to view your reservations.</p>
        <Link
          to="/login"
          className="inline-flex rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 bg-sand-50 rounded-[32px] shadow-xl text-center">
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-sand-50 rounded-[32px] shadow-xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900">My Reservations</h1>
        <p className="text-navy-600 mt-2">All your bookings in one place.</p>
      </header>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">No reservations yet</p>
          <Link
            to="/rentals"
            className="bg-bordeaux text-white px-6 py-3 rounded-lg font-semibold"
          >
            Find Your Perfect Stay
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking, index) => {
            const bookingId = booking.id || booking._id || index;
            const title =
              booking.listing?.title ||
              booking.listingTitle ||
              'Rental booking';

            const location =
              booking.listing?.location ||
              booking.location ||
              'Location unavailable';

            const amount =
              booking.payment?.amount ??
              booking.totalPrice ??
              booking.amount ??
              'N/A';

            const adults = booking.guests?.adults ?? 0;
            const children = booking.guests?.children ?? 0;
            const calculatedGuests = Number(adults) + Number(children);

            const totalGuests =
            booking.guestCount !== null && booking.guestCount !== undefined
              ? booking.guestCount
              : calculatedGuests > 0
                ? calculatedGuests
                : 'N/A';

            return (
              <div
                key={bookingId}
                className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{title}</h3>

                <p className="text-gray-600 mb-2">
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </p>

                <p className="text-green-600 font-semibold mb-2">
                  {booking.status || 'Confirmed'}
                </p>

                <p className="text-lg font-bold text-navy">
                  {typeof amount === 'number' ? `${amount} TND` : amount}
                </p>

                <div className="mt-4 text-sm text-gray-500">
                  Guests: {totalGuests} | {location}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}