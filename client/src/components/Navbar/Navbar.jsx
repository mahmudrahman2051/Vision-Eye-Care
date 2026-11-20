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

  // Scroll listener for subtle header elevation
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

  // Modern crisp header classes
  const headerClasses = scrolled
    ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm'
    : 'bg-white border-b border-neutral-200';

  return (
    <div className="w-full font-sans sticky top-0 z-50">
      {!mobileOpen && <CouponMarqueeTicker />}
      <header
        className={`relative z-40 transition-all duration-300 ease-out ${headerClasses}`}
        id="main-navbar"
      >
        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">

          {/* Minimalist Bold Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" id="logo-link">
            <img
              src="/logo.svg"
              alt="Vision Eye Care"
              className="h-7 sm:h-8 w-auto"
            />
            <div className="flex flex-col leading-none font-logo">
              <span className="font-extrabold text-sm sm:text-base text-black tracking-tight uppercase">
                VISION EYE CARE
              </span>
              <span className="text-[9px] text-neutral-400 font-bold tracking-widest uppercase">
                Bangladesh
              </span>
            </div>
          </Link>

          {/* Desktop Category Navigation Links (Single Row Center) */}
          <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-3 mx-4 flex-1">
            {navCategories.map((cat) => (
              <NavLink
                key={cat.label}
                to={cat.to}
                className={({ isActive }) =>
                  `text-xs xl:text-[13px] font-bold uppercase tracking-wider py-1.5 px-3 transition-colors whitespace-nowrap ${
                    isActive || location.search.includes(encodeURIComponent(cat.label))
                      ? 'text-black border-b-2 border-black'
                      : 'text-neutral-600 hover:text-black border-b-2 border-transparent'
                  }`
                }
              >
                {cat.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Action Icons */}
          <div className="hidden lg:flex items-center gap-2.5 text-black flex-shrink-0">
            {/* Desktop Search Toggle Button */}
            <button
              id="desktop-search-toggle-btn"
              type="button"
              onClick={() => setDesktopSearchOpen(!desktopSearchOpen)}
              className={`p-2 transition-all duration-200 flex items-center justify-center cursor-pointer ${
                desktopSearchOpen
                  ? 'bg-black text-white'
                  : 'hover:bg-neutral-100 text-black'
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
              className={`relative p-2 transition-all duration-200 ${
                location.pathname === '/wishlist'
                  ? 'bg-black text-white'
                  : 'hover:bg-neutral-100 text-black'
              }`}
              aria-label="Wishlist"
            >
              <HiOutlineHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="relative z-50" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`p-1 flex items-center gap-2 px-2.5 py-1 transition-all border ${
                    userDropdownOpen
                      ? 'bg-black text-white border-black'
                      : 'hover:bg-neutral-100 text-black border-transparent'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-none text-xs font-bold flex items-center justify-center ${
                    userDropdownOpen ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-bold tracking-tight">{user?.full_name?.split(' ')[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 shadow-xl py-2 z-50 animate-fadeIn text-sm rounded-none">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="font-bold text-black truncate">{user?.full_name}</p>
                      <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className={`block px-4 py-2.5 transition-colors font-medium ${
                        location.pathname === '/account'
                          ? 'bg-neutral-100 text-black font-bold'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                      }`}
                    >
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className={`block px-4 py-2.5 transition-colors font-bold ${
                          location.pathname.startsWith('/admin')
                            ? 'bg-black text-white'
                            : 'text-black hover:bg-neutral-100'
                        }`}
                      >
                        Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-red-600 font-bold hover:bg-red-50 border-t border-neutral-100 mt-1 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`p-2 transition-all flex items-center gap-1.5 ${
                  location.pathname === '/login'
                    ? 'bg-black text-white px-3'
                    : 'hover:bg-neutral-100 text-black'
                }`}
                aria-label="Sign In"
              >
                <HiOutlineUser size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">Sign In</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative p-2 transition-all duration-200 ${
                location.pathname === '/cart'
                  ? 'bg-black text-white'
                  : 'hover:bg-neutral-100 text-black'
              }`}
              aria-label="Cart"
            >
              <HiOutlineShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Header Action Icons & Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Wishlist */}
            <Link
              to="/wishlist"
              className={`relative p-2 transition-all ${
                location.pathname === '/wishlist'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-black'
              }`}
              aria-label="Wishlist"
            >
              <HiOutlineHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Mobile Cart */}
            <Link
              to="/cart"
              className={`relative p-2 transition-all ${
                location.pathname === '/cart'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-black'
              }`}
              aria-label="Cart"
            >
              <HiOutlineShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Header Menu Toggle Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 transition-all flex items-center gap-1.5 font-bold text-xs ${
                mobileOpen
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 hover:bg-black hover:text-white text-black'
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
              ? 'max-h-56 opacity-100 py-4 bg-white border-neutral-200 shadow-md'
              : 'max-h-0 opacity-0 py-0 border-transparent pointer-events-none'
          }`}
          id="desktop-slide-down-search"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-3">
              <div className="relative flex-1 flex items-center bg-white border border-neutral-300 focus-within:border-black rounded-none shadow-xs transition-all">
                <div className="pl-4 text-neutral-400 flex items-center pointer-events-none">
                  <HiOutlineMagnifyingGlass className="w-5 h-5" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search glasses, sunglasses, lenses, designer frames..."
                  className="w-full bg-transparent text-black text-sm py-3 pl-3 pr-20 focus:outline-none placeholder:text-neutral-400 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 mr-1 text-neutral-400 hover:text-black transition-colors"
                    title="Clear text"
                  >
                    <HiOutlineXMark className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="mr-2 px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-none uppercase tracking-widest transition-all cursor-pointer"
                >
                  Search
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDesktopSearchOpen(false)}
                className="p-2.5 border border-neutral-300 bg-white hover:bg-neutral-100 text-black transition-colors cursor-pointer"
                title="Close (Esc)"
                aria-label="Close search"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </form>

            {/* Quick Search Tag Suggestions */}
            <div className="flex items-center gap-2 mt-2.5 text-xs text-neutral-500 flex-wrap">
              <span className="font-bold text-[10px] text-black uppercase tracking-wider">
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
                  className="px-2.5 py-0.5 border border-neutral-200 text-neutral-700 hover:text-black hover:border-black bg-white transition-all text-[11px] font-medium cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Complete Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-200 px-4 py-5 shadow-2xl animate-fadeIn space-y-5">

            {/* 1. Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search glasses, sunglasses, lenses..."
                className="w-full bg-neutral-100 text-black text-sm py-2.5 pl-4 pr-11 border border-neutral-200 focus:outline-none focus:border-black focus:bg-white transition-all rounded-none"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-black hover:bg-neutral-800 text-white transition-colors cursor-pointer">
                <HiOutlineMagnifyingGlass className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* 2. Quick Action Buttons Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Wishlist Button */}
              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className={`flex flex-col items-center justify-center py-3 px-2 border transition-all relative ${
                  location.pathname === '/wishlist'
                    ? 'bg-black text-white border-black'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}
              >
                <div className="relative mb-1">
                  <HiOutlineHeart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Wishlist</span>
              </Link>

              {/* Cart Button */}
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className={`flex flex-col items-center justify-center py-3 px-2 border transition-all relative ${
                  location.pathname === '/cart'
                    ? 'bg-black text-white border-black'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}
              >
                <div className="relative mb-1">
                  <HiOutlineShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Cart</span>
              </Link>

              {/* Account / Sign In Button */}
              {isAuthenticated ? (
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className={`flex flex-col items-center justify-center py-3 px-2 border transition-all ${
                    location.pathname.startsWith('/account')
                      ? 'bg-black text-white border-black'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  <HiOutlineUser size={20} className="mb-1" />
                  <span className="text-xs font-bold uppercase tracking-wider truncate max-w-full">Account</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className={`flex flex-col items-center justify-center py-3 px-2 border transition-all ${
                    location.pathname === '/login'
                      ? 'bg-black text-white border-black'
                      : 'bg-neutral-100 hover:bg-black hover:text-white text-black border-neutral-200'
                  }`}
                >
                  <HiOutlineUser size={20} className="mb-1" />
                  <span className="text-xs font-bold uppercase tracking-wider">Sign In</span>
                </Link>
              )}
            </div>

            {/* Account Extra Options if Authenticated */}
            {isAuthenticated && (
              <div className="bg-neutral-50 p-3.5 border border-neutral-200 text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div>
                    <p className="font-bold text-black">{user?.full_name}</p>
                    <p className="text-[11px] text-neutral-500">{user?.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="px-2.5 py-1 bg-black text-white font-bold text-[10px] uppercase tracking-wider"
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
              <p className="text-[11px] font-bold text-black uppercase tracking-wider mb-2.5">
                Categories
              </p>
              <nav className="grid grid-cols-1 gap-1.5">
                {navCategories.map((cat) => (
                  <NavLink
                    key={cat.label}
                    to={cat.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between text-sm font-bold uppercase tracking-wider py-2.5 px-3.5 transition-all border ${
                        isActive
                          ? 'bg-black text-white border-black'
                          : 'text-neutral-700 hover:text-black hover:bg-neutral-100 border-neutral-200'
                      }`
                    }
                  >
                    <span>{cat.label}</span>
                    <span className="text-xs">→</span>
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
