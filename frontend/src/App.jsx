import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GuestBookingPortal from './components/GuestBookingPortal';
import AdminDashboard from './components/AdminDashboard';
import BookingModal from './components/BookingModal';
import BookingLookupModal from './components/BookingLookupModal';

// Initial default data in Indian Rupees (INR)
const defaultRooms = [
  {
    roomNumber: "101",
    type: "Deluxe Ocean View",
    category: "Deluxe",
    floor: 1,
    pricePerNight: 5999,
    capacity: 2,
    bedType: "King Bed",
    status: "Available",
    amenities: ["Ocean View", "Balcony", "Free High-Speed Wi-Fi", "Air Conditioning", "Smart TV", "Mini Fridge", "En-suite Jacuzzi", "Complimentary Breakfast"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    description: "Spacious deluxe room featuring a private balcony with panoramic sunset views of the azure coast, premium king bed, and marble bathroom with soaking tub."
  },
  {
    roomNumber: "102",
    type: "Deluxe Garden Terrace",
    category: "Deluxe",
    floor: 1,
    pricePerNight: 4499,
    capacity: 2,
    bedType: "Queen Bed",
    status: "Occupied",
    amenities: ["Garden View", "Private Patio", "Free Wi-Fi", "Air Conditioning", "Rain Shower", "Work Desk", "Espresso Machine"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    description: "Peaceful ground-floor haven opening onto lush tropical gardens. Includes organic bath amenities and a dedicated outdoor lounge seating."
  },
  {
    roomNumber: "201",
    type: "Executive Suite",
    category: "Suite",
    floor: 2,
    pricePerNight: 8999,
    capacity: 3,
    bedType: "King Bed + Sofa Bed",
    status: "Occupied",
    amenities: ["Separate Living Area", "Executive Lounge Access", "High-Speed Wi-Fi", "Smart 65\" TV", "Mini Bar", "Walk-in Wardrobe", "Panoramic Skyline View"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    description: "A sanctuary of modern sophistication. Features an expansive separate lounge area, executive workstation, and complimentary cocktail hours in the Sky Lounge."
  },
  {
    roomNumber: "202",
    type: "Presidential Penthouse Suite",
    category: "Suite",
    floor: 2,
    pricePerNight: 24999,
    capacity: 4,
    bedType: "2 California Kings",
    status: "Available",
    amenities: ["Private Rooftop Pool", "Personal Butler Service", "Private Elevator", "Designer Kitchenette", "Fireplace", "Surround Sound Audio", "VIP Airport Transfer"],
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    description: "The crown jewel of our property. Over 1,800 sq ft of bespoke luxury, private plunge pool, and dedicated 24-hour butler at your service."
  },
  {
    roomNumber: "301",
    type: "Standard Classic Room",
    category: "Standard",
    floor: 3,
    pricePerNight: 2499,
    capacity: 2,
    bedType: "Double Bed",
    status: "Cleaning",
    amenities: ["City View", "Free Wi-Fi", "Climate Control", "Tea/Coffee Maker", "Flat-Screen TV", "Safe Deposit Box"],
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    description: "Comfort meets value in our well-appointed classic room, perfect for solo travelers or couples exploring the city."
  },
  {
    roomNumber: "302",
    type: "Standard Twin Room",
    category: "Standard",
    floor: 3,
    pricePerNight: 2999,
    capacity: 2,
    bedType: "2 Single Beds",
    status: "Available",
    amenities: ["High-Speed Wi-Fi", "Desk & Ergonomic Chair", "Soundproof Windows", "Luggage Rack", "Daily Housekeeping"],
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    description: "Ideal for colleagues or friends traveling together, featuring two plush twin mattresses with hypoallergenic linens."
  },
  {
    roomNumber: "401",
    type: "Family Grand Suite",
    category: "Family",
    floor: 4,
    pricePerNight: 11499,
    capacity: 5,
    bedType: "1 King + 2 Twin Beds",
    status: "Available",
    amenities: ["2 Connecting Bedrooms", "2 Full Bathrooms", "Kids Play Corner", "Dining Table", "Microwave & Refrigerator", "Complimentary Family Board Games"],
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
    description: "Designed for effortless family vacations. Two interconnected bedrooms ensure privacy for parents and fun for the children."
  },
  {
    roomNumber: "402",
    type: "Royal Honeymoon Villa",
    category: "Suite",
    floor: 4,
    pricePerNight: 14999,
    capacity: 2,
    bedType: "Canopy King Bed",
    status: "Maintenance",
    amenities: ["Private Hot Tub", "Chilled Champagne on Arrival", "Rose Petal Turndown", "Private Cabana", "Bluetooth Sound System", "In-room Couples Massage"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    description: "Romantic luxury crafted for unforgettable milestones. Features mood lighting, secluded private patio, and outdoor rain shower."
  }
];

const defaultBookings = [
  {
    bookingId: "BK-2026-8801",
    guest: {
      name: "Rohit Sharma",
      email: "rohit.sharma@example.com",
      phone: "+91 98201 23456",
      idProof: "Aadhaar: 4821 9028 1145"
    },
    roomNumber: "102",
    roomType: "Deluxe Garden Terrace",
    checkInDate: "2026-10-20",
    checkOutDate: "2026-10-24",
    numberOfGuests: 2,
    totalPrice: 20155,
    paymentStatus: "Paid",
    paymentMethod: "UPI (Google Pay)",
    bookingStatus: "Checked-In",
    specialRequests: "Quiet corner room, late check-out requested.",
    createdAt: "2026-10-18T14:20:00Z"
  },
  {
    bookingId: "BK-2026-8802",
    guest: {
      name: "Pooja Patel",
      email: "pooja.patel@techhub.in",
      phone: "+91 98765 43210",
      idProof: "Passport: Z6281944"
    },
    roomNumber: "201",
    roomType: "Executive Suite",
    checkInDate: "2026-10-21",
    checkOutDate: "2026-10-25",
    numberOfGuests: 1,
    totalPrice: 40315,
    paymentStatus: "Paid",
    paymentMethod: "UPI (PhonePe)",
    bookingStatus: "Checked-In",
    specialRequests: "High-speed ethernet cable & iron board required.",
    createdAt: "2026-10-19T09:15:00Z"
  },
  {
    bookingId: "BK-2026-8803",
    guest: {
      name: "Aarav Verma",
      email: "aarav.verma@delhicapital.com",
      phone: "+91 98111 87654",
      idProof: "Aadhaar: 7721 4459 3320"
    },
    roomNumber: "101",
    roomType: "Deluxe Ocean View",
    checkInDate: "2026-10-23",
    checkOutDate: "2026-10-28",
    numberOfGuests: 2,
    totalPrice: 33594,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    bookingStatus: "Confirmed",
    specialRequests: "Honeymoon setup with fresh flowers and cake.",
    createdAt: "2026-10-21T11:45:00Z"
  },
  {
    bookingId: "BK-2026-8804",
    guest: {
      name: "Ananya Singhania",
      email: "ananya.s@singhaniaenterprises.in",
      phone: "+91 99000 11223",
      idProof: "Passport: M8812903"
    },
    roomNumber: "202",
    roomType: "Presidential Penthouse Suite",
    checkInDate: "2026-10-26",
    checkOutDate: "2026-10-30",
    numberOfGuests: 3,
    totalPrice: 111995,
    paymentStatus: "Pending",
    paymentMethod: "Pay at Hotel",
    bookingStatus: "Confirmed",
    specialRequests: "VIP Airport pick-up from Terminal 2.",
    createdAt: "2026-10-20T16:30:00Z"
  }
];

const defaultGuests = [
  {
    id: "GST-01",
    name: "Rohit Sharma",
    email: "rohit.sharma@example.com",
    phone: "+91 98201 23456",
    membership: "Gold Member",
    totalStays: 4,
    totalSpent: 95400,
    notes: "Prefers high floors and feather pillows."
  },
  {
    id: "GST-02",
    name: "Pooja Patel",
    email: "pooja.patel@techhub.in",
    phone: "+91 98765 43210",
    membership: "Platinum VIP",
    totalStays: 9,
    totalSpent: 285000,
    notes: "Frequent corporate traveler. Requires fast checkout."
  },
  {
    id: "GST-03",
    name: "Aarav Verma",
    email: "aarav.verma@delhicapital.com",
    phone: "+91 98111 87654",
    membership: "Silver Member",
    totalStays: 2,
    totalSpent: 62000,
    notes: "Vegetarian breakfast preference."
  },
  {
    id: "GST-04",
    name: "Ananya Singhania",
    email: "ananya.s@singhaniaenterprises.in",
    phone: "+91 99000 11223",
    membership: "Diamond Elite",
    totalStays: 12,
    totalSpent: 540000,
    notes: "Always books penthouses or villas."
  }
];

export default function App() {
  const [activeMode, setActiveMode] = useState('guest');
  const [rooms, setRooms] = useState(defaultRooms);
  const [bookings, setBookings] = useState(defaultBookings);
  const [guests, setGuests] = useState(defaultGuests);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    fetch('http://localhost:5001/api/rooms')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setRooms(data.data);
        }
      })
      .catch(() => {});

    fetch('http://localhost:5001/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setBookings(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateRoomStatus = async (roomNumber, newStatus) => {
    setRooms(prev => prev.map(r => r.roomNumber === roomNumber ? { ...r, status: newStatus } : r));
    showToast(`Room #${roomNumber} updated to ${newStatus}`);

    try {
      await fetch(`http://localhost:5001/api/rooms/${roomNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {}
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    let affectedRoomNumber = null;

    setBookings(prev => prev.map(b => {
      if (b.bookingId === bookingId) {
        affectedRoomNumber = b.roomNumber;
        return { ...b, bookingStatus: newStatus };
      }
      return b;
    }));

    if (affectedRoomNumber) {
      if (newStatus === 'Checked-In') {
        handleUpdateRoomStatus(affectedRoomNumber, 'Occupied');
      } else if (newStatus === 'Checked-Out') {
        handleUpdateRoomStatus(affectedRoomNumber, 'Cleaning');
      } else if (newStatus === 'Cancelled') {
        handleUpdateRoomStatus(affectedRoomNumber, 'Available');
      }
    }

    showToast(`Booking ${bookingId} marked as ${newStatus}`);

    try {
      await fetch(`http://localhost:5001/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {}
  };

  const handleAddRoom = async (newRoom) => {
    setRooms(prev => [newRoom, ...prev]);
    showToast(`Room #${newRoom.roomNumber} added to inventory`);

    try {
      await fetch('http://localhost:5001/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom)
      });
    } catch (e) {}
  };

  const handleBookingSuccess = (newBooking) => {
    setBookings(prev => [newBooking, ...prev]);
    showToast(`Reservation ${newBooking.bookingId} confirmed!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <span>🔔</span> {toastMessage}
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenNewBooking={() => setSelectedRoomForBooking(rooms[0])}
      />

      {/* View Switcher */}
      {activeMode === 'guest' ? (
        <GuestBookingPortal
          rooms={rooms}
          onSelectRoom={(room) => setSelectedRoomForBooking(room)}
          onOpenLookup={() => setIsLookupOpen(true)}
        />
      ) : (
        <AdminDashboard
          rooms={rooms}
          bookings={bookings}
          guests={guests}
          onUpdateRoomStatus={handleUpdateRoomStatus}
          onUpdateBookingStatus={handleUpdateBookingStatus}
          onAddRoom={handleAddRoom}
        />
      )}

      {/* Booking Form Modal */}
      {selectedRoomForBooking && (
        <BookingModal
          room={selectedRoomForBooking}
          onClose={() => setSelectedRoomForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Find / Track Booking Modal */}
      {isLookupOpen && (
        <BookingLookupModal
          onClose={() => setIsLookupOpen(false)}
          allBookings={bookings}
        />
      )}

    </div>
  );
}
