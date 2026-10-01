import React, { useState } from 'react';
import { FiX, FiTag } from 'react-icons/fi';

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#0B0B0B] border-b border-[#292929] text-xs text-gray-300 py-2.5 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center justify-center gap-2 w-full text-center">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#DFFF00] text-black font-extrabold text-[10px] uppercase tracking-wider">
            <FiTag className="w-3 h-3" /> Offer
          </span>
          <p className="truncate font-medium">
            <span className="text-white font-semibold">New Season Styles</span> — Discover Your Perfect Pair with Free Shipping & 30-Day Guarantee
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-500 hover:text-white transition-colors p-1"
          aria-label="Close Announcement"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
