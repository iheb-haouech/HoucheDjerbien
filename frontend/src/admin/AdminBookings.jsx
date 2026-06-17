import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus, Database, Trash2 } from 'lucide-react';
import { loadBookings, loadListings, saveBookings } from '../data/storage';
import { useSettings } from '../contexts/SettingsContext';
import { fetchListings } from '../lib/listings';
import { listings as defaultListings } from '../data/mockData';
import {
  createManualBooking,
  deleteAdminBooking,
  fetchAdminBookings,
  updateAdminBookingStatus,
} from '../lib/admin';

const sourceOptions = ['airbnb', 'booking', 'other'];

const normalizeBooking = (booking) => ({
  id: booking.id,
  listingId: booking.listingId,
  listingTitle: booking.listing?.title || booking.listingTitle || booking.listingId,
  guest: booking.guestName || booking.guest || 'Guest',
  checkIn: booking.checkIn ? String(booking.checkIn).slice(0, 10) : '',
  checkOut: booking.checkOut ? String(booking.checkOut).slice(0, 10) : '',
  nights: booking.nights || 0,
  total: booking.finalPrice ?? booking.totalPrice ?? booking.total ?? 0,
  source: booking.extras?.source || booking.source || 'direct',
  status: String(booking.status || 'pending').toLowerCase(),
});

const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 0;
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

export default function AdminBookings() {
  const { formatCurrency } = useSettings();
  const [bookingsData, setBookingsData] = useState(() => loadBookings().map(normalizeBooking));
  const [listings, setListings] = useState(() => {
    const stored = loadListings();
    return stored.length ? stored : defaultListings;
  });
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    listingId: '',
    guestName: '',
    checkIn: '',
    checkOut: '',
    source: 'airbnb',
    total: '',
  });

  useEffect(() => {
    const loadRemoteData = async () => {
      try {
        const [remoteBookings, remoteListings] = await Promise.all([
          fetchAdminBookings(),
          fetchListings(),
        ]);

        const normalizedBookings = Array.isArray(remoteBookings) ? remoteBookings.map(normalizeBooking) : [];
        setBookingsData(normalizedBookings);
        saveBookings(normalizedBookings);
        if (Array.isArray(remoteListings) && remoteListings.length > 0) setListings(remoteListings);
        setNotice('Connected to database');
      } catch {
        setNotice('Using local admin data because the backend is not reachable or you are not logged in as admin.');
      }
    };

    loadRemoteData();
  }, []);

  const stats = useMemo(() => {
    const confirmed = bookingsData.filter((item) => ['confirmed', 'completed'].includes(item.status)).length;
    const pending = bookingsData.filter((item) => item.status === 'pending').length;
    const revenue = bookingsData.reduce((sum, item) => sum + Number(item.total || 0), 0);
    return { confirmed, pending, revenue };
  }, [bookingsData]);

  const updateLocalBookings = (next) => {
    setBookingsData(next);
    saveBookings(next);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBooking = async (event) => {
    event.preventDefault();
    setSaving(true);
    const selectedListing = listings.find((item) => item.id === form.listingId);
    const nights = calculateNights(form.checkIn, form.checkOut);
    const total = Number(form.total || (selectedListing?.price || 0) * nights);

    const payload = {
      listingId: form.listingId,
      guestName: form.guestName,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      source: form.source,
      extras: { source: form.source },
    };

    try {
      const result = await createManualBooking(payload);
      const newBooking = normalizeBooking(result.booking);
      updateLocalBookings([newBooking, ...bookingsData]);
      setNotice('Manual booking saved to database');
    } catch {
      const fallback = {
        id: Date.now().toString(),
        listingId: form.listingId,
        listingTitle: selectedListing?.title || form.listingId,
        guest: form.guestName,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        nights,
        total,
        source: form.source,
        status: 'confirmed',
      };
      updateLocalBookings([fallback, ...bookingsData]);
      setNotice('Backend unavailable: manual booking saved locally.');
    } finally {
      setForm({ listingId: '', guestName: '', checkIn: '', checkOut: '', source: 'airbnb', total: '' });
      setSaving(false);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    const next = bookingsData.map((booking) => (
      booking.id === bookingId ? { ...booking, status } : booking
    ));
    updateLocalBookings(next);

    try {
      await updateAdminBookingStatus(bookingId, status);
      setNotice('Booking status updated in database');
    } catch {
      setNotice('Status updated locally. Database update was not available.');
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Delete this booking?')) return;
    updateLocalBookings(bookingsData.filter((booking) => booking.id !== bookingId));

    try {
      await deleteAdminBooking(bookingId);
      setNotice('Booking deleted from database');
    } catch {
      setNotice('Booking deleted locally. Database delete was not available.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-gradient-to-r from-navy-950 via-navy-900 to-primary-700 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">Bookings</p>
            <h2 className="font-display text-4xl font-bold">Reservation Center</h2>
            <p className="mt-2 max-w-2xl text-white/75">Track direct reservations and manual channel bookings in one place.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-2xl font-bold">{bookingsData.length}</div>
              <div className="text-xs text-white/70">Total</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-xs text-white/70">Pending</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
              <div className="text-xs text-white/70">Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800">
          <Database className="h-4 w-4" />
          {notice}
        </div>
      )}

      <section className="rounded-[28px] border border-sand-200 bg-white p-6 shadow-xl shadow-navy-900/5">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-600 text-white">
            <CalendarPlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold text-navy-900">Add New Booking</h3>
            <p className="text-sm text-navy-500">Create a manual reservation from Airbnb, Booking, or another source.</p>
          </div>
        </div>

        <form onSubmit={handleAddBooking} className="grid gap-4 lg:grid-cols-6">
          <select name="listingId" value={form.listingId} onChange={handleChange} className="admin-input lg:col-span-2" required>
            <option value="">Select listing</option>
            {listings.map((listing) => (
              <option key={listing.id} value={listing.id}>{listing.title}</option>
            ))}
          </select>
          <input name="guestName" value={form.guestName} onChange={handleChange} className="admin-input lg:col-span-2" placeholder="Guest name" required />
          <input name="checkIn" value={form.checkIn} onChange={handleChange} className="admin-input" type="date" required />
          <input name="checkOut" value={form.checkOut} onChange={handleChange} className="admin-input" type="date" required />
          <input name="total" value={form.total} onChange={handleChange} className="admin-input lg:col-span-2" type="number" min="0" placeholder="Total override (optional)" />
          <div className="flex flex-wrap items-center gap-3 lg:col-span-3">
            {sourceOptions.map((option) => (
              <label key={option} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-sand-200 bg-sand-50 px-4 py-2 text-sm font-semibold text-navy-700">
                <input type="radio" name="source" value={option} checked={form.source === option} onChange={handleChange} />
                {option === 'airbnb' ? 'Airbnb' : option === 'booking' ? 'Booking' : 'Others'}
              </label>
            ))}
          </div>
          <button disabled={saving} className="rounded-2xl bg-primary-600 px-5 py-3 font-bold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-700 disabled:opacity-60 lg:col-span-1">
            {saving ? 'Saving...' : 'Add Booking'}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-sand-200 bg-white shadow-xl shadow-navy-900/5">
        <div className="grid grid-cols-8 gap-3 border-b border-sand-200 bg-sand-50 px-5 py-4 text-xs font-bold uppercase tracking-wide text-navy-600">
          <span className="col-span-2">Listing</span>
          <span>Guest</span>
          <span>Dates</span>
          <span>Nights</span>
          <span>Total</span>
          <span>Source</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-sand-100">
          {bookingsData.map((booking) => (
            <div key={booking.id} className="grid grid-cols-8 items-center gap-3 px-5 py-4 text-sm text-navy-800">
              <div className="col-span-2 font-semibold">{booking.listingTitle}</div>
              <div>{booking.guest}</div>
              <div className="text-xs text-navy-500">{booking.checkIn || '-'}<br />{booking.checkOut || '-'}</div>
              <div>{booking.nights}</div>
              <div className="font-bold">{formatCurrency(booking.total)}</div>
              <div className="capitalize">{booking.source}</div>
              <div className="flex items-center gap-2">
                <select value={booking.status} onChange={(event) => handleStatusChange(booking.id, event.target.value)} className="rounded-xl border border-sand-200 bg-white px-2 py-1 text-xs font-semibold">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => handleDelete(booking.id)} className="rounded-xl p-2 text-red-600 hover:bg-red-50" aria-label="Delete booking">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {bookingsData.length === 0 && (
            <div className="px-5 py-10 text-center text-navy-500">No bookings yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
