import { useState, useEffect } from 'react';
import DashboardStats from '../components/DashboardStats';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import {
  loadListings,
  loadBookings,
  loadCleaningRequests,
  loadConstructionRequests,
  loadConsultationRequests,
} from '../data/storage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchAdminBookings,
  fetchAdminCleaningRequests,
  fetchAdminConstructionRequests,
} from '../lib/admin';

const normalizeStatus = (value) => String(value || '').toLowerCase();
const normalizeDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

export default function DashboardOverview() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [consultationRequests, setConsultationRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [agendaBookings, setAgendaBookings] = useState(() => loadBookings());
  const [agendaCleaning, setAgendaCleaning] = useState(() => loadCleaningRequests());
  const [agendaConstruction, setAgendaConstruction] = useState(() => loadConstructionRequests());

  useEffect(() => {
    const requests = loadConsultationRequests();
    setConsultationRequests(requests);
    setUnreadCount(requests.filter((req) => !req.isRead).length);

    const handleUpdate = () => {
      const updatedRequests = loadConsultationRequests();
      setConsultationRequests(updatedRequests);
      setUnreadCount(updatedRequests.filter((req) => !req.isRead).length);
    };

    window.addEventListener('consultation-request-submitted', handleUpdate);
    window.addEventListener('homepage-config-updated', handleUpdate);

    Promise.allSettled([
      fetchAdminBookings(),
      fetchAdminCleaningRequests(),
      fetchAdminConstructionRequests(),
    ]).then(([bookingsResult, cleaningResult, constructionResult]) => {
      if (bookingsResult.status === 'fulfilled' && Array.isArray(bookingsResult.value)) {
        setAgendaBookings(bookingsResult.value);
      }
      if (cleaningResult.status === 'fulfilled' && Array.isArray(cleaningResult.value)) {
        setAgendaCleaning(cleaningResult.value);
      }
      if (constructionResult.status === 'fulfilled' && Array.isArray(constructionResult.value)) {
        setAgendaConstruction(constructionResult.value);
      }
    });

    return () => {
      window.removeEventListener('consultation-request-submitted', handleUpdate);
      window.removeEventListener('homepage-config-updated', handleUpdate);
    };
  }, []);

  const listings = loadListings();
  const bookings = agendaBookings;
  const cleaningRequests = agendaCleaning;
  const constructionRequests = agendaConstruction;

  const revenue = bookings.reduce((sum, b) => sum + Number(b.finalPrice ?? b.totalPrice ?? b.total ?? 0), 0);
  const stats = [
    { label: 'Total rentals', value: listings.length },
    { label: 'Total bookings', value: bookings.length },
    { label: 'Cleaning requests', value: cleaningRequests.length },
    { label: 'Construction requests', value: constructionRequests.length + consultationRequests.length },
    { label: 'Revenue', value: `${Math.round(revenue)} DT` },
  ];

  // Calendar logic
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  
  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const events = [];

    // Check bookings
    bookings.forEach((booking) => {
      const checkIn = normalizeDate(booking.checkIn || booking.date);
      if (checkIn === dateStr) {
        events.push({
          type: 'booking',
          label: `Booking: ${booking.guestName || booking.guest || 'Guest'}`,
          detail: `${booking.listing?.title || booking.listingTitle || booking.listingId || ''}`,
        });
      }
    });

    // Show only confirmed/completed cleaning work in agenda.
    cleaningRequests.forEach((req) => {
      const status = normalizeStatus(req.status);
      const reqDate = normalizeDate(req.date);
      if (reqDate === dateStr && ['confirmed', 'completed', 'assigned'].includes(status)) {
        events.push({ type: 'cleaning', label: `Cleaning: ${req.clientName || req.client || 'Client'}`, detail: status });
      }
    });

    // Show confirmed/completed/assigned construction work in agenda.
    constructionRequests.forEach((req) => {
      const status = normalizeStatus(req.status);
      const reqDate = normalizeDate(req.date);
      if (reqDate === dateStr && ['confirmed', 'completed', 'assigned'].includes(status)) {
        events.push({ type: 'construction', label: `Construction: ${req.name || 'Client'}`, detail: status });
      }
    });

    return events;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div>
        <h2 className="text-3xl font-bold text-navy mb-6">Dashboard Overview</h2>
        <DashboardStats data={stats} />
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-navy">Schedule & Events</h3>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 font-semibold text-lg">{monthName}</span>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-bold text-navy py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            const events = date ? getEventsForDate(date) : [];
            const isToday =
              date &&
              date.toDateString() === new Date().toDateString();
            const isCurrentMonth = date && date.getMonth() === currentDate.getMonth();

            return (
              <div
                key={idx}
                className={`p-2 rounded-lg border min-h-24 transition ${
                  !date
                    ? 'bg-gray-50 border-gray-200'
                    : isToday
                    ? 'bg-primary-100 border-primary-500 border-2'
                    : !isCurrentMonth
                    ? 'bg-gray-50 text-gray-400 border-gray-200'
                    : 'bg-white border-gray-200 hover:border-primary-300'
                }`}
              >
                {date && (
                  <>
                    <div className={`font-bold text-sm mb-1 ${isToday ? 'text-primary-700' : ''}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {events.slice(0, 2).map((event, i) => (
                        <div
                          key={i}
                          className={`rounded px-2 py-1 text-xs font-semibold ${
                            event.type === 'booking'
                              ? 'bg-blue-100 text-blue-700'
                              : event.type === 'cleaning'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                          title={event.label}
                        >
                          <span className="block truncate">{event.label}</span>
                          {event.detail && <span className="block truncate opacity-70">{event.detail}</span>}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{events.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 rounded border border-blue-300"></div>
            <span className="text-sm text-gray-700">Bookings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded border border-green-300"></div>
            <span className="text-sm text-gray-700">Cleaning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 rounded border border-orange-300"></div>
            <span className="text-sm text-gray-700">Construction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-100 rounded border-2 border-primary-500"></div>
            <span className="text-sm text-gray-700">Today</span>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-navy">Upcoming Events & Requests</h3>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2">
              <Bell className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-semibold text-primary-600">{unreadCount} new consultation request{unreadCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {consultationRequests.length > 0 && (
            <>
              <h4 className="font-semibold text-purple-700">Consultation Requests:</h4>
              {consultationRequests.slice(0, 2).map((req) => (
                <div
                  key={req.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    req.isRead
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-purple-50 border-purple-500'
                  }`}
                >
                  <p className="font-medium">{req.name} {!req.isRead && <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded ml-2">NEW</span>}</p>
                  <p className="text-sm text-gray-600">
                    Type: <span className="font-semibold capitalize">{req.type}</span> | Email: <span className="font-semibold">{req.email}</span>
                  </p>
                </div>
              ))}
            </>
          )}

          {bookings.length > 0 && (
            <>
              <h4 className="font-semibold text-blue-700 mt-4">Recent Bookings:</h4>
              {bookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                >
                  <p className="font-medium">Guest: {booking.guest}</p>
                  <p className="text-sm text-gray-600">
                    Status: <span className="font-semibold">{booking.status}</span>
                  </p>
                </div>
              ))}
            </>
          )}

          {cleaningRequests.length > 0 && (
            <>
              <h4 className="font-semibold text-green-700 mt-4">Cleaning Requests:</h4>
              {cleaningRequests.slice(0, 2).map((req) => (
                <div
                  key={req.id}
                  className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500"
                >
                  <p className="font-medium">Client: {req.client}</p>
                  <p className="text-sm text-gray-600">
                    Type: <span className="font-semibold capitalize">{req.type}</span> | Status:{' '}
                    <span className="font-semibold">{req.status}</span>
                  </p>
                </div>
              ))}
            </>
          )}

          {constructionRequests.length > 0 && (
            <>
              <h4 className="font-semibold text-orange-700 mt-4">Construction Tasks:</h4>
              {constructionRequests.slice(0, 2).map((req) => (
                <div
                  key={req.id}
                  className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500"
                >
                  <p className="font-medium">Client: {req.name}</p>
                  <p className="text-sm text-gray-600">
                    Type: <span className="font-semibold capitalize">{req.type}</span>
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
