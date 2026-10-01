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
    await logout();
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200" id="main-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Glasses.com Style Logo */}
          <Link to="/" className="flex items-center gap-1 text-lg sm:text-xl font-extrabold tracking-[0.2em] text-black uppercase" id="logo-link">
            <span>VISION</span>
            <span className="text-[#5B649E]">•</span>
            <span>EYE CARE</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7 font-bold text-xs text-gray-800 tracking-wide" id="desktop-nav">
            <NavLink to="/shop?category=eyeglasses" className="hover:text-[#5B649E] transition-colors" onMouseEnter={() => setActiveMegaMenu('eyeglasses')}>
              Eyeglasses
            </NavLink>
            <NavLink to="/shop?category=sunglasses" className="hover:text-[#5B649E] transition-colors" onMouseEnter={() => setActiveMegaMenu('sunglasses')}>
              Sunglasses
            </NavLink>
            <NavLink to="/shop?search=Brands" className="hover:text-[#5B649E] transition-colors">
              Brands
            </NavLink>
            <NavLink to="/shop?sort=popular" className="hover:text-[#5B649E] transition-colors">
              Offers
            </NavLink>
            <NavLink to="/about" className="hover:text-[#5B649E] transition-colors">
              Services
            </NavLink>
            <NavLink to="/shop?search=Lenses" className="hover:text-[#5B649E] transition-colors">
              Lenses
            </NavLink>
            <NavLink to="/about" className="hover:text-[#5B649E] transition-colors">
              Sync Insurance
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className="text-[#5B649E] font-black uppercase">
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right Utilities (Search Pill, Heart, User, Cart) */}
          <div className="flex items-center gap-4 text-gray-700">
            {/* Search Pill Input */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-[#F3F4F6] hover:bg-gray-200 text-gray-500 rounded-full px-4 py-1.5 text-xs font-medium w-44 transition-colors"
            >
              <HiOutlineMagnifyingGlass size={16} className="text-gray-600" />
              <span>Search</span>
            </button>

            {/* Mobile Search Icon */}
            <button
              className="sm:hidden p-1.5 hover:text-black"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <HiOutlineMagnifyingGlass size={22} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-1.5 hover:text-black transition-colors" aria-label="Wishlist">
              <HiOutlineHeart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5B649E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-1 flex items-center justify-center focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-[#5B649E] text-white font-black text-xs flex items-center justify-center shadow">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-black truncate">{user?.full_name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/account" onClick={() => setUserDropdownOpen(false)} className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserDropdownOpen(false)} className="block px-4 py-2 text-xs text-[#5B649E] font-bold hover:bg-gray-50">
                        Admin Portal
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-50 border-t border-gray-100 mt-1">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-1.5 hover:text-black transition-colors" aria-label="Account">
                <HiOutlineUser size={22} />
              </Link>
            )}

            {/* Shopping Cart */}
            <Link to="/cart" className="relative p-1.5 hover:text-black transition-colors" aria-label="Cart">
              <HiOutlineShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5B649E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Toggle */}
            <button
              className="xl:hidden p-1.5 text-gray-700 hover:text-black"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiOutlineXMark size={24} /> : <HiOutlineBars3 size={24} />}
            </button>
          </div>

          <MegaMenu activeMenu={activeMegaMenu} onClose={() => setActiveMegaMenu(null)} />
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="xl:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3">
            <nav className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-wider text-gray-800">
              <NavLink to="/shop?category=eyeglasses" onClick={closeMobile}>Eyeglasses</NavLink>
              <NavLink to="/shop?category=sunglasses" onClick={closeMobile}>Sunglasses</NavLink>
              <NavLink to="/shop?search=Brands" onClick={closeMobile}>Brands</NavLink>
              <NavLink to="/shop?sort=popular" onClick={closeMobile}>Offers</NavLink>
              <NavLink to="/about" onClick={closeMobile}>Services</NavLink>
              <NavLink to="/shop?search=Lenses" onClick={closeMobile}>Lenses</NavLink>
              <NavLink to="/about" onClick={closeMobile}>Sync Insurance</NavLink>
            </nav>
          </div>
        )}
      </header>

      {/* Top Lavender Banner */}
      <AnnouncementBar />

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
