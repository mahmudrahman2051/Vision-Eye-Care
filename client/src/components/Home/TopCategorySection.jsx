import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const categories = [
  {
    id: 'eyeglasses',
    name: 'Eyeglasses',
    bnName: 'আইগ্লাস / চশমা',
    price: 'From ৳1,200',
    count: '450+ Styles',
    link: '/shop?category=eyeglasses',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
    badge: 'POPULAR',
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    bnName: 'সানগ্লাস',
    price: 'From ৳1,500',
    count: '320+ Styles',
    link: '/shop?category=sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    badge: 'UV400',
  },
  {
    id: 'blue-light',
    name: 'Computer & Blue Light',
    bnName: 'ব্লু-কাট লেন্স',
    price: 'From ৳1,800',
    count: '180+ Lenses',
    link: '/shop?search=Blue+Light',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
    badge: 'MUST HAVE',
  },
  {
    id: 'reading-glasses',
    name: 'Reading Glasses',
    bnName: 'রিডিং গ্লাস',
    price: 'From ৳990',
    count: '120+ Styles',
    link: '/shop?search=Reading',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    badge: 'BEST VALUE',
  },
  {
    id: 'kids-eyewear',
    name: 'Kids Eyewear',
    bnName: 'বাচ্চাদের চশমা',
    price: 'From ৳1,100',
    count: '95+ Styles',
    link: '/shop?search=Kids',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
    badge: 'DURABLE',
  },
  {
    id: 'contact-lenses',
    name: 'Contact Lenses',
    bnName: 'কনট্যাক্ট লেন্স',
    price: 'From ৳1,400',
    count: '60+ Types',
    link: '/shop?search=Contact+Lenses',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    badge: 'NEW',
  },
];

const TopCategorySection = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 bg-[#DFFF00] text-gray-900 font-black text-xs uppercase tracking-widest rounded border border-yellow-400">
            TOP CATEGORIES IN BANGLADESH
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight">
            Explore By Category
          </h2>
          <p className="text-sm text-gray-600 font-bold leading-relaxed">
            Browse Bangladesh's largest collection of eyeglasses, sunglasses, and specialized optical lenses in BDT (৳).
          </p>
        </div>

        {/* Category Grid (6 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group relative bg-[#FEFCE8] border-2 border-[#DFFF00] hover:border-yellow-400 rounded-2xl overflow-hidden p-4 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-xl min-h-[260px]"
            >
              {/* Badge */}
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#DFFF00] text-gray-900 font-black text-[9px] uppercase tracking-wider rounded border border-yellow-400 z-10">
                {cat.badge}
              </span>

              {/* Image Circle Container */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white shadow-md my-2 group-hover:scale-105 transition-transform duration-300 bg-white">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Text Area */}
              <div className="space-y-1 mt-2">
                <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-tight group-hover:text-yellow-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-yellow-800 font-bold">{cat.bnName}</p>
                <div className="pt-1">
                  <span className="inline-block px-2.5 py-0.5 bg-white text-gray-900 font-black text-[11px] rounded border border-yellow-300 shadow-xs">
                    {cat.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategorySection;
