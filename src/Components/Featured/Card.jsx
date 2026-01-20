import React from 'react';

function Card({ name, price, img, category }) {
  // Clean up price formatting (handles strings/numbers)
  const displayPrice = typeof price === 'string' ? price.split('.')[0] : Math.floor(price);

  return (
    <div className="relative flex-shrink-0 w-80 sm:w-96 h-48 rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 bg-white">
      {/* Image with subtle zoom on hover */}
      <img
        src={img}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Modern Gradient Overlay (White to Dark Orange/Black) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>

      {/* Category Tag */}
      <div className="absolute top-4 left-4">
        <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg shadow-lg">
          {category}
        </span>
      </div>

      {/* Content Area */}
      <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <h3 className="text-white font-bold text-xl leading-tight drop-shadow-md">
              {name}
            </h3>
            <p className="text-orange-400 text-xs font-semibold mt-1">Freshly Prepared</p>
          </div>
          
          <div className="flex flex-col items-end">
             <span className="bg-white text-orange-600 font-black text-lg px-3 py-1 rounded-xl shadow-xl">
               ₹{displayPrice}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;