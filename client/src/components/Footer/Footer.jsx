import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin } from 'react-icons/hi2';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube, FaTiktok } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import contactService from '../../services/contactService';
import { useSettings } from '../../context/SettingsContext';

const informationLinks = [
  { to: '/shop', label: 'All Eyewear' },
  { to: '/account/orders', label: 'Track Your Order' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/faq', label: 'Lens Guide & FAQ' },
];

const policyLinks = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Refund Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/faq', label: 'Shipping Policy' },
  { to: '/terms', label: 'Warranty & Guarantee' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      const res = await contactService.subscribeNewsletter(email);
      if (res.status === 'success') {
        toast.success(res.message || 'Subscribed successfully!');
        setEmail('');
        setName('');
        setComment('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200 pt-14 pb-10" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Minimalist Brand Bar & Editorial Inquiry Form (Matching Reference) */}
        <div className="pb-12 mb-12 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <h3 className="font-extrabold text-lg sm:text-2xl text-black tracking-tighter uppercase font-logo">
                VISION EYE CARE
              </h3>
              <p className="text-[11px] text-neutral-500 uppercase tracking-widest mt-1">
                BEYOND THE FRAME • BANGLADESH
              </p>
            </div>
            <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
              Stay informed with our latest handcrafted acetate & titanium releases, private preview invitations, and seasonal drops.
            </p>
          </div>

          {/* Clean Editorial Form */}
          <form onSubmit={handleSubscribe} className="space-y-3 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full bg-transparent border border-neutral-300 focus:border-black text-xs text-black px-3.5 py-2.5 rounded-none outline-none placeholder:text-neutral-400 transition-colors"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email *"
                className="w-full bg-transparent border border-neutral-300 focus:border-black text-xs text-black px-3.5 py-2.5 rounded-none outline-none placeholder:text-neutral-400 transition-colors"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Phone number or note (optional)"
                className="flex-1 w-full bg-transparent border border-neutral-300 focus:border-black text-xs text-black px-3.5 py-2.5 rounded-none outline-none placeholder:text-neutral-400 transition-colors"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="w-full sm:w-auto px-8 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest rounded-none transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
              >
                {subscribing ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>

        {/* 3 Column Layout matching reference: INFORMATION | POLICIES | CONTACT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-neutral-200">
          {/* Column 1: INFORMATION */}
          <div>
            <h4 className="text-xs font-extrabold text-black uppercase tracking-widest mb-4">
              INFORMATION
            </h4>
            <ul className="space-y-2.5">
              {informationLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs text-neutral-600 hover:text-black transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: POLICIES */}
          <div>
            <h4 className="text-xs font-extrabold text-black uppercase tracking-widest mb-4">
              POLICIES
            </h4>
            <ul className="space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs text-neutral-600 hover:text-black transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: CONTACT */}
          <div>
            <h4 className="text-xs font-extrabold text-black uppercase tracking-widest mb-4">
              CONTACT
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black">Phone:</span>
                <a href={`tel:${settings?.hotlinePhone || '+8809612888999'}`} className="hover:text-black transition-colors">
                  {settings?.hotlinePhone || '+880 9612-888999'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black">Email:</span>
                <a href={`mailto:${settings?.supportEmail || 'care@visioneyecare.com.bd'}`} className="hover:text-black transition-colors">
                  {settings?.supportEmail || 'care@visioneyecare.com.bd'}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-black flex-shrink-0">Address:</span>
                <span className="whitespace-pre-line">
                  {settings?.showroomAddress || 'House 45, Road 11, Block D, Banani, Dhaka-1213, Bangladesh'}
                </span>
              </div>

              {/* Social Media Links */}
              <div className="pt-3">
                <span className="font-semibold text-black block mb-2">Connect:</span>
                <div className="flex items-center gap-2">
                  {settings?.socialLinks?.facebook && (
                    <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 border border-neutral-300 hover:border-black hover:bg-black hover:text-white rounded-none flex items-center justify-center text-neutral-700 transition-colors" aria-label="Facebook">
                      <FaFacebookF size={12} />
                    </a>
                  )}
                  {settings?.socialLinks?.instagram && (
                    <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 border border-neutral-300 hover:border-black hover:bg-black hover:text-white rounded-none flex items-center justify-center text-neutral-700 transition-colors" aria-label="Instagram">
                      <FaInstagram size={12} />
                    </a>
                  )}
                  {settings?.socialLinks?.whatsapp && (
                    <a href={settings.socialLinks.whatsapp} target="_blank" rel="noreferrer" className="w-8 h-8 border border-neutral-300 hover:border-black hover:bg-black hover:text-white rounded-none flex items-center justify-center text-neutral-700 transition-colors" aria-label="WhatsApp">
                      <FaWhatsapp size={12} />
                    </a>
                  )}
                  {settings?.socialLinks?.youtube && (
                    <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 border border-neutral-300 hover:border-black hover:bg-black hover:text-white rounded-none flex items-center justify-center text-neutral-700 transition-colors" aria-label="YouTube">
                      <FaYoutube size={12} />
                    </a>
                  )}
                  {settings?.socialLinks?.tiktok && (
                    <a href={settings.socialLinks.tiktok} target="_blank" rel="noreferrer" className="w-8 h-8 border border-neutral-300 hover:border-black hover:bg-black hover:text-white rounded-none flex items-center justify-center text-neutral-700 transition-colors" aria-label="TikTok">
                      <FaTiktok size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Partners Monochrome Badges */}
        <div className="py-6 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-black uppercase tracking-wider text-[10px]">Payment:</span>
            {['bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard', 'COD'].map((m) => (
              <span key={m} className="px-2 py-0.5 border border-neutral-300 text-neutral-700 font-medium text-[10px]">
                {m}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-black uppercase tracking-wider text-[10px]">Delivery:</span>
            {['Pathao', 'Steadfast', 'RedX', 'Sundarban'].map((d) => (
              <span key={d} className="px-2 py-0.5 border border-neutral-300 text-neutral-700 font-medium text-[10px]">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Minimalist Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
          <p>© {currentYear} Vision Eye Care. All rights reserved.</p>
          <p className="text-[11px] uppercase tracking-widest text-neutral-400">Powered by Vision Eye Care Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
