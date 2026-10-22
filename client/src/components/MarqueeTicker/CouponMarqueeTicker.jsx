import React, { useState, useEffect } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import couponService, { DEFAULT_COUPONS } from '../../services/couponService';

export default function CouponMarqueeTicker() {
  const [coupons, setCoupons] = useState(DEFAULT_COUPONS);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCoupons() {
      try {
        const active = await couponService.getActiveCoupons();
        if (isMounted && Array.isArray(active) && active.length > 0) {
          setCoupons(active);
        }
      } catch {
        // Fall back to starter coupons
      }
    }

    loadCoupons();

    const handleCouponsUpdate = (e) => {
      if (Array.isArray(e.detail)) {
        const active = e.detail.filter((c) => Boolean(c.is_active));
        setCoupons(active.length > 0 ? active : DEFAULT_COUPONS);
      }
    };

    window.addEventListener('coupons-updated', handleCouponsUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('coupons-updated', handleCouponsUpdate);
    };
  }, []);

  if (!coupons || coupons.length === 0) {
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
          border: '1px solid #8B7355',
        },
      });
      setTimeout(() => setCopiedCode(null), 3000);
    } catch {
      toast.success(`Coupon code: ${code}`);
    }
  };

  // Duplicate items for continuous, infinite marquee scrolling
  const repeatedCoupons = [...coupons, ...coupons, ...coupons, ...coupons];

  return (
    <aside
      className="relative w-full overflow-hidden select-none border-b border-white/10 text-xs font-medium z-30 bg-[#121212] text-[#FAF7F2] pause-hover"
      style={{
        '--marquee-duration': `${Math.max(20, coupons.length * 9)}s`,
      }}
      aria-label="Active Coupons & Promo Codes"
      id="coupon-marquee-ticker-bar"
    >
      <div className="flex w-max marquee-track">
        {/* Track */}
        <div
          className="flex items-center shrink-0 py-1.5 sm:py-2 animate-marquee-left marquee-track"
          style={{ '--marquee-duration': `${Math.max(20, coupons.length * 9)}s` }}
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
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#8B7355] text-white shadow-xs group-hover:scale-105 transition-transform">
                  {badgeLabel}
                </span>

                {/* Code Pill */}
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-black px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[#E8DFD0] group-hover:bg-[#8B7355]/30 group-hover:border-[#8B7355] transition-colors">
                  <span>CODE: {coupon.code}</span>
                  {isCopied ? (
                    <FiCheck className="w-3 h-3 text-green-400" />
                  ) : (
                    <FiCopy className="w-3 h-3 text-[#A89885] group-hover:text-white" />
                  )}
                </span>

                {/* Description */}
                <span className="text-[11px] sm:text-xs text-[#E5E0D8] font-medium tracking-wide">
                  {coupon.description || 'Special storewide discount available today'}
                </span>

                {/* Click to Copy Prompt */}
                <span className="text-[9px] font-bold text-[#8B7355] uppercase tracking-wider group-hover:underline">
                  [Click to Copy]
                </span>

                {/* Gold Separator */}
                <span className="opacity-40 text-[10px] ml-4 font-bold text-[#8B7355]" aria-hidden="true">
                  ✦
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
