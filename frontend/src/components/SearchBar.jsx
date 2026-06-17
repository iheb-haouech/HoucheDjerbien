import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Search, Users } from 'lucide-react';

export default function SearchBar({ initial = {} }) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(initial.checkIn || '');
  const [checkOut, setCheckOut] = useState(initial.checkOut || '');
  const [adults, setAdults] = useState(initial.adults || 2);
  const [children, setChildren] = useState(initial.children || 0);

  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('adults', adults);
    params.set('children', children);

    navigate(`/rentals?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="search-panel">
      <div className="search-field">
        <label>Check-in</label>
        <div className="search-input-wrap">
          <CalendarDays className="h-4 w-4 text-primary-600" />
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </div>
      </div>

      <div className="search-field">
        <label>Check-out</label>
        <div className="search-input-wrap">
          <CalendarDays className="h-4 w-4 text-primary-600" />
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        </div>
      </div>

      <div className="search-field">
        <label>Adults</label>
        <div className="search-input-wrap">
          <Users className="h-4 w-4 text-primary-600" />
          <input type="number" min={1} value={adults} onChange={(e) => setAdults(Number(e.target.value))} />
        </div>
      </div>

      <div className="search-field">
        <label>Children</label>
        <div className="search-input-wrap">
          <Users className="h-4 w-4 text-primary-600" />
          <input type="number" min={0} value={children} onChange={(e) => setChildren(Number(e.target.value))} />
        </div>
      </div>

      <button type="submit" className="search-submit">
        <Search className="h-5 w-5" />
        Search
      </button>
    </form>
  );
}
