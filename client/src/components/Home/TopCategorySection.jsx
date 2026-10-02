import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'glasses',
    name: 'Glasses',
    link: '/shop?category=eyeglasses',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    link: '/shop?category=sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'contact-lenses',
    name: 'Contact Lenses',
    link: '/shop?search=Contact+Lenses',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'eyeglass-cases',
    name: 'Eyeglass Cases',
    link: '/shop?search=Eyeglass+Cases',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'lens-cleaning',
    name: 'Lens Cleaning Solutions',
    link: '/shop?search=Lens+Cleaning',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&auto=format&fit=crop&q=80',
  },
];

const TopCategorySection = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#F5EFE3]/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Shop By Category
          </h2>
          <div className="w-12 h-0.5 bg-[#8B7355] mx-auto mt-3" />
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group flex flex-col items-center text-center"
            >
              {/* Circular Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#F5EFE3] shadow-sm group-hover:border-[#8B7355] group-hover:shadow-md transition-all duration-300 mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Category Name */}
              <h3 className="text-sm font-medium text-[#333] group-hover:text-[#1A1A1A] transition-colors leading-tight">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategorySection;
