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
import './Navbar.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const cartCount = 0; // Will be connected to CartContext later
  const wishlistCount = 0; // Will be connected to WishlistContext later

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="navbar" id="main-navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="logo-link">
          <span className="logo-icon">👓</span>
          <span className="logo-text">
            Vision<span className="logo-accent">Eye Care</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links" id="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `nav-link text-[#DFFF00] font-semibold ${isActive ? 'nav-link-active' : ''}`
              }
            >
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Search Toggle */}
          <button
            className="nav-action-btn"
            id="search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            <HiOutlineMagnifyingGlass size={20} />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="nav-action-btn" id="wishlist-link" aria-label="Wishlist">
            <HiOutlineHeart size={20} />
            {wishlistCount > 0 && (
              <span className="action-badge">{wishlistCount}</span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="nav-action-btn" id="cart-link" aria-label="Cart">
            <HiOutlineShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="action-badge">{cartCount}</span>
            )}
          </Link>

          {/* Account Menu */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="nav-action-btn flex items-center gap-1.5 focus:outline-none"
                id="user-menu-btn"
              >
                <div className="w-7 h-7 rounded-full bg-[#DFFF00] text-black font-extrabold flex items-center justify-center text-xs">
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0B0B0B] border border-[#292929] rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
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
            <Link to="/login" className="nav-action-btn" id="account-link" aria-label="Account">
              <HiOutlineUser size={20} />
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className="nav-action-btn mobile-toggle"
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiOutlineXMark size={22} /> : <HiOutlineBars3 size={22} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`search-bar ${searchOpen ? 'search-bar-open' : ''}`}>
        <form onSubmit={handleSearch} className="search-form container">
          <HiOutlineMagnifyingGlass size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search for eyewear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            id="search-input"
            autoFocus={searchOpen}
          />
          <button type="submit" className="btn btn-primary btn-sm" id="search-submit">
            Search
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'mobile-menu-open' : ''}`} id="mobile-menu">
        <nav className="mobile-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
              }
              end={link.to === '/'}
              onClick={closeMobile}
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className="mobile-nav-link text-[#DFFF00]" onClick={closeMobile}>
              Admin Dashboard
            </NavLink>
          )}
          <div className="mobile-nav-divider" />
          <NavLink to="/wishlist" className="mobile-nav-link" onClick={closeMobile}>
            Wishlist
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/account" className="mobile-nav-link" onClick={closeMobile}>
                My Account ({user?.full_name})
              </NavLink>
              <button
                onClick={() => {
                  closeMobile();
                  handleLogout();
                }}
                className="mobile-nav-link text-red-400 text-left w-full"
              >
                Sign Out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="mobile-nav-link" onClick={closeMobile}>
              Sign In / Register
            </NavLink>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={closeMobile} aria-hidden="true" />
      )}
    </header>
  );
}
