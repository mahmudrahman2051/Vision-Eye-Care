import React, { useState, useEffect } from 'react';
import { FiPhoneCall, FiTruck, FiShield } from 'react-icons/fi';

const announcements = [
  { text: '🏠 FREE Home Eye Checkup & 100+ Frame Try-On in Dhaka City', badge: 'DHAKA SPECIAL' },
  { text: '⚡ Buy 1 Frame & Get 1 Free Lenses | ৳100 Cashback on bKash Payment', badge: 'EID OFFER' },
  { text: '🚚 24hr Express Shipping in Dhaka | 48hr Nationwide Courier across Bangladesh', badge: 'EXPRESS BD' },
];

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const current = announcements[index];

  return (
    <div className="bg-[#0F172A] text-white py-2 px-4 text-xs z-50 relative border-b border-slate-800 font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Call Hotline */}
        <div className="hidden md:flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
          <FiPhoneCall className="text-teal-400 w-3.5 h-3.5" />
          <span className="font-semibold">Hotline / WhatsApp:</span>
          <a href="tel:+8809612888999" className="font-bold text-amber-400 hover:underline">+880 9612-888999</a>
        </div>

        {/* Center: Dynamic Banner Ticker */}
        <div className="flex items-center justify-center gap-2 mx-auto md:mx-0 truncate">
          <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded">
            {current.badge}
          </span>
          <span className="text-slate-100 font-semibold tracking-wide truncate">
            {current.text}
          </span>
        </div>

        {/* Right Side: Trust Info */}
        <div className="hidden lg:flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1">
            <FiShield className="text-teal-400 w-3.5 h-3.5" />
            <span>100% Authentic Warranty</span>
          </span>
          <span className="flex items-center gap-1">
            <FiTruck className="text-teal-400 w-3.5 h-3.5" />
            <span>COD Available</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;

