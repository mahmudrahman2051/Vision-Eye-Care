import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiShield, FiTruck, FiCreditCard } from 'react-icons/fi';

const slides = [
  {
    id: 1,
    tag: 'EID & SPRING SPECIAL OFFER 🇧🇩',
    title: 'UP TO 50% OFF PRESCRIPTION EYEGLASSES',
    subtitle: 'Free Blue-Cut Lens Coating & Express 24-48hr Delivery across Dhaka, Chittagong & Sylhet.',
    priceText: 'Frames starting at only ৳990',
    buttonText: 'SHOP BANGLADESH DEALS',
    link: '/shop?sort=popular',
    bgBadge: 'bKash / Nagad Cashback',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    tag: 'HOME TRY-ON IN DHAKA 🏠',
    title: 'TRY 4 FRAMES AT HOME BEFORE BUYING',
    subtitle: 'We bring your favorite optical frames directly to your home or office anywhere in Dhaka city.',
    priceText: 'Zero Delivery Fee on Orders Above ৳2,000',
    buttonText: 'BOOK HOME TRY-ON',
    link: '/about',
    bgBadge: 'Dhaka City Service',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    tag: 'DIGITAL SCREEN PROTECTION 💻',
    title: 'ANTI-GLARE BLUE CUT LENSES FOR STUDENTS & PROS',
    subtitle: 'Protect your eyes from blue light emitted by laptops, mobiles & tablets with certified optical lenses.',
    priceText: 'Lens Packages from ৳1,450',
    buttonText: 'EXPLORE BLUE LIGHT LENSES',
    link: '/shop?search=Blue+Light',
    bgBadge: '100% UV400 Protection',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1000&auto=format&fit=crop&q=80',
  },
];

const FeatureSliderBannerOne = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const current = slides[currentIndex];

  return (
    <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-slate-900 border border-slate-800 text-white rounded-3xl overflow-hidden shadow-2xl min-h-[380px] lg:min-h-[420px] flex items-center">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover object-center transition-all duration-700 opacity-20 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40" />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 z-20 p-3 bg-white/10 hover:bg-teal-600 text-white border border-white/20 rounded-full shadow-lg transition-all backdrop-blur"
            aria-label="Previous Slide"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 z-20 p-3 bg-white/10 hover:bg-teal-600 text-white border border-white/20 rounded-full shadow-lg transition-all backdrop-blur"
            aria-label="Next Slide"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Content */}
          <div className="relative z-10 w-full px-12 sm:px-16 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-full shadow-xs">
                  {current.tag}
                </span>
                <span className="px-3 py-1 bg-teal-500/20 text-teal-300 font-extrabold text-xs uppercase tracking-wider rounded-full border border-teal-500/30">
                  {current.bgBadge}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                {current.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl leading-relaxed">
                {current.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  to={current.link}
                  className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
                >
                  {current.buttonText}
                </Link>
                <span className="text-xs font-black text-amber-300 bg-white/10 backdrop-blur px-4 py-3 rounded-xl border border-white/20">
                  {current.priceText}
                </span>
              </div>
            </div>

            {/* Right Highlights */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-3">
              <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xs">
                <FiTruck className="w-6 h-6 text-teal-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-white">24-48hr Delivery</h4>
                  <p className="text-[11px] text-slate-300 font-medium">Dhaka & Nationwide Bangladesh</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xs">
                <FiCreditCard className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-white">bKash / Nagad / COD</h4>
                  <p className="text-[11px] text-slate-300 font-medium">Easy & secure payments in BDT</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xs">
                <FiShield className="w-6 h-6 text-teal-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-white">100% Eye Test Guarantee</h4>
                  <p className="text-[11px] text-slate-300 font-medium">Doctor prescription accuracy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-8 bg-teal-400' : 'w-2.5 bg-slate-700'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSliderBannerOne;

