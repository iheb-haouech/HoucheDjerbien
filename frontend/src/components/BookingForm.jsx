import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { loadBookings, saveBookings } from '../data/storage';
import { motion } from 'framer-motion';
import { Calendar, Users, User, Mail, MessageSquare, Check } from 'lucide-react';

export default function BookingForm({ listing }) {
  const { user } = useAuth();
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    specialRequests: '',
    extras: {
      excursions: false,
      cleaning: false,
    },
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const calculateNights = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getMonthlyPrice = (date) => {
    if (!date || !listing?.priceByMonth) return null;
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const month = monthNames[new Date(date).getMonth()];
    return listing.priceByMonth[month];
  };

  const calculateTotal = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const nights = calculateNights();
    if (nights <= 0) return 0;

    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);
    let total = 0;

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dailyPrice = getMonthlyPrice(d.toISOString()) || listing?.price || 0;
      total += dailyPrice;
    }

    return total;
  };

  const validateForm = () => {
    if (!form.checkIn || !form.checkOut) {
      setError('Veuillez sélectionner les dates d\'arrivée et de départ.');
      return false;
    }
    if (calculateNights() <= 0) {
      setError('La date de départ doit être après la date d\'arrivée.');
      return false;
    }
    if (!user && (!form.name || !form.email)) {
      setError('Veuillez remplir votre nom et email.');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (!listing?.id) {
        throw new Error('Location non trouvée.');
      }

      const nights = calculateNights();
      const total = calculateTotal();

      const bookings = loadBookings();
      const newBooking = {
        id: Date.now().toString(),
        listingId: listing.id,
        listingTitle: listing.title || '',
        guest: form.name || user?.name || 'Guest',
        email: form.email || user?.email || '',
        date: form.checkIn,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        nights,
        adults: form.adults,
        children: form.children,
        specialRequests: form.specialRequests,
        extras: form.extras,
        status: 'pending',
        total,
        createdAt: new Date().toISOString(),
      };

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({
            listingId: listing.id,
            checkIn: form.checkIn,
            checkOut: form.checkOut,
            guestName: form.name || user?.name || 'Guest',
            extras: newBooking.extras,
          }),
        });

        if (!res.ok) throw new Error('Erreur API');

        const resJson = await res.json();
        newBooking.id = resJson.booking?.id || newBooking.id;
        saveBookings([newBooking, ...bookings]);
      } catch {
        saveBookings([newBooking, ...bookings]);
      }
      
      setBookingId(newBooking.id);
      setStep('success');
    } catch (err) {
      setError(err.message || 'Échec de la création de la réservation.');
    } finally {
      setLoading(false);
    }
  };

  const totalEstimate = calculateTotal();

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 text-center shadow-xl"
      >
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-green-700 mb-3">Réservation Confirmée!</h3>
        <p className="text-gray-700 mb-4">Votre réservation a été enregistrée avec succès.</p>
        <div className="bg-white/80 rounded-xl p-4 mb-6 inline-block">
          <p className="text-sm text-gray-600">Numéro de réservation:</p>
          <p className="text-2xl font-bold text-navy-900">#{bookingId}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/reservations"
            className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition text-center"
          >
            Voir mes réservations
          </Link>
          <Link
            to="/rentals"
            className="flex-1 bg-white border border-gray-200 text-navy-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-center"
          >
            Autres locations
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-sand-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
        <h3 className="text-2xl font-bold">Réserver cette location</h3>
        <p className="text-primary-100 mt-1">Remplissez le formulaire ci-dessous</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 m-6 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Erreur:</span> {error}
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="p-6 space-y-6" noValidate>
        {!user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
                <User className="w-4 h-4" />
                Nom complet *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border-2 border-sand-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
                placeholder="Votre nom"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
                <Mail className="w-4 h-4" />
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border-2 border-sand-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
              <Calendar className="w-4 h-4" />
              Date d'arrivée *
            </label>
            <input
              type="date"
              value={form.checkIn}
              onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
              className="w-full rounded-xl border-2 border-sand-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
              <Calendar className="w-4 h-4" />
              Date de départ *
            </label>
            <input
              type="date"
              value={form.checkOut}
              onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
              className="w-full rounded-xl border-2 border-sand-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
              required
              min={form.checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
              <Users className="w-4 h-4" />
              Adultes *
            </label>
            <input
              type="number"
              value={form.adults}
              onChange={(e) => setForm({ ...form, adults: parseInt(e.target.value) || 1 })}
              className="w-full rounded-xl border-2 border-sand-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
              min="1"
              max={listing?.capacity?.adults || 20}
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
              <Users className="w-4 h-4" />
              Enfants
            </label>
            <input
              type="number"
              value={form.children}
              onChange={(e) => setForm({ ...form, children: parseInt(e.target.value) || 0 })}
              className="w-full rounded-xl border-2 border-sand-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
              min="0"
              max={listing?.capacity?.children || 10}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
            <MessageSquare className="w-4 h-4" />
            Demandes spéciales
          </label>
          <textarea
            value={form.specialRequests}
            onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
            className="w-full rounded-xl border-2 border-sand-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition h-24 resize-none"
            placeholder="Informations supplémentaires..."
            maxLength="500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-navy-700 mb-3 block">Services additionnels</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-sand-200 rounded-xl hover:bg-sand-50 cursor-pointer">
              <input
                type="checkbox"
                checked={form.extras.excursions}
                onChange={(e) => setForm({ ...form, extras: { ...form.extras, excursions: e.target.checked } })}
                className="w-5 h-5 text-primary-600 rounded"
              />
              <span className="text-navy-700">Excursions (optionnel)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-sand-200 rounded-xl hover:bg-sand-50 cursor-pointer">
              <input
                type="checkbox"
                checked={form.extras.cleaning}
                onChange={(e) => setForm({ ...form, extras: { ...form.extras, cleaning: e.target.checked } })}
                className="w-5 h-5 text-primary-600 rounded"
              />
              <span className="text-navy-700">Service de nettoyage</span>
            </label>
          </div>
        </div>

        {totalEstimate > 0 && (
          <div className="bg-sand-50 rounded-2xl p-4 border border-sand-200">
            <div className="flex justify-between items-center">
              <span className="text-navy-700 font-medium">Total estimé:</span>
              <span className="text-2xl font-bold text-primary-600">{totalEstimate} DT</span>
            </div>
            <p className="text-sm text-navy-500 mt-1">
              pour {calculateNights()} nuit{calculateNights() > 1 ? 's' : ''}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl px-6 py-4 font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Traitement...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Confirmer la réservation
            </>
          )}
        </button>
      </form>
    </div>
  );
}