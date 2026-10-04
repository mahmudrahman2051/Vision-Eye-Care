import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineMagnifyingGlass,
  HiOutlineBars3,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

const navCategories = [
  { to: '/shop?category=eyeglasses', label: 'Glasses' },
  { to: '/shop?category=sunglasses', label: 'Sunglasses' },
  { to: '/shop?search=Contact+Lenses', label: 'Contact Lenses' },
  { to: '/shop?search=Eyeglass+Cases', label: 'Eyeglass Cases' },
  { to: '/shop?search=Lens+Cleaning', label: 'Cleaning Solutions' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const cartCount = 0;
  const wishlistCount = 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileOpen(false);
    await logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <div className="w-full font-sans sticky top-0 z-50">
      <header className="bg-white border-b border-[#F5EFE3] shadow-sm" id="main-navbar">
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" id="logo-link">
            <img
              src="/logo.svg"
              alt="Vision Eye Care"
              className="h-7 sm:h-8 w-auto"
            />
            <div className="flex flex-col leading-none font-logo">
              <span className="font-bold text-sm sm:text-base text-[#1A1A1A] tracking-tight">
                VISION EYE CARE
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#8B7355] font-medium tracking-widest uppercase">
                Bangladesh
              </span>
            </div>
          </Link>

          {/* Desktop Search (Hidden on Mobile) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-md items-center mx-6"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search glasses, sunglasses, lenses..."
                className="w-full bg-[#F5EFE3]/50 text-[#1A1A1A] text-sm rounded-full py-2.5 pl-4 pr-10 border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355] focus:bg-white focus:ring-1 focus:ring-[#8B7355]/20 transition-all placeholder:text-[#999]"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white rounded-full transition-colors cursor-pointer"
                aria-label="Search"
              >
                <HiOutlineMagnifyingGlass className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Desktop Action Icons */}
          <div className="hidden lg:flex items-center gap-2 text-[#1A1A1A] flex-shrink-0">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`relative p-2 rounded-full transition-colors ${
                location.pathname === '/wishlist'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'hover:bg-[#F5EFE3] text-[#1A1A1A]'
              }`}
              aria-label="Wishlist"
            >
              <HiOutlineHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#8B7355] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`p-1 flex items-center gap-2 rounded-full px-2.5 py-1 transition-all border ${
                    userDropdownOpen
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'hover:bg-[#F5EFE3] text-[#1A1A1A] border-transparent'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                    userDropdownOpen ? 'bg-white text-[#1A1A1A]' : 'bg-[#1A1A1A] text-white'
                  }`}>
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-bold">{user?.full_name?.split(' ')[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E8DFD0] rounded-xl shadow-xl py-2 z-50 animate-fadeIn text-sm">
                    <div className="px-4 py-2 border-b border-[#F5EFE3]">
                      <p className="font-bold text-[#1A1A1A] truncate">{user?.full_name}</p>
                      <p className="text-xs text-[#888] truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className={`block px-4 py-2.5 transition-colors font-medium ${
                        location.pathname === '/account'
                          ? 'bg-[#F5EFE3] text-[#1A1A1A] font-bold'
                          : 'text-[#333] hover:bg-[#F5EFE3]/60 hover:text-[#8B7355]'
                      }`}
                    >
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className={`block px-4 py-2.5 transition-colors font-semibold ${
                          location.pathname.startsWith('/admin')
                            ? 'bg-[#8B7355] text-white font-bold'
                            : 'text-[#8B7355] hover:bg-[#F5EFE3]'
                        }`}
                      >
                        Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-red-600 font-bold hover:bg-red-50 border-t border-[#F5EFE3] mt-1 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`p-2 rounded-full transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/login'
                    ? 'bg-[#1A1A1A] text-white px-3'
                    : 'hover:bg-[#F5EFE3] text-[#1A1A1A]'
                }`}
                aria-label="Sign In"
              >
                <HiOutlineUser size={20} />
                <span className="text-sm font-bold">Sign In</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative p-2 rounded-full transition-colors ${
                location.pathname === '/cart'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'hover:bg-[#F5EFE3] text-[#1A1A1A]'
              }`}
              aria-label="Cart"
            >
              <HiOutlineShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#8B7355] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Header Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 font-bold text-xs ${
                mobileOpen
                  ? 'bg-[#1A1A1A] text-white shadow-md'
                  : 'bg-[#F5EFE3] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              <span>{mobileOpen ? 'Close' : 'Menu'}</span>
              {mobileOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop Category Bar */}
        <div className="hidden lg:block border-t border-[#F5EFE3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-8 py-2.5">
              {navCategories.map((cat) => (
                <NavLink
                  key={cat.label}
                  to={cat.to}
                  className={({ isActive }) =>
                    `text-sm font-bold py-1 px-3 rounded-full transition-all relative group ${
                      isActive || location.search.includes(encodeURIComponent(cat.label))
                        ? 'bg-[#F5EFE3] text-[#1A1A1A] shadow-2xs'
                        : 'text-[#555] hover:text-[#1A1A1A] hover:bg-[#F5EFE3]/50'
                    }`
                  }
                >
                  {cat.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Complete Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-[#F5EFE3] px-4 py-5 shadow-2xl animate-fadeIn space-y-5">

            {/* 1. Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search glasses, sunglasses, lenses..."
                className="w-full bg-[#F5EFE3]/60 text-[#1A1A1A] text-sm rounded-full py-2.5 pl-4 pr-11 border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-[#1A1A1A] hover:bg-[#8B7355] text-white rounded-full transition-colors">
                <HiOutlineMagnifyingGlass className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* 2. Quick Action Buttons Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {/* Wishlist Button */}
              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all relative ${
                  location.pathname === '/wishlist'
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                    : 'bg-[#F5EFE3]/50 hover:bg-[#F5EFE3] text-[#1A1A1A] border-[#E8DFD0]'
                }`}
              >
                <div className="relative mb-1">
                  <HiOutlineHeart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#8B7355] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold">Wishlist</span>
              </Link>

              {/* Cart Button */}
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all relative ${
                  location.pathname === '/cart'
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                    : 'bg-[#F5EFE3]/50 hover:bg-[#F5EFE3] text-[#1A1A1A] border-[#E8DFD0]'
                }`}
              >
                <div className="relative mb-1">
                  <HiOutlineShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#8B7355] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold">Cart</span>
              </Link>

              {/* Account / Sign In Button */}
              {isAuthenticated ? (
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all ${
                    location.pathname.startsWith('/account')
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                      : 'bg-[#F5EFE3]/50 hover:bg-[#F5EFE3] text-[#1A1A1A] border-[#E8DFD0]'
                  }`}
                >
                  <HiOutlineUser size={20} className="mb-1" />
                  <span className="text-xs font-bold truncate max-w-full">Account</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all ${
                    location.pathname === '/login'
                      ? 'bg-[#8B7355] text-white border-[#8B7355] shadow-md'
                      : 'bg-[#1A1A1A] hover:bg-[#8B7355] text-white border-[#1A1A1A]'
                  }`}
                >
                  <HiOutlineUser size={20} className="mb-1" />
                  <span className="text-xs font-bold">Sign In</span>
                </Link>
              )}
            </div>

            {/* Account Extra Options if Authenticated */}
            {isAuthenticated && (
              <div className="bg-[#F5EFE3]/50 rounded-xl p-3.5 border border-[#E8DFD0] text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DFD0]">
                  <div>
                    <p className="font-bold text-[#1A1A1A]">{user?.full_name}</p>
                    <p className="text-[11px] text-[#777]">{user?.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="px-2.5 py-1 bg-[#8B7355] text-white font-bold rounded-lg text-[10px] uppercase tracking-wider"
                    >
                      Admin
                    </Link>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left font-bold text-red-600 pt-1 hover:underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}

            {/* 3. Category Navigation Links */}
            <div>
              <p className="text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2.5">
                Categories
              </p>
              <nav className="grid grid-cols-1 gap-1.5">
                {navCategories.map((cat) => (
                  <NavLink
                    key={cat.label}
                    to={cat.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between text-sm font-bold py-2.5 px-3.5 rounded-xl transition-all border ${
                        isActive
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                          : 'text-[#333] hover:text-[#1A1A1A] hover:bg-[#F5EFE3] border-[#F5EFE3]'
                      }`
                    }
                  >
                    <span>{cat.label}</span>
                    <span className="text-xs opacity-70">→</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
