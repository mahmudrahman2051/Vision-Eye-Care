import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import tickerService from '../../services/tickerService';

const DEFAULT_TICKER = {
  enabled: true,
  speed: 28,
  direction: 'left',
  backgroundColor: '#1A1A1A',
  textColor: '#FAF7F2',
  accentColor: '#8B7355',
  pauseOnHover: true,
  separator: '✦',
  messages: [
    {
      id: '1',
      text: 'Complimentary Nationwide Express Delivery on all orders over ৳5,000',
      badge: 'FREE SHIPPING',
      link: '/shop',
    },
    {
      id: '2',
      text: 'Custom Japanese CNC Lens Milling & Precision Anti-Reflective Coating in Dhaka',
      badge: 'PRECISION LAB',
      link: '/about',
    },
    {
      id: '3',
      text: 'Experience 100+ Designer Frames in the comfort of your home across Dhaka',
      badge: 'HOME TRIAL',
      link: '/contact',
    },
    {
      id: '4',
      text: '1-Year International Warranty on All Titanium & Handcrafted Acetate Frames',
      badge: 'WARRANTY',
      link: '/faq',
    },
  ],
};

export default function MarqueeTicker() {
  const [config, setConfig] = useState(DEFAULT_TICKER);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTicker() {
      try {
        const data = await tickerService.getSettings();
        if (data && isMounted) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        // Fall back gracefully to defaults
      } finally {
        if (isMounted) setLoaded(true);
      }
    }

    loadTicker();

    // Listen for real-time updates broadcast by Admin Panel
    const handleSettingsUpdate = (e) => {
      if (e.detail) {
        setConfig((prev) => ({ ...prev, ...e.detail }));
      }
    };

    window.addEventListener('ticker-updated', handleSettingsUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('ticker-updated', handleSettingsUpdate);
    };
  }, []);

  // If disabled or no messages, do not render ticker
  if (!config.enabled || !config.messages || config.messages.length === 0) {
    return null;
  }

  const {
    speed = 28,
    direction = 'left',
    backgroundColor = '#1A1A1A',
    textColor = '#FAF7F2',
    accentColor = '#8B7355',
    pauseOnHover = true,
    separator = '✦',
    messages = [],
  } = config;

  const animationClass =
    direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left';

  // Multiply items to guarantee continuous, infinite seamless looping
  const repeatedItems = [...messages, ...messages, ...messages, ...messages];

  return (
    <aside
      className={`relative w-full overflow-hidden select-none border-b border-black/10 text-xs font-medium z-10 ${
        pauseOnHover ? 'pause-hover' : ''
      }`}
      style={{
        backgroundColor,
        color: textColor,
        '--marquee-duration': `${Math.max(10, speed)}s`,
      }}
      aria-label="Announcements & Offers"
      id="marquee-ticker-bar"
    >
      <div className="flex w-max marquee-track">
        {/* Track 1 */}
        <div
          className={`flex items-center shrink-0 py-2 sm:py-2.5 ${animationClass} marquee-track`}
          style={{ '--marquee-duration': `${Math.max(10, speed)}s` }}
        >
          {repeatedItems.map((item, index) => {
            const content = (
              <span className="inline-flex items-center gap-2.5 px-6 whitespace-nowrap group cursor-pointer transition-opacity hover:opacity-90">
                {item.badge && (
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: accentColor,
                      color: '#FFFFFF',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                <span className="text-[11px] sm:text-xs font-semibold tracking-wide">
                  {item.text}
                </span>
                <span
                  className="opacity-50 text-[10px] ml-4 font-bold"
                  style={{ color: accentColor }}
                  aria-hidden="true"
                >
                  {separator}
                </span>
              </span>
            );

            if (item.link) {
              const isExternal = item.link.startsWith('http');
              return isExternal ? (
                <a
                  key={`track1-${item.id || index}-${index}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:outline-none focus:ring-1 focus:ring-white/40"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={`track1-${item.id || index}-${index}`}
                  to={item.link}
                  className="focus:outline-none focus:ring-1 focus:ring-white/40"
                >
                  {content}
                </Link>
              );
            }

            return (
              <span key={`track1-${item.id || index}-${index}`}>
                {content}
              </span>
            );
          })}
        </div>

        {/* Track 2 (Clone for uninterrupted 50% loop) */}
        <div
          className={`flex items-center shrink-0 py-2 sm:py-2.5 ${animationClass} marquee-track`}
          style={{ '--marquee-duration': `${Math.max(10, speed)}s` }}
          aria-hidden="true"
        >
          {repeatedItems.map((item, index) => {
            const content = (
              <span className="inline-flex items-center gap-2.5 px-6 whitespace-nowrap group cursor-pointer transition-opacity hover:opacity-90">
                {item.badge && (
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: accentColor,
                      color: '#FFFFFF',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                <span className="text-[11px] sm:text-xs font-semibold tracking-wide">
                  {item.text}
                </span>
                <span
                  className="opacity-50 text-[10px] ml-4 font-bold"
                  style={{ color: accentColor }}
                  aria-hidden="true"
                >
                  {separator}
                </span>
              </span>
            );

            if (item.link) {
              const isExternal = item.link.startsWith('http');
              return isExternal ? (
                <a
                  key={`track2-${item.id || index}-${index}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={`track2-${item.id || index}-${index}`}
                  to={item.link}
                  tabIndex={-1}
                >
                  {content}
                </Link>
              );
            }

            return (
              <span key={`track2-${item.id || index}-${index}`}>
                {content}
              </span>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
