import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiClock, FiSliders, FiTruck } from 'react-icons/fi';

const steps = [
  {
    icon: <FiEye className="w-5 h-5 text-teal-600" />,
    title: 'Find Your Frame',
    desc: 'Browse 1,000+ optical frames & sunglasses available with express delivery.',
  },
  {
    icon: <FiClock className="w-5 h-5 text-teal-600" />,
    title: '24hr Dhaka Delivery',
    desc: '24-hour express home delivery in Dhaka city or 48-hour nationwide BD courier.',
  },
  {
    icon: <FiSliders className="w-5 h-5 text-teal-600" />,
    title: 'Doctor Prescription',
    desc: 'Upload doctor prescription or choose zero-power anti-blue cut screen lenses.',
  },
  {
    icon: <FiTruck className="w-5 h-5 text-teal-600" />,
    title: 'bKash / Nagad / COD',
    desc: 'Pay with bKash, Nagad, cards or Cash on Delivery at your doorstep.',
  },
];

const SpeedyDeliveryBanner = () => {
  return (
    <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        {/* Main Banner Box */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 text-white border border-teal-800/60 rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 font-extrabold text-xs uppercase tracking-widest rounded-full border border-teal-500/30">
                EXPRESS BANGLADESH DELIVERY 🚚
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight uppercase text-white leading-tight">
                24-48 HOUR DOORSTEP DELIVERY IN BANGLADESH
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl leading-relaxed">
                Enjoy 24hr Express Delivery in Dhaka City for only ৳80 and nationwide courier across all 64 districts in Bangladesh for ৳120 (FREE on orders over ৳2,000).
              </p>
              <div className="pt-2">
                <Link
                  to="/shop?sort=popular"
                  className="inline-block px-8 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
                >
                  SHOP EXPRESS DEALS
                </Link>
              </div>
            </div>

            {/* Right Product Image */}
            <div className="lg:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80"
                alt="Speedy Prescription Eyewear"
                className="w-full max-w-[340px] h-auto object-cover rounded-2xl shadow-2xl border border-slate-700/80"
              />
            </div>
          </div>

          {/* Bottom 4 Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {steps.map((s, idx) => (
              <div key={idx} className="bg-slate-900/90 backdrop-blur rounded-2xl p-5 border border-slate-800 shadow-sm space-y-2">
                <div className="p-2.5 bg-teal-500/20 rounded-xl w-fit mb-2 border border-teal-500/30">
                  {s.icon}
                </div>
                <h4 className="text-xs font-black text-white">{s.title}</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeedyDeliveryBanner;

