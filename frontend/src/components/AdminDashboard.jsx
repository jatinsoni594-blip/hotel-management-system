import React, { useState } from 'react';

export default function AdminDashboard({
  rooms,
  bookings,
  guests,
  onUpdateRoomStatus,
  onUpdateBookingStatus,
  onAddRoom
}) {
  const [activeTab, setActiveTab] = useState('matrix');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

  // New Room Form State
  const [newRoomData, setNewRoomData] = useState({
    roomNumber: '',
    type: '',
    category: 'Deluxe',
    floor: 1,
    pricePerNight: 4999,
    capacity: 2,
    bedType: 'King Bed',
    amenities: 'Free High-Speed Wi-Fi, Air Conditioning, Smart TV'
  });

  // Calculate KPIs
  const totalRooms = rooms.length;
  const occupiedCount = rooms.filter(r => r.status === 'Occupied').length;
  const availableCount = rooms.filter(r => r.status === 'Available').length;
  const cleaningCount = rooms.filter(r => r.status === 'Cleaning').length;
  const maintenanceCount = rooms.filter(r => r.status === 'Maintenance').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;
  
  const totalRevenue = bookings
    .filter(b => b.bookingStatus !== 'Cancelled')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
    const q = bookingSearch.toLowerCase();
    const matchesSearch = 
      b.bookingId.toLowerCase().includes(q) ||
      b.guest.name.toLowerCase().includes(q) ||
      b.roomNumber.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleAddRoomSubmit = (e) => {
    e.preventDefault();
    if (!newRoomData.roomNumber || !newRoomData.type) return;

    const roomPayload = {
      ...newRoomData,
      floor: Number(newRoomData.floor),
      pricePerNight: Number(newRoomData.pricePerNight),
      capacity: Number(newRoomData.capacity),
      amenities: newRoomData.amenities.split(',').map(s => s.trim()),
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      description: 'Newly added luxury guest room with bespoke interior styling.'
    };

    onAddRoom(roomPayload);
    setIsAddRoomOpen(false);
    setNewRoomData({
      roomNumber: '',
      type: '',
      category: 'Deluxe',
      floor: 1,
      pricePerNight: 4999,
      capacity: 2,
      bedType: 'King Bed',
      amenities: 'Free High-Speed Wi-Fi, Air Conditioning, Smart TV'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                PMS Management System v1.0 (INR)
              </span>
            </div>
            <h1 className="font-serif-luxury text-3xl font-bold text-white mt-1">
              Grand Azure Front Desk & Admin
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live Room Inventory, Check-Ins, Housekeeping & Guest Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddRoomOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
            >
              <span>➕</span> Add New Room
            </button>
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Rooms</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{totalRooms}</span>
              <span className="text-xs text-slate-500">keys</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-xs text-slate-400 uppercase font-semibold">Occupancy</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-400">{occupancyRate}%</span>
              <span className="text-xs text-slate-500">({occupiedCount}/{totalRooms})</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
              <div
                className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-xs text-slate-400 uppercase font-semibold">Available</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-400">{availableCount}</span>
              <span className="text-xs text-emerald-500/80">Ready</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-xs text-slate-400 uppercase font-semibold">In Housekeeping</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-300">{cleaningCount}</span>
              <span className="text-xs text-slate-400">Cleaning</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 col-span-2 lg:col-span-1">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Revenue</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-blue-400">₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-8 border-b border-slate-800 overflow-x-auto pb-px">
          {[
            { id: 'matrix', label: '🎛️ Live Room Matrix', badge: `${availableCount} Available` },
            { id: 'bookings', label: '📅 Reservations Manager', badge: bookings.length },
            { id: 'housekeeping', label: '🧹 Housekeeping Queue', badge: `${cleaningCount + maintenanceCount}` },
            { id: 'guests', label: '👥 Guest Profiles', badge: guests.length },
            { id: 'analytics', label: '📊 Financial Analytics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-t-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-700 text-slate-300">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto">
        
        {/* TAB 1: LIVE ROOM MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Status Legend:</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Occupied
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Cleaning
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Maintenance
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rooms.map(room => (
                <div
                  key={room.roomNumber}
                  className={`p-5 rounded-2xl border transition-all ${
                    room.status === 'Available'
                      ? 'bg-slate-800/90 border-emerald-500/40 hover:border-emerald-400'
                      : room.status === 'Occupied'
                      ? 'bg-slate-800/90 border-rose-500/40 hover:border-rose-400'
                      : room.status === 'Cleaning'
                      ? 'bg-slate-800/90 border-amber-500/40 hover:border-amber-400'
                      : 'bg-slate-800/90 border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs text-slate-400 font-mono">Floor {room.floor}</span>
                      <h3 className="font-serif-luxury text-xl font-bold text-white">
                        Room #{room.roomNumber}
                      </h3>
                      <p className="text-xs text-slate-400 truncate max-w-[150px]">{room.type}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      room.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      room.status === 'Occupied' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      room.status === 'Cleaning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {room.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 py-2 border-y border-slate-700/60 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rate:</span>
                      <span className="font-bold text-white">₹{room.pricePerNight.toLocaleString('en-IN')} / night</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capacity:</span>
                      <span>{room.capacity} Guests ({room.bedType})</span>
                    </div>
                  </div>

                  {/* Quick Change Status Dropdown */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase">
                      Update Room Status:
                    </label>
                    <select
                      value={room.status}
                      onChange={(e) => onUpdateRoomStatus(room.roomNumber, e.target.value)}
                      className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400"
                    >
                      <option value="Available">Available (Ready)</option>
                      <option value="Occupied">Occupied (Guest In)</option>
                      <option value="Cleaning">Cleaning (Housekeeping)</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: RESERVATIONS MANAGER */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
              <input
                type="text"
                placeholder="Search by Guest Name, Booking ID, Room..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 w-full sm:w-80 focus:outline-none focus:border-amber-400"
              />

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-slate-800/70 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Booking ID</th>
                      <th className="py-3.5 px-4">Guest Details</th>
                      <th className="py-3.5 px-4">Room</th>
                      <th className="py-3.5 px-4">Stay Dates</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredBookings.map(b => (
                      <tr key={b.bookingId} className="hover:bg-slate-800/50 transition">
                        <td className="py-4 px-4 font-mono font-bold text-amber-400">
                          {b.bookingId}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-white">{b.guest.name}</div>
                          <div className="text-[11px] text-slate-400">{b.guest.email} · {b.guest.phone}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-white">#{b.roomNumber}</span>
                          <span className="text-[11px] text-slate-400 block">{b.roomType}</span>
                        </td>
                        <td className="py-4 px-4 text-[11px]">
                          <div>{b.checkInDate} → {b.checkOutDate}</div>
                          <span className="text-slate-500">{b.numberOfGuests} Guests</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-white">₹{b.totalPrice.toLocaleString('en-IN')}</div>
                          <span className="text-[10px] text-slate-400">{b.paymentMethod} ({b.paymentStatus})</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            b.bookingStatus === 'Confirmed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            b.bookingStatus === 'Checked-In' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            b.bookingStatus === 'Checked-Out' ? 'bg-slate-700 text-slate-400' :
                            'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.bookingStatus === 'Confirmed' && (
                              <button
                                onClick={() => onUpdateBookingStatus(b.bookingId, 'Checked-In')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition shadow"
                              >
                                Check In
                              </button>
                            )}
                            {b.bookingStatus === 'Checked-In' && (
                              <button
                                onClick={() => onUpdateBookingStatus(b.bookingId, 'Checked-Out')}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-bold transition shadow"
                              >
                                Check Out
                              </button>
                            )}
                            {b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'Checked-Out' && (
                              <button
                                onClick={() => onUpdateBookingStatus(b.bookingId, 'Cancelled')}
                                className="px-2 py-1 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 rounded-lg text-[11px] transition"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HOUSEKEEPING QUEUE */}
        {activeTab === 'housekeeping' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
              <h3 className="font-serif-luxury text-xl font-bold text-white">Housekeeping & Sanitization Board</h3>
              <p className="text-xs text-slate-400 mt-1">
                Rooms automatically routed to housekeeping upon guest check-out. Mark as inspected & clean to return to available inventory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').map(room => (
                <div key={room.roomNumber} className="p-5 rounded-2xl bg-slate-800/90 border border-amber-500/40 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-mono text-amber-400">Floor {room.floor}</span>
                    <h4 className="font-serif-luxury text-lg font-bold text-white">
                      Room #{room.roomNumber} - {room.type}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Status: <span className="font-bold text-amber-300">{room.status}</span> · Priority: High
                    </p>
                  </div>

                  <button
                    onClick={() => onUpdateRoomStatus(room.roomNumber, 'Available')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
                  >
                    ✓ Mark Clean & Available
                  </button>
                </div>
              ))}

              {rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').length === 0 && (
                <div className="col-span-2 text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-800 p-6">
                  <span className="text-3xl">✨</span>
                  <h4 className="font-bold text-white mt-2">All Rooms are Clean & Ready</h4>
                  <p className="text-xs text-slate-400 mt-1">No pending housekeeping or maintenance orders.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: GUEST DIRECTORY */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
              <h3 className="font-serif-luxury text-xl font-bold text-white">VIP Guest Directory</h3>
              <p className="text-xs text-slate-400 mt-1">
                Track guest loyalty tiers, past stays, and personalization notes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guests.map(g => (
                <div key={g.id || g.email} className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-white text-base">{g.name}</h4>
                      <p className="text-xs text-slate-400">{g.email} · {g.phone}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {g.membership || 'Gold Member'}
                    </span>
                  </div>

                  <div className="flex gap-4 text-xs text-slate-300 py-2 border-y border-slate-700/60 my-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">TOTAL STAYS</span>
                      <span className="font-bold">{g.totalStays || 1} stays</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">TOTAL SPENT</span>
                      <span className="font-bold text-emerald-400">₹{(g.totalSpent || 25000).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {g.notes && (
                    <p className="text-xs text-slate-400 italic">
                      "Note: {g.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
              <h3 className="font-serif-luxury text-xl font-bold text-white">Financial & Occupancy Analytics (INR)</h3>
              <p className="text-xs text-slate-400 mt-1">
                Performance indicators, room category popularity, and revenue flow in Indian Rupees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700/80">
                <span className="text-xs text-slate-400 uppercase font-semibold">Total Revenue Generated</span>
                <div className="text-3xl font-extrabold text-blue-400 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <p className="text-xs text-slate-500 mt-1">Across {bookings.length} reservations</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700/80">
                <span className="text-xs text-slate-400 uppercase font-semibold">Current Occupancy Rate</span>
                <div className="text-3xl font-extrabold text-amber-400 mt-2">{occupancyRate}%</div>
                <p className="text-xs text-slate-500 mt-1">{occupiedCount} rooms currently occupied</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700/80">
                <span className="text-xs text-slate-400 uppercase font-semibold">Average Daily Rate (ADR)</span>
                <div className="text-3xl font-extrabold text-emerald-400 mt-2">
                  ₹{Math.round(rooms.reduce((a, b) => a + b.pricePerNight, 0) / (totalRooms || 1)).toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-500 mt-1">Average rack rate per room night</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add New Room Modal */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white relative">
            <button
              onClick={() => setIsAddRoomOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <h3 className="font-serif-luxury text-2xl font-bold text-white mb-4">
              Add New Room to Inventory
            </h3>

            <form onSubmit={handleAddRoomSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 501"
                    value={newRoomData.roomNumber}
                    onChange={(e) => setNewRoomData({ ...newRoomData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Floor Level</label>
                  <input
                    type="number"
                    value={newRoomData.floor}
                    onChange={(e) => setNewRoomData({ ...newRoomData, floor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Room Name / Type *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skyline Panoramic Suite"
                  value={newRoomData.type}
                  onChange={(e) => setNewRoomData({ ...newRoomData, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={newRoomData.category}
                    onChange={(e) => setNewRoomData({ ...newRoomData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Price / Night (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newRoomData.pricePerNight}
                    onChange={(e) => setNewRoomData({ ...newRoomData, pricePerNight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Max Guests</label>
                  <input
                    type="number"
                    value={newRoomData.capacity}
                    onChange={(e) => setNewRoomData({ ...newRoomData, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Bed Configuration</label>
                  <input
                    type="text"
                    value={newRoomData.bedType}
                    onChange={(e) => setNewRoomData({ ...newRoomData, bedType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={newRoomData.amenities}
                  onChange={(e) => setNewRoomData({ ...newRoomData, amenities: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
