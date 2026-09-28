import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, total, limit } = pagination;

  if (!totalPages || totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[#292929]">
      <div className="text-xs text-gray-400">
        Showing <span className="font-bold text-white">{startItem}</span> to{' '}
        <span className="font-bold text-white">{endItem}</span> of{' '}
        <span className="font-bold text-[#DFFF00]">{total}</span> products
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 bg-[#171717] border border-[#292929] rounded-xl text-gray-300 hover:text-[#DFFF00] hover:border-[#DFFF00] disabled:opacity-30 disabled:hover:text-gray-300 disabled:hover:border-[#292929] transition-all"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p, idx) => (
          <React.Fragment key={idx}>
            {p === '...' ? (
              <span className="px-2 text-xs text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(p)}
                className={`w-9 h-9 text-xs font-bold rounded-xl border transition-all ${
                  page === p
                    ? 'bg-[#DFFF00] border-[#DFFF00] text-black shadow-md'
                    : 'bg-[#171717] border-[#292929] text-gray-300 hover:border-[#DFFF00] hover:text-[#DFFF00]'
                }`}
              >
                {p}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 bg-[#171717] border border-[#292929] rounded-xl text-gray-300 hover:text-[#DFFF00] hover:border-[#DFFF00] disabled:opacity-30 disabled:hover:text-gray-300 disabled:hover:border-[#292929] transition-all"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
