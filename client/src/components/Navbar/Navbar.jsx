import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
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
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm sm:text-base text-[#1A1A1A] tracking-tight">
                VISION EYE CARE
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#8B7355] font-medium tracking-widest uppercase">
                Bangladesh
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md items-center"
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
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-full transition-colors"
                aria-label="Search"
              >
                <HiOutlineMagnifyingGlass className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[#1A1A1A] flex-shrink-0">
            {/* Mobile Search */}
            <button
              className="md:hidden p-2 hover:bg-[#F5EFE3] rounded-full transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <HiOutlineMagnifyingGlass size={20} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-[#F5EFE3] rounded-full transition-colors" aria-label="Wishlist">
              <HiOutlineHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#1A1A1A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-1"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white text-xs font-bold flex items-center justify-center">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E8DFD0] rounded-xl shadow-xl py-2 z-50 animate-fadeIn text-sm">
                    <div className="px-4 py-2 border-b border-[#F5EFE3]">
                      <p className="font-semibold text-[#1A1A1A] truncate">{user?.full_name}</p>
                      <p className="text-xs text-[#888] truncate">{user?.email}</p>
                    </div>
                    <Link to="/account" onClick={() => setUserDropdownOpen(false)} className="block px-4 py-2 text-[#333] hover:bg-[#F5EFE3]">
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserDropdownOpen(false)} className="block px-4 py-2 text-[#8B7355] font-semibold hover:bg-[#F5EFE3]">
                        Admin Portal
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t border-[#F5EFE3] mt-1">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-[#F5EFE3] rounded-full transition-colors flex items-center gap-1.5" aria-label="Sign In">
                <HiOutlineUser size={20} />
                <span className="hidden sm:inline text-sm font-medium">Sign In</span>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-[#F5EFE3] rounded-full transition-colors" aria-label="Cart">
              <HiOutlineShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#8B7355] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 hover:bg-[#F5EFE3] rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiOutlineXMark size={22} /> : <HiOutlineBars3 size={22} />}
            </button>
          </div>
        </div>

        {/* Desktop Category Bar */}
        <div className="hidden lg:block border-t border-[#F5EFE3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-8 py-2">
              {navCategories.map((cat) => (
                <NavLink
                  key={cat.label}
                  to={cat.to}
                  className="text-sm font-medium text-[#555] hover:text-[#1A1A1A] transition-colors py-1"
                >
                  {cat.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 border-t border-[#F5EFE3] bg-white animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative mt-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-[#F5EFE3]/50 text-sm rounded-full py-2.5 pl-4 pr-10 border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                autoFocus
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#1A1A1A] text-white rounded-full">
                <HiOutlineMagnifyingGlass className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-[#F5EFE3] px-6 py-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3">
              {navCategories.map((cat) => (
                <NavLink
                  key={cat.label}
                  to={cat.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-[#555] hover:text-[#1A1A1A] py-1 border-b border-[#F5EFE3] last:border-0 pb-3 last:pb-0"
                >
                  {cat.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
