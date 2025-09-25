import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Card({ name, price, img, category }) {
  const scrollRef = useRef(null);
  const [spFoods, setSpfoods] = useState([])




  return (
    <div className="relative flex rounded-xl shadow-lg overflow-hidden hover:scale-95 hover:shadow-xl transition-all duration-300 cursor-pointer w-80 h-54 group ">
      {/* Image */}
      <img
        src={img}
        alt={name}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300"></div>

      {/* Category */}
      <div className="absolute top-3 left-3">
        <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30">
          {category}
        </span>
      </div>

      {/* Name + Price */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-between items-end">
          <h3 className="text-white font-bold text-lg">{name}</h3>
          <span className="text-white font-bold text-lg bg-amber-500/90 px-2 py-1 rounded-lg">
            ₹{price}
          </span>
        </div>
      </div>
    </div>
  );

}

export default Card
