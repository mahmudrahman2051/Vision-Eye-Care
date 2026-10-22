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
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import MarqueeTicker from '../MarqueeTicker/MarqueeTicker';
import CouponMarqueeTicker from '../MarqueeTicker/CouponMarqueeTicker';

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
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Scroll listener for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route changes
  useEffect(() => {
    setDesktopSearchOpen(false);
    setMobileOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Autofocus input when slide-down search opens
  useEffect(() => {
    if (desktopSearchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [desktopSearchOpen]);

  // Keyboard shortcut listener: Ctrl+K / Cmd+K to toggle, Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setDesktopSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape' && desktopSearchOpen) {
        setDesktopSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [desktopSearchOpen]);

  // Click outside to close user dropdown & desktop search drawer
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (
        desktopSearchOpen &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        !e.target.closest('#desktop-search-toggle-btn')
      ) {
        setDesktopSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [desktopSearchOpen]);

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
      setDesktopSearchOpen(false);
      setMobileOpen(false);
    }
  };

  const handleQuickSearch = (term) => {
    setSearchQuery(term);
    navigate(`/shop?search=${encodeURIComponent(term)}`);
    setDesktopSearchOpen(false);
    setMobileOpen(false);
  };

  // Dynamic header classes based on scroll state
  const headerClasses = scrolled
    ? 'bg-white/75 backdrop-blur-xl backdrop-saturate-150 border-b border-white/40 shadow-lg shadow-black/5'
    : 'bg-white border-b border-[#F5EFE3] shadow-sm';

  return (
    <div className="w-full font-sans sticky top-0 z-50">
      {!mobileOpen && <CouponMarqueeTicker />}
      <header
        className={`relative z-40 transition-all duration-500 ease-out ${headerClasses}`}
        id="main-navbar"
      >
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

          {/* Desktop Action Icons */}
          <div className="hidden lg:flex items-center gap-2 text-[#1A1A1A] flex-shrink-0">
            {/* Desktop Search Toggle Button */}
            <button
              id="desktop-search-toggle-btn"
              type="button"
              onClick={() => setDesktopSearchOpen(!desktopSearchOpen)}
              className={`p-2 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                desktopSearchOpen
                  ? 'bg-[#8B7355] text-white shadow-sm ring-2 ring-[#8B7355]/30'
                  : 'hover:bg-[#F5EFE3] text-[#1A1A1A]'
              }`}
              aria-label={desktopSearchOpen ? 'Close search bar' : 'Open search bar'}
              title={desktopSearchOpen ? 'Close search (Esc)' : 'Search products (Ctrl+K)'}
            >
              {desktopSearchOpen ? (
                <HiOutlineXMark size={20} />
              ) : (
                <HiOutlineMagnifyingGlass size={20} />
              )}
            </button>
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`relative p-2 rounded-full transition-all duration-200 ${
                location.pathname === '/wishlist'
                  ? 'bg-[#8B7355] text-white shadow-sm'
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
              <div className="relative z-50" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`p-1 flex items-center gap-2 rounded-full px-2.5 py-1 transition-all border ${
                    userDropdownOpen
                      ? 'bg-[#8B7355] text-white border-[#8B7355]'
                      : 'hover:bg-[#F5EFE3] text-[#1A1A1A] border-transparent'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                    userDropdownOpen ? 'bg-white text-[#8B7355]' : 'bg-[#8B7355] text-white'
                  }`}>
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-bold">{user?.full_name?.split(' ')[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E8DFD0] rounded-xl shadow-2xl py-2 z-50 animate-fadeIn text-sm">
                    <div className="px-4 py-2 border-b border-[#F5EFE3]">
                      <p className="font-bold text-[#1A1A1A] truncate">{user?.full_name}</p>
                      <p className="text-xs text-[#888] truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className={`block px-4 py-2.5 transition-colors font-medium ${
                        location.pathname === '/account'
                          ? 'bg-[#F5EFE3] text-[#8B7355] font-bold'
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
                      className="w-full text-left px-4 py-2.5 text-red-600 font-bold hover:bg-red-50 border-t border-[#F5EFE3] mt-1 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`p-2 rounded-full transition-all flex items-center gap-1.5 ${
                  location.pathname === '/login'
                    ? 'bg-[#8B7355] text-white px-3 shadow-sm'
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
              className={`relative p-2 rounded-full transition-all duration-200 ${
                location.pathname === '/cart'
                  ? 'bg-[#8B7355] text-white shadow-sm'
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

          {/* Mobile Header Action Icons & Menu Toggle */}
          <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Wishlist */}
            <Link
              to="/wishlist"
              className={`relative p-2 rounded-xl transition-all ${
                location.pathname === '/wishlist'
                  ? 'bg-[#8B7355] text-white shadow-xs'
                  : 'bg-[#F5EFE3]/70 text-[#1A1A1A] hover:bg-[#8B7355] hover:text-white'
              }`}
              aria-label="Wishlist"
            >
              <HiOutlineHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B7355] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Mobile Cart */}
            <Link
              to="/cart"
              className={`relative p-2 rounded-xl transition-all ${
                location.pathname === '/cart'
                  ? 'bg-[#8B7355] text-white shadow-xs'
                  : 'bg-[#F5EFE3]/70 text-[#1A1A1A] hover:bg-[#8B7355] hover:text-white'
              }`}
              aria-label="Cart"
            >
              <HiOutlineShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B7355] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Header Menu Toggle Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all flex items-center gap-1.5 font-bold text-xs ${
                mobileOpen
                  ? 'bg-[#8B7355] text-white shadow-md'
                  : 'bg-[#F5EFE3] hover:bg-[#8B7355] hover:text-white text-[#1A1A1A]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              <span className="hidden sm:inline">{mobileOpen ? 'Close' : 'Menu'}</span>
              {mobileOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop Slide-Down Search Drawer */}
        <div
          ref={searchContainerRef}
          className={`hidden lg:block transition-all duration-300 ease-in-out overflow-hidden border-t ${
            desktopSearchOpen
              ? 'max-h-56 opacity-100 py-3.5 bg-[#FAF7F2]/95 border-[#E8DFD0] shadow-inner'
              : 'max-h-0 opacity-0 py-0 border-transparent pointer-events-none'
          }`}
          id="desktop-slide-down-search"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-3">
              <div className="relative flex-1 flex items-center bg-white border border-[#E8DFD0] focus-within:border-[#8B7355] focus-within:ring-2 focus-within:ring-[#8B7355]/20 rounded-2xl shadow-xs transition-all">
                <div className="pl-4 text-[#8B7355] flex items-center pointer-events-none">
                  <HiOutlineMagnifyingGlass className="w-5 h-5" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search glasses, sunglasses, contact lenses, designer frames..."
                  className="w-full bg-transparent text-[#1A1A1A] text-sm py-3 pl-3 pr-20 focus:outline-none placeholder:text-[#999] font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 mr-1 text-[#888] hover:text-[#1A1A1A] rounded-full hover:bg-[#F5EFE3] transition-colors"
                    title="Clear text"
                  >
                    <HiOutlineXMark className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="mr-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                >
                  Search
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDesktopSearchOpen(false)}
                className="p-2.5 rounded-xl border border-[#E8DFD0] bg-white hover:bg-[#F5EFE3] text-[#666] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                title="Close (Esc)"
                aria-label="Close search"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </form>

            {/* Quick Search Tag Suggestions */}
            <div className="flex items-center gap-2 mt-2.5 text-xs text-[#777] flex-wrap">
              <span className="font-bold text-[10px] text-[#8B7355] uppercase tracking-wider">
                Popular:
              </span>
              {[
                'Eyeglasses',
                'Sunglasses',
                'Contact Lenses',
                'Titanium',
                'Anti-Blue Light',
                'Acetate Frames',
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickSearch(tag)}
                  className="px-2.5 py-0.5 rounded-lg bg-white border border-[#E8DFD0] text-[#555] hover:text-[#8B7355] hover:border-[#8B7355]/40 hover:bg-[#FAF7F2] transition-all text-[11px] font-medium cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Category Bar */}
        <div className="hidden lg:block border-t border-[#F5EFE3]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-8 py-2.5">
              {navCategories.map((cat) => (
                <NavLink
                  key={cat.label}
                  to={cat.to}
                  className={({ isActive }) =>
                    `text-sm font-bold py-1 px-3 rounded-full transition-all relative group ${
                      isActive || location.search.includes(encodeURIComponent(cat.label))
                        ? 'bg-[#F5EFE3] text-[#8B7355]'
                        : 'text-[#555] hover:text-[#8B7355] hover:bg-[#F5EFE3]/50'
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
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-[#F5EFE3] px-4 py-5 shadow-2xl animate-fadeIn space-y-5">

            {/* 1. Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search glasses, sunglasses, lenses..."
                className="w-full bg-[#F5EFE3]/60 text-[#1A1A1A] text-sm rounded-full py-2.5 pl-4 pr-11 border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-[#8B7355] hover:bg-[#6B5840] text-white rounded-full transition-colors cursor-pointer">
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
                    ? 'bg-[#8B7355] text-white border-[#8B7355] shadow-md'
                    : 'bg-[#F5EFE3]/50 hover:bg-[#F5EFE3] text-[#555] border-[#E8DFD0]'
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
                    ? 'bg-[#8B7355] text-white border-[#8B7355] shadow-md'
                    : 'bg-[#F5EFE3]/50 hover:bg-[#F5EFE3] text-[#555] border-[#E8DFD0]'
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
                      ? 'bg-[#8B7355] text-white border-[#8B7355] shadow-md'
                      : 'bg-[#F5EFE3]/50 hover:bg-[#F5EFE3] text-[#555] border-[#E8DFD0]'
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
                      : 'bg-[#F5EFE3] hover:bg-[#8B7355] hover:text-white text-[#1A1A1A] border-[#E8DFD0]'
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
                          ? 'bg-[#8B7355] text-white border-[#8B7355] shadow-sm'
                          : 'text-[#444] hover:text-[#8B7355] hover:bg-[#F5EFE3] border-[#E8DFD0]/70'
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
      {!mobileOpen && <MarqueeTicker />}
    </div>
  );
}
