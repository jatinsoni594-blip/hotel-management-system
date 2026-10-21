# 🏨 Grand Azure Luxury Hotel & Resort - Management System

A complete full-stack **Hotel Management System (MERN Stack)** designed to fulfill all requirements for hotel property management, online room booking, front-desk operations, room inventory tracking, housekeeping workflows, and financial analytics.

---

## 📋 System Requirements Fulfilled

| Requirement | Specification | Status |
| :--- | :--- | :--- |
| **Operating System** | macOS, Windows 10/11, or Linux | ✅ Fully Supported |
| **Node.js** | v16 or above (Tested on Node v22) | ✅ Configured |
| **npm** | v8 or above (Tested on npm v10) | ✅ Configured |
| **React.js** | Dynamic, responsive component-based UI | ✅ Implemented |
| **Express.js** | RESTful API routing, error handling & middleware | ✅ Implemented |
| **MongoDB** | Schemas for Rooms, Bookings, Guests, and Users | ✅ Mongoose Models + Resilient Fallback |
| **Postman** | Complete pre-built Postman collection for API testing | ✅ Included in `/postman` |
| **Code Editor** | Visual Studio Code ready | ✅ Ready |

---

## 🚀 Quick Start (Instant 1-Step Run)

You can launch the complete application and REST API immediately with zero external package installations:

```bash
# 1. Navigate to the project
cd hotel-management-system

# 2. Start the instant full-stack server
node start-server.js
```

Then open your browser at:
👉 **`http://localhost:5001`**

Or simply open `preview.html` directly in Google Chrome / Safari:
```bash
open preview.html
```

---

## 🛠️ Full MERN Stack Development Setup

### 1. Backend Setup (Express + MongoDB)
```bash
cd hotel-management-system/backend

# Install dependencies (Express, Mongoose, CORS, Dotenv, JWT, Bcrypt)
npm install

# (Optional) Seed initial hotel rooms, bookings, and guests into MongoDB
npm run seed

# Start Express server in development mode
npm run dev
# Server will run on http://localhost:5001
```

> **Note**: If MongoDB is not running locally on your computer, the backend automatically uses its built-in in-memory fallback so the API and app never crash.

### 2. Frontend Setup (React + Vite + Tailwind CSS)
```bash
cd hotel-management-system/frontend

# Install React dependencies
npm install

# Start Vite React development server
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 🌟 Key Features

### 1. 🏖️ Guest Booking Portal
- **Luxury Showcase**: Hero banner, hotel amenities, and suite photography.
- **Dynamic Search & Filter**: Filter by Room Category (`Deluxe`, `Suite`, `Standard`, `Family`), max nightly price slider, and guest count.
- **Live Booking Flow**:
  - Interactive calendar date picker (Check-In & Check-Out).
  - Real-time stay duration and dynamic total price calculation (Nightly rate × nights + 12% tax).
  - Payment options: Credit Card, Debit Card, UPI, or Pay at Hotel.
  - Generates official Booking Reference (e.g. `BK-2026-8801`).
  - Printable reservation voucher with one click.
- **Track My Reservation**: Lookup any booking by reference ID or guest email to verify current status.

### 2. 🛡️ Front-Desk & Admin PMS Dashboard
- **Top Stats & KPIs**: Total Rooms, Occupancy Rate (%), Available Keys, Total Revenue (₹ in Indian Rupees).
- **Pricing & Tariffs**: Displayed natively in Indian Rupees (₹) with standard Indian format (e.g. ₹5,999, ₹24,999).
- **Indian Payment Methods**: Full support for UPI (Google Pay, PhonePe, Paytm), Net Banking, Cards, and Cash at Hotel.
- **GST Calculation**: Auto-calculated 12% GST and service charge on reservation receipts.
- **Live Room Matrix**: Color-coded room grid (Green = Available, Red = Occupied, Yellow = Housekeeping/Cleaning, Gray = Maintenance) with instant 1-click status dropdowns.
- **Reservations Lifecycle Manager**:
  - Filter bookings by `Confirmed`, `Checked-In`, `Checked-Out`, or `Cancelled`.
  - **Check-In Guest**: One-click check-in that automatically transitions the associated room to `Occupied`.
  - **Check-Out Guest**: Marks booking complete and automatically routes the room to `Cleaning` in housekeeping.
  - **Cancel Reservation**: Re-opens the room to `Available` inventory.
- **Housekeeping & Sanitization Board**: Dedicated queue for rooms requiring inspection/cleaning with a "Mark Clean & Available" button.
- **VIP Guest Directory**: Guest contact info, loyalty tier (Platinum VIP, Gold, Diamond Elite), stay history, and personalized preferences.
- **Room Inventory Creator**: Modal form to add new rooms with room number, type, category, price, floor, and amenities.
- **Financial Analytics**: Revenue breakdowns and average daily rack rate.

---

## 📡 RESTful API Endpoints

All endpoints support JSON requests and CORS.

### Rooms
- `GET /api/rooms` - Fetch all rooms (query parameters: `?status=Available&category=Deluxe&capacity=2&maxPrice=300`)
- `GET /api/rooms/:roomNumber` - Fetch details for a specific room
- `POST /api/rooms` - Create a new room in inventory
- `PUT /api/rooms/:roomNumber` - Update room details
- `PATCH /api/rooms/:roomNumber/status` - Update room status (`Available`, `Occupied`, `Cleaning`, `Maintenance`)
- `DELETE /api/rooms/:roomNumber` - Remove a room from inventory

### Bookings & Reservations
- `GET /api/bookings` - List all reservations (supports `?status=Confirmed&search=Sophia`)
- `GET /api/bookings/:id` - Fetch reservation by Booking ID (`BK-2026-8801`) or email
- `POST /api/bookings` - Create a new reservation
- `PATCH /api/bookings/:bookingId/status` - Update booking status (`Confirmed`, `Checked-In`, `Checked-Out`, `Cancelled`)

### Dashboard & Analytics
- `GET /api/stats` - Key operational metrics (occupancy rate, available keys, revenue, check-ins)
- `GET /api/guests` - Registered guest directory
- `POST /api/auth/login` - Staff & admin authentication

---

## 📮 Postman Collection

A complete Postman collection is included in the project:
📁 `postman/Hotel_Management_API.postman_collection.json`

### How to Import in Postman:
1. Open **Postman**.
2. Click **Import** in the top left.
3. Drag & drop `postman/Hotel_Management_API.postman_collection.json`.
4. You can immediately execute and test all 11 pre-configured API requests!

---

## 📁 Project Directory Structure

```
hotel-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection + fallback
│   ├── models/
│   │   ├── Room.js               # Mongoose Room schema
│   │   ├── Booking.js            # Mongoose Booking schema
│   │   ├── Guest.js              # Mongoose Guest schema
│   │   └── User.js               # Mongoose Staff/Admin schema
│   ├── controllers/
│   │   ├── roomController.js     # Room CRUD & status logic
│   │   ├── bookingController.js  # Booking lifecycle & analytics
│   │   ├── guestController.js    # Guest directory
│   │   └── authController.js     # Staff login
│   ├── routes/
│   │   ├── roomRoutes.js         # /api/rooms routes
│   │   ├── bookingRoutes.js      # /api/bookings routes
│   │   ├── guestRoutes.js        # /api/guests routes
│   │   └── authRoutes.js         # /api/auth routes
│   ├── data/
│   │   ├── seedData.js           # Realistic initial sample data
│   │   └── seed.js               # MongoDB seeder script
│   ├── middleware/
│   │   └── errorHandler.js       # Global error handler
│   ├── server.js                 # Express server entry point
│   ├── .env.example              # Environment variables template
│   └── package.json              # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header & Mode Switcher
│   │   │   ├── GuestBookingPortal.jsx   # Guest catalog & filters
│   │   │   ├── AdminDashboard.jsx       # Staff PMS Console
│   │   │   ├── BookingModal.jsx         # Booking form & voucher
│   │   │   └── BookingLookupModal.jsx   # Track reservation modal
│   │   ├── App.jsx                      # Main React application
│   │   ├── main.jsx                     # React DOM entry
│   │   └── index.css                    # Tailwind CSS configuration
│   ├── public/
│   │   └── index.html                   # HTML template
│   ├── vite.config.js                   # Vite config with API proxy
│   ├── tailwind.config.js               # Custom theme colors
│   └── package.json                     # Frontend dependencies
├── postman/
│   └── Hotel_Management_API.postman_collection.json
├── preview.html                  # Standalone 1-click preview
├── start-server.js               # Zero-dependency instant server
└── README.md
```
