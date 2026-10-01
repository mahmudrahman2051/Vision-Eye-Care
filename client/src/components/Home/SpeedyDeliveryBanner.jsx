import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiClock, FiSliders, FiTruck } from 'react-icons/fi';

const steps = [
  {
    icon: <FiEye className="w-5 h-5 text-gray-900" />,
    title: 'Find your perfect pair',
    desc: 'Browse our wide collection of designer frames available with 48hr Speedy Delivery.',
  },
  {
    icon: <FiClock className="w-5 h-5 text-gray-900" />,
    title: 'Select 2-Day Speedy Delivery',
    desc: 'Once you’ve chosen your style, select the "2-Day Speedy Delivery" option before selecting your lenses.',
  },
  {
    icon: <FiSliders className="w-5 h-5 text-gray-900" />,
    title: 'Customize your lenses',
    desc: 'Select your vision need, add your prescription and choose from specialized lens treatments.',
  },
  {
    icon: <FiTruck className="w-5 h-5 text-gray-900" />,
    title: 'Complete your purchase',
    desc: 'Add your shipping information, securely checkout online and receive your new prescription eyewear within 48 hours.',
  },
];

const SpeedyDeliveryBanner = () => {
  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto">
        {/* Main Banner Box */}
        <div className="bg-[#FEFCE8] border-2 border-[#DFFF00] rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block px-3 py-1 bg-[#DFFF00] text-gray-900 font-black text-xs uppercase tracking-widest rounded border border-yellow-400">
                EXPRESS OPTICAL SHIPPING
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
                New! Now get 2-day speedy prescription delivery.
              </h2>
              <p className="text-sm text-gray-700 font-bold max-w-xl">
                We're offering 2-Day Speedy Delivery on selected prescription eyewear for just $19.00.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop?sort=popular"
                  className="inline-block px-8 py-3.5 bg-[#DFFF00] hover:bg-yellow-400 text-gray-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md border border-yellow-500"
                >
                  SHOP THE DEAL
                </Link>
              </div>
            </div>

            {/* Right Product Image */}
            <div className="lg:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80"
                alt="Speedy Prescription Eyewear"
                className="w-full max-w-[340px] h-auto object-cover rounded-2xl shadow-xl border-4 border-white"
              />
            </div>
          </div>

          {/* Bottom 4 Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {steps.map((s, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-yellow-200 shadow-sm space-y-2">
                <div className="p-2.5 bg-[#DFFF00] rounded-xl w-fit mb-2 border border-yellow-400">
                  {s.icon}
                </div>
                <h4 className="text-xs font-black text-gray-900">{s.title}</h4>
                <p className="text-[11px] text-gray-600 font-bold leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeedyDeliveryBanner;
