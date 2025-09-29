import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ Import Framer Motion

function Hero() {
  const navigate = useNavigate();

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141353.jpg')", // ✅ Food background image
      }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center text-white">
          {/* Fade-up Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl"
          >
            Feed Your Cravings, Fuel Your Soul
          </motion.h1>

        
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="mt-8 text-lg font-medium text-pretty sm:text-xl/8"
          >
            From quick bites to full meals, we’ve got the flavors you crave, the
            freshness you deserve, and the joy that comes with every single
            bite.
          </motion.p>

          {/* Fade-up Button */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: "easeOut", delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <button
              onClick={() => navigate("/products")}
              className="rounded-md bg-amber-600 cursor-pointer px-3.5 py-2.5 text-xl font-semibold text-white shadow-xs hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Take Menu
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
