import React from 'react';

export default function Navbar({ activeMode, setActiveMode, onOpenLookup, onOpenNewBooking }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Hotel Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveMode('guest')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-amber-500/20">
              🏨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury font-bold text-xl tracking-wide bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                  Grand Azure
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  5★ Luxury
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Hotel & Suites Management</p>
            </div>
          </div>

          {/* Center Navigation (Guest View) */}
          {activeMode === 'guest' && (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#rooms" className="hover:text-amber-400 transition-colors">Our Suites</a>
              <a href="#amenities" className="hover:text-amber-400 transition-colors">Amenities</a>
              <a href="#experience" className="hover:text-amber-400 transition-colors">Experience</a>
              <button 
                onClick={onOpenLookup}
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
              >
                <span>🔍</span> Find My Reservation
              </button>
            </nav>
          )}

          {/* Right Action buttons & Portal Switcher */}
          <div className="flex items-center gap-3">
            {activeMode === 'guest' ? (
              <>
                <button
                  onClick={onOpenLookup}
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
                >
                  <span>📋</span> Track Booking
                </button>
                <button
                  onClick={() => setActiveMode('admin')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/25 transition transform active:scale-95"
                >
                  <span>🛡️</span> Staff / Admin Portal
                </button>
              </>
            ) : (
              <>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Admin System
                </span>
                <button
                  onClick={() => setActiveMode('guest')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition transform active:scale-95"
                >
                  <span>←</span> Return to Guest View
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
