import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineMagnifyingGlass,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import AnnouncementBar from './AnnouncementBar';
import MegaMenu from './MegaMenu';
import SearchOverlay from './SearchOverlay';
import './Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const cartCount = 0; // Connected in Phase 5
  const wishlistCount = 0; // Connected in Phase 5

  // Close user dropdown on outside click
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
    await logout();
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Announcement Bar */}
      <AnnouncementBar />

      <header className="navbar sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-[#292929]" id="main-navbar">
        <div className="navbar-inner container relative flex items-center justify-between py-4">
          {/* Brand Logo */}
          <Link to="/" className="navbar-logo flex items-center gap-2 text-xl font-extrabold tracking-tight text-white" id="logo-link">
            <span className="text-2xl">👓</span>
            <span className="logo-text">
              Vision<span className="text-[#DFFF00]"> Eye Care</span>
            </span>
          </Link>

          {/* Desktop Navigation Links with MegaMenu support */}
          <nav className="hidden lg:flex items-center gap-8 font-bold text-xs uppercase tracking-wider text-gray-300" id="desktop-nav">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-[#DFFF00]' : 'hover:text-white transition-colors')} end>
              Home
            </NavLink>
            <div
              className="relative py-2 cursor-pointer"
              onMouseEnter={() => setActiveMegaMenu('eyeglasses')}
            >
              <NavLink to="/shop?category=eyeglasses" className="hover:text-white transition-colors">
                Eyeglasses
              </NavLink>
            </div>
            <div
              className="relative py-2 cursor-pointer"
              onMouseEnter={() => setActiveMegaMenu('sunglasses')}
            >
              <NavLink to="/shop?category=sunglasses" className="hover:text-white transition-colors">
                Sunglasses
              </NavLink>
            </div>
            <NavLink to="/shop?search=Designer" className="hover:text-white transition-colors">
              Brands
            </NavLink>
            <NavLink to="/shop?sort=newest" className="hover:text-white transition-colors">
              New Arrivals
            </NavLink>
            <NavLink to="/shop?search=Blue+Light" className="hover:text-white transition-colors">
              Lenses
            </NavLink>
            <NavLink to="/about" className="hover:text-white transition-colors">
              Services
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className="text-[#DFFF00] font-extrabold hover:underline">
                Admin
              </NavLink>
            )}
          </nav>

          {/* Actions Bar (Search, Wishlist, Cart, User) */}
          <div className="navbar-actions flex items-center gap-4 text-gray-300">
            {/* Search Trigger */}
            <button
              className="nav-action-btn p-2 hover:text-[#DFFF00] transition-colors"
              id="search-toggle"
              onClick={() => setSearchOpen(true)}
              aria-label="Toggle search"
            >
              <HiOutlineMagnifyingGlass size={22} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="nav-action-btn relative p-2 hover:text-[#DFFF00] transition-colors" id="wishlist-link" aria-label="Wishlist">
              <HiOutlineHeart size={22} />
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="nav-action-btn relative p-2 hover:text-[#DFFF00] transition-colors" id="cart-link" aria-label="Cart">
              <HiOutlineShoppingBag size={22} />
              {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
            </Link>

            {/* User Profile */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 focus:outline-none"
                  id="user-menu-btn"
                >
                  <div className="w-8 h-8 rounded-full bg-[#DFFF00] text-black font-extrabold flex items-center justify-center text-xs shadow-md">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#0B0B0B] border border-[#292929] rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-[#292929]">
                      <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-[#171717] text-[#DFFF00] border border-[#292929]">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-[#171717] hover:text-[#DFFF00] transition-colors"
                    >
                      <HiOutlineUser size={15} /> My Account
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#DFFF00] hover:bg-[#171717] transition-colors"
                      >
                        <HiOutlineCog6Tooth size={15} /> Admin Portal
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-[#171717] hover:text-red-300 transition-colors text-left border-t border-[#292929] mt-1"
                    >
                      <HiOutlineArrowRightOnRectangle size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-action-btn p-2 hover:text-[#DFFF00] transition-colors" id="account-link" aria-label="Account">
                <HiOutlineUser size={22} />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-300 hover:text-white"
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiOutlineXMark size={24} /> : <HiOutlineBars3 size={24} />}
            </button>
          </div>

          {/* Mega Menu Dropdown */}
          <MegaMenu activeMenu={activeMegaMenu} onClose={() => setActiveMegaMenu(null)} />
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0B0B0B] border-t border-[#292929] px-6 py-6 space-y-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3 text-sm font-bold text-gray-300">
              <NavLink to="/" onClick={closeMobile} className="hover:text-[#DFFF00]">Home</NavLink>
              <NavLink to="/shop?category=eyeglasses" onClick={closeMobile} className="hover:text-[#DFFF00]">Eyeglasses</NavLink>
              <NavLink to="/shop?category=sunglasses" onClick={closeMobile} className="hover:text-[#DFFF00]">Sunglasses</NavLink>
              <NavLink to="/shop?search=Designer" onClick={closeMobile} className="hover:text-[#DFFF00]">Brands</NavLink>
              <NavLink to="/shop?sort=newest" onClick={closeMobile} className="hover:text-[#DFFF00]">New Arrivals</NavLink>
              <NavLink to="/shop?search=Blue+Light" onClick={closeMobile} className="hover:text-[#DFFF00]">Lenses</NavLink>
              <NavLink to="/about" onClick={closeMobile} className="hover:text-[#DFFF00]">Services</NavLink>
              {isAdmin && <NavLink to="/admin" onClick={closeMobile} className="text-[#DFFF00]">Admin Dashboard</NavLink>}
            </nav>
          </div>
        )}
      </header>

      {/* Instant Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
