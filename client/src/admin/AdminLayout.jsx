import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiFolder,
  FiTag,
  FiStar,
  FiSliders,
  FiLogOut,
  FiArrowLeft,
  FiMenu,
  FiX,
  FiShield,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { to: '/admin/products', label: 'Products', icon: FiShoppingBag },
  { to: '/admin/orders', label: 'Orders', icon: FiPackage },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/categories', label: 'Categories', icon: FiFolder },
  { to: '/admin/coupons', label: 'Coupons', icon: FiTag },
  { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
  { to: '/admin/ticker', label: 'Marquee Ticker', icon: FiSliders },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isCurrentActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#1A1A1A] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#1A1A1A] text-white p-4 flex items-center justify-between border-b border-[#333]">
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-wider text-sm">DRISHTI ATELIER</span>
          <span className="text-[9px] font-bold bg-[#8B7355] px-1.5 py-0.5 rounded uppercase">Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white hover:text-[#8B7355]"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#1A1A1A] text-white flex flex-col justify-between p-5 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand */}
          <div className="pb-5 border-b border-[#2D2D2D]">
            <Link to="/admin" className="block">
              <span className="font-black text-lg tracking-wider text-white">DRISHTI</span>
              <span className="text-[10px] block font-bold text-[#8B7355] tracking-widest uppercase mt-0.5">
                Management Console
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isCurrentActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#8B7355] text-white shadow-sm'
                      : 'text-[#AAA] hover:bg-[#2D2D2D] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Account Actions */}
        <div className="pt-4 border-t border-[#2D2D2D] space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-[#AAA] hover:text-white hover:bg-[#2D2D2D] rounded-xl font-bold transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> Return to Store
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl font-bold transition-colors cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" /> Sign Out
          </button>

          <div className="pt-2 text-[10px] text-[#666] truncate">
            Logged in as: <span className="text-[#888] font-bold">{user?.email}</span>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 overflow-x-hidden min-h-screen p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
