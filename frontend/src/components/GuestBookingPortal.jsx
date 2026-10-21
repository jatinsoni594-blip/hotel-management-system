import React, { useState } from 'react';

export default function GuestBookingPortal({ rooms, onSelectRoom, onOpenLookup }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(30000);
  const [guestCount, setGuestCount] = useState('All');

  const categories = ['All', 'Standard', 'Deluxe', 'Suite', 'Family'];

  const filteredRooms = rooms.filter(room => {
    const matchesCategory = selectedCategory === 'All' || room.category === selectedCategory;
    const matchesPrice = room.pricePerNight <= maxPrice;
    const matchesGuests = guestCount === 'All' || room.capacity >= Number(guestCount);
    return matchesCategory && matchesPrice && matchesGuests;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image & Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase">
            <span>✨</span> World-Class Hospitality & Oceanfront Living
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            Experience Unrivaled <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              Luxury & Indian Hospitality
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-light">
            Indulge in tailored penthouse suites, private infinity pools, and Michelin-inspired dining at Grand Azure.
          </p>

          {/* Quick Search & Filter Bar */}
          <div className="mt-8 max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 text-slate-900 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Suite Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-100/80 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  {categories.map(c => <option key={c} value={c}>{c} {c !== 'All' ? 'Suites' : ''}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Min Guests
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-100/80 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="All">Any Size</option>
                  <option value="1">1+ Guest</option>
                  <option value="2">2+ Guests</option>
                  <option value="3">3+ Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Max Nightly Rate (₹{maxPrice.toLocaleString('en-IN')})
                </label>
                <div className="pt-2">
                  <input
                    type="range"
                    min="1500"
                    max="30000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <a
                  href="#rooms"
                  className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition"
                >
                  View Available ({filteredRooms.length})
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Rooms Showcase Section */}
      <section id="rooms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
              Accommodations
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
              Curated Suites & Villas
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select from our award-winning collection with transparent Indian Rupee tariffs.
            </p>
          </div>

          {/* Category Quick Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.roomNumber}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={room.image}
                    alt={room.type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
                      Room {room.roomNumber}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow">
                      {room.category}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                      room.status === 'Available'
                        ? 'bg-emerald-500/90 text-white'
                        : room.status === 'Occupied'
                        ? 'bg-rose-500/90 text-white'
                        : 'bg-amber-500/90 text-white'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-serif-luxury text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {room.type}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 py-3 border-y border-slate-100 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span>🛏️</span>
                      <span className="truncate">{room.bedType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>👥</span>
                      <span>Up to {room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>🏢</span>
                      <span>Floor {room.floor}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>🚿</span>
                      <span>En-suite Bath</span>
                    </div>
                  </div>

                  {/* Amenities Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {room.amenities.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-600"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-500">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900">₹{room.pricePerNight.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-400 font-medium"> / night</span>
                </div>

                <button
                  onClick={() => onSelectRoom(room)}
                  disabled={room.status !== 'Available'}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
                    room.status === 'Available'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {room.status === 'Available' ? 'Reserve Suite' : 'Reserved'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <span className="text-4xl">🏨</span>
            <h3 className="text-lg font-bold text-slate-800 mt-2">No suites match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try expanding your price range or changing category.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setMaxPrice(30000); setGuestCount('All'); }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Hotel Amenities Section */}
      <section id="amenities" className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold tracking-widest uppercase text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Resort Amenities
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold mt-3">
              Crafted for Indulgent Comfort
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Everything you need for an unforgettable coastal getaway.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏊‍♂️', title: 'Infinity Ocean Pool', desc: 'Heated oceanfront pool with private day cabanas and refreshing mocktail service.' },
              { icon: '🍽️', title: 'Michelin-Caliber Dining', desc: 'Authentic Indian regional delicacies and coastal international gourmet cuisine.' },
              { icon: '💆‍♀️', title: 'Holistic Ayurvedic Spa', desc: 'Traditional Ayurvedic therapies, steam rooms, and restorative massage suites.' },
              { icon: '🛎️', title: '24/7 Dedicated Concierge', desc: 'Personalized hospitality service ready to organize excursions and airport transfers.' },
              { icon: '🚗', title: 'Valet & Luxury Chauffeur', desc: 'Complimentary luxury car service and EV high-speed charging stations.' },
              { icon: '📶', title: 'Fiber Gigabit Wi-Fi', desc: 'Ultra-fast wireless network coverage across all suites, conference halls, and gardens.' }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-amber-500/40 transition">
                <span className="text-3xl block mb-3">{f.icon}</span>
                <h4 className="font-serif-luxury text-lg font-bold text-white mb-1">{f.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 px-4 border-t border-slate-800 text-center">
        <p className="font-serif-luxury font-bold text-lg text-white mb-2">Grand Azure Luxury Hotel & Resort</p>
        <p>Marine Drive Coastline, Mumbai / Goa · Reservations: +91 (800) 555-AZURE</p>
        <p className="mt-4 text-slate-500">© 2026 Grand Azure Hotel Management System. Built with MERN Stack (INR Currency Supported).</p>
      </footer>

    </div>
  );
}
