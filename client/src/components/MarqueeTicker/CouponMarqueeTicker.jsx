import React, { useState, useEffect } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import couponService from '../../services/couponService';
import tickerService, { DEFAULT_COUPON_TICKER_SETTINGS } from '../../services/tickerService';

export default function CouponMarqueeTicker() {
  const [coupons, setCoupons] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_COUPON_TICKER_SETTINGS);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [activeList, tickerConfig] = await Promise.all([
          couponService.getActiveCoupons(),
          tickerService.getCouponTickerSettings(),
        ]);

        if (isMounted) {
          if (Array.isArray(activeList)) {
            setCoupons(activeList);
          }
          if (tickerConfig) {
            setSettings({ ...DEFAULT_COUPON_TICKER_SETTINGS, ...tickerConfig });
          }
        }
      } catch {
        // Silent catch
      }
    }

    loadData();

    const handleCouponsUpdate = (e) => {
      if (Array.isArray(e.detail)) {
        const active = e.detail.filter((c) => Boolean(c.is_active));
        setCoupons(active);
      }
    };

    const handleSettingsUpdate = (e) => {
      if (e.detail) {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      }
    };

    window.addEventListener('coupons-updated', handleCouponsUpdate);
    window.addEventListener('coupon-ticker-updated', handleSettingsUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('coupons-updated', handleCouponsUpdate);
      window.removeEventListener('coupon-ticker-updated', handleSettingsUpdate);
    };
  }, []);

  // If disabled by admin or no active coupons are available, do not render
  if (!settings.enabled || !coupons || coupons.length === 0) {
    return null;
  }

  const handleCopy = (e, code) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Coupon code "${code}" copied to clipboard!`, {
        icon: '🏷️',
        style: {
          borderRadius: '12px',
          background: '#1A1A1A',
          color: '#FAF7F2',
          border: `1px solid ${settings.accentColor || '#8B7355'}`,
        },
      });
      setTimeout(() => setCopiedCode(null), 3000);
    } catch {
      toast.success(`Coupon code: ${code}`);
    }
  };

  // Duplicate items so the infinite ticker never has visual gaps
  const repeatCount = Math.max(4, Math.ceil(12 / coupons.length));
  const repeatedCoupons = Array(repeatCount).fill(coupons).flat();
  const animationClass =
    settings.direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left';

  return (
    <aside
      className={`relative w-full overflow-hidden select-none border-b border-white/10 text-xs font-medium z-30 ${
        settings.pauseOnHover ? 'pause-hover' : ''
      }`}
      style={{
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
        '--marquee-duration': `${Math.max(10, settings.speed)}s`,
      }}
      aria-label="Active Coupons & Promo Codes"
      id="coupon-marquee-ticker-bar"
    >
      <div className="flex w-max marquee-track">
        {/* Track */}
        <div
          className={`flex items-center shrink-0 py-1.5 sm:py-2 ${animationClass} marquee-track`}
          style={{ '--marquee-duration': `${Math.max(10, settings.speed)}s` }}
        >
          {repeatedCoupons.map((coupon, index) => {
            const isPercentage = coupon.discount_type === 'percentage';
            const badgeLabel = isPercentage
              ? `${coupon.discount_value}% OFF`
              : `৳${coupon.discount_value} OFF`;
            const isCopied = copiedCode === coupon.code;

            return (
              <span
                key={`coupon-track-${coupon.id || index}-${index}`}
                onClick={(e) => handleCopy(e, coupon.code)}
                title={`Click to copy code: ${coupon.code}`}
                className="inline-flex items-center gap-2.5 px-6 whitespace-nowrap cursor-pointer group transition-opacity hover:opacity-95"
              >
                {/* Discount Badge */}
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white shadow-xs group-hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: settings.accentColor,
                    color: '#FFFFFF',
                  }}
                >
                  {badgeLabel}
                </span>

                {/* Code Pill */}
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-black px-2 py-0.5 rounded bg-white/10 border border-white/20 text-current group-hover:bg-white/20 transition-colors">
                  <span>CODE: {coupon.code}</span>
                  {isCopied ? (
                    <FiCheck className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <FiCopy className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                  )}
                </span>

                {/* Description */}
                <span className="text-[11px] sm:text-xs font-medium tracking-wide opacity-90">
                  {coupon.description || 'Special storewide discount available today'}
                </span>

                {/* Click to Copy Prompt */}
                {settings.promptText && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider group-hover:underline"
                    style={{ color: settings.accentColor }}
                  >
                    {settings.promptText}
                  </span>
                )}

                {/* Separator */}
                <span
                  className="opacity-60 text-[10px] ml-4 font-bold"
                  style={{ color: settings.accentColor }}
                  aria-hidden="true"
                >
                  {settings.separator || '✦'}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
