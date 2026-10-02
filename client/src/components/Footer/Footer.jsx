import { Link } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin } from 'react-icons/hi2';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube, FaTiktok } from 'react-icons/fa6';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About Us' },
  { to: '/faq', label: 'FAQ' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
];

const customerCareLinks = [
  { to: '/about', label: 'Track Your Order' },
  { to: '/about', label: 'Return & Refund Policy' },
  { to: '/about', label: 'Shipping Information' },
  { to: '/faq', label: 'Help & Support' },
  { to: '/about', label: 'Size Guide' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-[#AAAAAA] pt-14 pb-8" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-[#2D2D2D]">

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-[#888] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Customer Care</h4>
            <ul className="space-y-2.5">
              {customerCareLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-[#888] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <HiOutlineMapPin className="w-4 h-4 text-[#8B7355] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#888]">
                  House 45, Road 11, Block D,<br />Banani, Dhaka-1213, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiOutlinePhone className="w-4 h-4 text-[#8B7355] flex-shrink-0" />
                <a href="tel:+8809612888999" className="text-sm text-[#888] hover:text-white transition-colors">
                  +880 9612-888999
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <FaWhatsapp className="w-4 h-4 text-[#8B7355] flex-shrink-0" />
                <a href="https://wa.me/8801711000000" className="text-sm text-[#888] hover:text-white transition-colors">
                  +880 1711-000000
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <HiOutlineEnvelope className="w-4 h-4 text-[#8B7355] flex-shrink-0" />
                <a href="mailto:support@visioneyecare.com.bd" className="text-sm text-[#888] hover:text-white transition-colors">
                  support@visioneyecare.com.bd
                </a>
              </div>
            </div>
          </div>

          {/* Social Media + Payment + Delivery */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex items-center gap-2.5 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-[#2D2D2D] hover:bg-[#8B7355] rounded-lg flex items-center justify-center text-[#888] hover:text-white transition-all" aria-label="Facebook">
                <FaFacebookF size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-[#2D2D2D] hover:bg-[#8B7355] rounded-lg flex items-center justify-center text-[#888] hover:text-white transition-all" aria-label="Instagram">
                <FaInstagram size={14} />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-[#2D2D2D] hover:bg-[#8B7355] rounded-lg flex items-center justify-center text-[#888] hover:text-white transition-all" aria-label="WhatsApp">
                <FaWhatsapp size={14} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-[#2D2D2D] hover:bg-[#8B7355] rounded-lg flex items-center justify-center text-[#888] hover:text-white transition-all" aria-label="YouTube">
                <FaYoutube size={14} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-[#2D2D2D] hover:bg-[#8B7355] rounded-lg flex items-center justify-center text-[#888] hover:text-white transition-all" aria-label="TikTok">
                <FaTiktok size={14} />
              </a>
            </div>

            {/* Payment Methods */}
            <h4 className="text-sm font-semibold text-white mb-3">Payment Methods</h4>
            <div className="flex flex-wrap gap-2 mb-5">
              {['bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard', 'COD'].map(m => (
                <span key={m} className="px-2.5 py-1 bg-[#2D2D2D] text-[#AAA] text-xs font-medium rounded border border-[#3A3A3A]">
                  {m}
                </span>
              ))}
            </div>

            {/* Delivery Partners */}
            <h4 className="text-sm font-semibold text-white mb-3">Delivery Partners</h4>
            <div className="flex flex-wrap gap-2">
              {['Pathao', 'Steadfast', 'RedX', 'Sundarban'].map(d => (
                <span key={d} className="px-2.5 py-1 bg-[#2D2D2D] text-[#AAA] text-xs font-medium rounded border border-[#3A3A3A]">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 text-center">
          <p className="text-sm text-[#666]">
            © {currentYear} Vision Eye Care Bangladesh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
