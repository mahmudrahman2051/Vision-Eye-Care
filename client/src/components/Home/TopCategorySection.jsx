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
    <section className="py-8 sm:py-12 px-2 sm:px-6 lg:px-8 bg-[#F5EFE3]/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Shop By Category
          </h2>
          <div className="w-12 h-0.5 bg-[#8B7355] mx-auto mt-2" />
        </div>

        {/* Category Row (1 Row with 5 Columns) */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-6 lg:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group flex flex-col items-center text-center px-1"
            >
              {/* Circular Image */}
              <div className="w-14 h-14 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-[#F5EFE3] shadow-sm group-hover:border-[#8B7355] group-hover:shadow-md transition-all duration-300 mb-2 sm:mb-3 flex-shrink-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Category Name */}
              <h3 className="text-[10px] sm:text-xs md:text-sm font-semibold text-[#333] group-hover:text-[#1A1A1A] transition-colors leading-tight line-clamp-2">
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
