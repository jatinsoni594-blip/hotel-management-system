/**
 * Zero-Dependency Instant Server for Grand Azure Hotel Management System
 * Uses Node.js built-in 'http', 'fs', and 'path' modules.
 * Runs anywhere without requiring 'npm install' or external database setup!
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { seedRooms, seedBookings, seedGuests } = require('./backend/data/seedData');

const PORT = process.env.PORT || 5001;

// Persistent In-memory store
let rooms = JSON.parse(JSON.stringify(seedRooms));
let bookings = JSON.parse(JSON.stringify(seedBookings));
let guests = JSON.parse(JSON.stringify(seedGuests));

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // --- API ROUTING ---

  // GET /api/rooms
  if (method === 'GET' && pathname === '/api/rooms') {
    const status = parsedUrl.searchParams.get('status');
    const category = parsedUrl.searchParams.get('category');
    let filtered = [...rooms];
    if (status && status !== 'All') filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
    if (category && category !== 'All') filtered = filtered.filter(r => r.category.toLowerCase() === category.toLowerCase());
    return sendJSON(res, 200, { success: true, count: filtered.length, data: filtered });
  }

  // POST /api/rooms
  if (method === 'POST' && pathname === '/api/rooms') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newRoom = JSON.parse(body);
        rooms.unshift(newRoom);
        return sendJSON(res, 201, { success: true, data: newRoom });
      } catch (err) {
        return sendJSON(res, 400, { success: false, message: 'Invalid JSON' });
      }
    });
    return;
  }

  // PATCH /api/rooms/:roomNumber/status
  if (method === 'PATCH' && pathname.startsWith('/api/rooms/') && pathname.endsWith('/status')) {
    const parts = pathname.split('/');
    const roomNumber = parts[3];
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { status } = JSON.parse(body);
        const room = rooms.find(r => r.roomNumber === roomNumber);
        if (room) {
          room.status = status;
          return sendJSON(res, 200, { success: true, data: room });
        }
        return sendJSON(res, 404, { success: false, message: 'Room not found' });
      } catch (e) {
        return sendJSON(res, 400, { success: false, message: 'Invalid payload' });
      }
    });
    return;
  }

  // GET /api/bookings
  if (method === 'GET' && pathname === '/api/bookings') {
    const search = parsedUrl.searchParams.get('search');
    let filtered = [...bookings];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(b =>
        b.bookingId.toLowerCase().includes(q) ||
        b.guest.name.toLowerCase().includes(q) ||
        b.roomNumber.toLowerCase().includes(q)
      );
    }
    return sendJSON(res, 200, { success: true, count: filtered.length, data: filtered });
  }

  // POST /api/bookings
  if (method === 'POST' && pathname === '/api/bookings') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const newBooking = {
          bookingId: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          ...payload,
          bookingStatus: 'Confirmed',
          paymentStatus: payload.paymentMethod === 'Pay at Hotel' ? 'Pending' : 'Paid',
          createdAt: new Date().toISOString()
        };
        bookings.unshift(newBooking);
        return sendJSON(res, 201, { success: true, data: newBooking });
      } catch (err) {
        return sendJSON(res, 400, { success: false, message: 'Invalid request payload' });
      }
    });
    return;
  }

  // PATCH /api/bookings/:bookingId/status
  if (method === 'PATCH' && pathname.startsWith('/api/bookings/') && pathname.endsWith('/status')) {
    const parts = pathname.split('/');
    const bookingId = parts[3];
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { status } = JSON.parse(body);
        const booking = bookings.find(b => b.bookingId.toUpperCase() === bookingId.toUpperCase());
        if (booking) {
          booking.bookingStatus = status;
          // Cascade to room
          const room = rooms.find(r => r.roomNumber === booking.roomNumber);
          if (room) {
            if (status === 'Checked-In') room.status = 'Occupied';
            else if (status === 'Checked-Out') room.status = 'Cleaning';
            else if (status === 'Cancelled') room.status = 'Available';
          }
          return sendJSON(res, 200, { success: true, data: booking });
        }
        return sendJSON(res, 404, { success: false, message: 'Booking not found' });
      } catch (e) {
        return sendJSON(res, 400, { success: false, message: 'Invalid body' });
      }
    });
    return;
  }

  // GET /api/stats
  if (method === 'GET' && pathname === '/api/stats') {
    const occupied = rooms.filter(r => r.status === 'Occupied').length;
    const available = rooms.filter(r => r.status === 'Available').length;
    const cleaning = rooms.filter(r => r.status === 'Cleaning').length;
    const totalRev = bookings.filter(b => b.bookingStatus !== 'Cancelled').reduce((s, b) => s + (b.totalPrice || 0), 0);

    return sendJSON(res, 200, {
      success: true,
      data: {
        totalRooms: rooms.length,
        occupiedRooms: occupied,
        availableRooms: available,
        cleaningRooms: cleaning,
        occupancyRate: Math.round((occupied / rooms.length) * 100),
        totalRevenue: totalRev,
        totalBookings: bookings.length
      }
    });
  }

  // GET /api/guests
  if (method === 'GET' && pathname === '/api/guests') {
    return sendJSON(res, 200, { success: true, count: guests.length, data: guests });
  }

  // Serve Single Page Web Application (preview.html)
  if (pathname === '/' || pathname === '/preview' || pathname === '/index.html') {
    const previewPath = path.join(__dirname, 'preview.html');
    if (fs.existsSync(previewPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return fs.createReadStream(previewPath).pipe(res);
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🏨 Grand Azure Hotel Management System is Live!`);
  console.log(`🌐 Web Application: http://localhost:${PORT}`);
  console.log(`📡 REST API Status:  http://localhost:${PORT}/api/stats`);
  console.log(`=============================================================\n`);
});
