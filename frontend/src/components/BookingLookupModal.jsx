import React, { useState } from 'react';

export default function BookingLookupModal({ onClose, allBookings }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setSearched(true);

    if (!query.trim()) {
      setError('Please enter a Booking ID or email address');
      return;
    }

    const q = query.trim().toUpperCase();
    const found = allBookings.find(
      b => b.bookingId.toUpperCase() === q || b.guest.email.toUpperCase() === q
    );

    if (found) {
      setResult(found);
    } else {
      setResult(null);
      setError(`No active booking found matching "${query}". Please check the ID or email.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>

        <div className="mb-5">
          <span className="text-xl">🔍</span>
          <h3 className="font-serif-luxury text-xl font-bold text-slate-900 mt-2">
            Find Your Reservation
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Enter your Booking Reference (e.g. BK-2026-8801) or registered email address.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="BK-2026-8801 or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
            >
              Search
            </button>
          </div>
        </form>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-3">
            {error}
          </div>
        )}

        {result && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900">{result.bookingId}</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                result.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                result.bookingStatus === 'Checked-In' ? 'bg-blue-100 text-blue-700' :
                result.bookingStatus === 'Checked-Out' ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {result.bookingStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Guest Name:</span>
              <span className="font-semibold">{result.guest.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Suite / Room:</span>
              <span className="font-semibold">{result.roomType} (Room {result.roomNumber})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Check-In / Out:</span>
              <span className="font-semibold">{result.checkInDate} to {result.checkOutDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Price:</span>
              <span className="font-bold text-slate-900">₹{result.totalPrice.toLocaleString('en-IN')} ({result.paymentStatus})</span>
            </div>
            {result.specialRequests && (
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">Special Note:</span> {result.specialRequests}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
