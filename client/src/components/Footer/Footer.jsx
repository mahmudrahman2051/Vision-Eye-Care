import { Link } from 'react-router-dom';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
} from 'react-icons/hi2';
import { FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6';

const companyLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
];

const customerLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/cart', label: 'My Cart' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/account/orders', label: 'Order Tracking' },
];

const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-yellow-50/50 text-gray-900 border-t-4 border-[#DFFF00] pt-16 pb-12" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-black tracking-widest uppercase text-gray-900">
              <span>VISION</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#DFFF00] border border-yellow-400"></span>
              <span>EYE CARE</span>
            </Link>
            <p className="text-xs text-gray-600 font-medium max-w-sm leading-relaxed">
              Premium eyewear for every style. Discover your perfect pair with
              Vision Eye Care — where clarity meets fashion.
            </p>
            <div className="space-y-2 text-xs text-gray-700 font-medium">
              <div className="flex items-center gap-2">
                <HiOutlineMapPin size={16} className="text-yellow-600" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlinePhone size={16} className="text-yellow-600" />
                <span>+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineEnvelope size={16} className="text-yellow-600" />
                <span>support@visioneyecare.com</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Company</h4>
            <ul className="space-y-2 text-xs">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-600 hover:text-yellow-700 font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Customer Service</h4>
            <ul className="space-y-2 text-xs">
              {customerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-600 hover:text-yellow-700 font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Stay Updated</h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Subscribe to get the latest offers and new arrivals.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white border border-yellow-300 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                id="newsletter-email"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#DFFF00] hover:bg-yellow-400 text-gray-900 border border-yellow-500 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
                id="newsletter-subscribe"
              >
                Subscribe
              </button>
            </form>
            <div className="flex gap-2 pt-2">
              <a href="#" className="w-9 h-9 bg-white border border-yellow-300 rounded-xl flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-[#DFFF00] hover:border-yellow-400 transition-all" aria-label="Facebook">
                <FaFacebookF size={14} />
              </a>
              <a href="#" className="w-9 h-9 bg-white border border-yellow-300 rounded-xl flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-[#DFFF00] hover:border-yellow-400 transition-all" aria-label="Instagram">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="w-9 h-9 bg-white border border-yellow-300 rounded-xl flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-[#DFFF00] hover:border-yellow-400 transition-all" aria-label="X / Twitter">
                <FaXTwitter size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-yellow-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <p>© {currentYear} Vision Eye Care. All rights reserved.</p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-yellow-700 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
