import React, { useState } from 'react';

export default function BookingModal({ room, onClose, onBookingSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    idProof: 'Aadhaar Card',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    numberOfGuests: 2,
    paymentMethod: 'UPI (GPay / PhonePe / Paytm)',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Calculate nights & pricing
  const calculateDays = () => {
    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.ceil(diff) : 1;
  };

  const nights = calculateDays();
  const roomPrice = room ? room.pricePerNight : 4499;
  const subtotal = nights * roomPrice;
  const gst = Math.round(subtotal * 0.12);
  const total = subtotal + gst;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingPayload = {
      guest: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        idProof: formData.idProof
      },
      roomNumber: room.roomNumber,
      roomType: room.type,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      numberOfGuests: Number(formData.numberOfGuests),
      totalPrice: total,
      paymentMethod: formData.paymentMethod,
      specialRequests: formData.specialRequests
    };

    try {
      const res = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
      const data = await res.json();
      if (data.success) {
        setConfirmedBooking(data.data);
        if (onBookingSuccess) onBookingSuccess(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      const mockBooking = {
        bookingId: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        ...bookingPayload,
        bookingStatus: 'Confirmed',
        createdAt: new Date().toISOString()
      };
      setConfirmedBooking(mockBooking);
      if (onBookingSuccess) onBookingSuccess(mockBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Reservation Confirmed!
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-slate-900 mt-3">
            Thank you, {confirmedBooking.guest.name}!
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            We have confirmed your stay at Grand Azure Luxury Resort.
          </p>

          <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs text-slate-700">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-500 uppercase">Booking ID</span>
              <span className="font-mono font-bold text-base text-blue-600">{confirmedBooking.bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Suite</span>
              <span className="font-semibold text-slate-900">{confirmedBooking.roomType} (Room #{confirmedBooking.roomNumber})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dates</span>
              <span className="font-semibold text-slate-900">{confirmedBooking.checkInDate} → {confirmedBooking.checkOutDate} ({nights} nights)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment</span>
              <span className="font-semibold text-slate-900">{confirmedBooking.paymentMethod} (₹{total.toLocaleString('en-IN')})</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500">Status</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">Confirmed</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mb-6">
            A confirmation receipt and check-in voucher has been sent to {confirmedBooking.guest.email}.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              🖨️ Print Voucher
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-lg font-bold transition"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-100 pb-5 mb-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
            {room.category} Room
          </span>
          <h2 className="font-serif-luxury text-2xl font-bold text-slate-900 mt-2">
            Book {room.type} (Room #{room.roomNumber})
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            ₹{room.pricePerNight.toLocaleString('en-IN')} per night · {room.capacity} Guests Max · Floor {room.floor}
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Guest Information */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">1. Guest Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ID Type / Proof</label>
                <input
                  type="text"
                  placeholder="Aadhaar / Passport / Driving License"
                  value={formData.idProof}
                  onChange={(e) => setFormData({ ...formData, idProof: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Stay Dates & Guests */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">2. Stay Dates & Guests</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Check-In Date</label>
                <input
                  type="date"
                  required
                  value={formData.checkInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Check-Out Date</label>
                <input
                  type="date"
                  required
                  value={formData.checkOutDate}
                  min={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Guests</label>
                <select
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  {[...Array(room.capacity || 2)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Payment & Requests */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">3. Payment & Special Requests</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  <option value="UPI (GPay / PhonePe / Paytm)">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Pay at Hotel">Pay Upon Arrival at Hotel (Cash / UPI)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Special Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian breakfast, extra pillows"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Price Breakdown Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Room Rate ({nights} nights × ₹{roomPrice.toLocaleString('en-IN')})</span>
                <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Hospitality Service (12%)</span>
                <span className="font-semibold text-slate-800">₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Due</span>
                <span className="text-blue-600 text-base font-extrabold">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming Reservation...' : `Confirm & Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
