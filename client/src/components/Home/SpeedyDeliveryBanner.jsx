import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiClock, FiSliders, FiTruck } from 'react-icons/fi';

const steps = [
  {
    icon: <FiEye className="w-6 h-6 text-[#5B649E]" />,
    title: 'Find your perfect pair',
    desc: 'Browse our wide collection of designer frames available with 48hr Speedy Delivery.',
  },
  {
    icon: <FiClock className="w-6 h-6 text-[#5B649E]" />,
    title: 'Select 2-Day Speedy Delivery',
    desc: 'Once you’ve chosen your style, select the "2-Day Speedy Delivery" option before selecting your lenses.',
  },
  {
    icon: <FiSliders className="w-6 h-6 text-[#5B649E]" />,
    title: 'Customize your lenses',
    desc: 'Select your vision need, add your prescription and choose from specialized lens treatments.',
  },
  {
    icon: <FiTruck className="w-6 h-6 text-[#5B649E]" />,
    title: 'Complete your purchase',
    desc: 'Add your shipping information, securely checkout online and receive your new prescription eyewear within 48 hours.',
  },
];

const SpeedyDeliveryBanner = () => {
  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Main Banner Box */}
        <div className="bg-gradient-to-r from-[#E6F7F0] via-[#E8EEF8] to-[#F3E8F5] rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                New! Now get speedy prescription delivery.
              </h2>
              <p className="text-sm text-gray-700 font-medium max-w-xl">
                We're offering 2-Day Speedy Delivery on selected prescription eyewear for just $19.00.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop?sort=popular"
                  className="inline-block px-8 py-3.5 bg-[#5B649E] hover:bg-[#4A5288] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow"
                >
                  SHOP THE DEAL
                </Link>
              </div>
            </div>

            {/* Right Product Image Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80"
                alt="Speedy Prescription Eyewear"
                className="w-full max-w-[360px] h-auto object-cover rounded-2xl shadow-xl border-4 border-white"
              />
            </div>
          </div>

          {/* Bottom 4 Cards Strip (Screenshot 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {steps.map((s, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm space-y-2">
                <div className="p-2 bg-[#F3F4F6] rounded-xl w-fit mb-2">
                  {s.icon}
                </div>
                <h4 className="text-xs font-bold text-gray-900">{s.title}</h4>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeedyDeliveryBanner;
