import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import video from '../../assets/Banner/2627bbed9d6c068e50d2aadcca11ddbb1743095925.mp4';

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[95vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={video}
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Subtle radial overlay: Focuses light in the center */}
      <div className="absolute inset-0 bg-black/40 bg-[radial-gradient(circle,_transparent_20%,_rgba(0,0,0,0.7)_100%)]"></div>

      <div className="relative z-10 w-full max-w-4xl px-6 text-center">
        {/* Small Top Label */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="block text-orange-500 font-bold tracking-[0.4em] uppercase text-xs mb-4"
        >
          Premium Quality • Fast Delivery
        </motion.span>

        {/* Main Centered Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none"
        >
          DELICIOUSLY <br />
          <span className="italic font-serif font-light text-orange-500">Unforgettable</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-6 text-slate-200 text-lg md:text-xl max-w-xl mx-auto font-medium leading-relaxed"
        >
          Discover a world of flavors curated by top chefs, <br className="hidden md:block" /> 
          delivered fresh to your doorstep in minutes.
        </motion.p>

        {/* Centered CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate("/products")}
            className="w-full sm:w-auto px-10 py-4 bg-orange-600 text-white rounded-full font-bold text-lg hover:bg-orange-500 transition-all shadow-xl shadow-orange-950/20 active:scale-95"
          >
            Start Your Order
          </button>
          
          
        </motion.div>
      </div>

      {/* Floating Scroll Prompt */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-1 text-white/40 cursor-pointer"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-[9px] uppercase tracking-widest font-bold">Scroll Down</span>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Hero;