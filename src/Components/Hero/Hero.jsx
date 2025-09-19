import React from 'react'
import { useNavigate } from 'react-router-dom'

function Hero() {

  const navigate= useNavigate()
  return (
    <div>
       <div className="relative  px-6 pt-14 lg:px-8">
      {/* Top gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          // style={{
          //   clipPath:
          //     "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          // }}
          className="relative left-[calc(50%-14rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#F25D00] to-[F57B00] opacity-70 sm:left-[calc(50%-30rem)] sm:w-288.75"
        ></div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        {/* Announcement pill */}
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          
        </div>

        {/* Main text */}
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-amber-600 sm:text-7xl">
            Feed Your Cravings, Fuel Your Soul
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-600 sm:text-xl/8">
            From quick bites to full meals, we’ve got the flavors you crave, the freshness you deserve, and the joy that comes with every single bite.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              href="#"
              onClick={()=> navigate('/products')}
              className="rounded-md bg-amber-600 cursor-pointer px-3.5 py-2.5 text-xl font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Let’s Eat!
            </button>
            
          </div>
        </div>
      </div>

      {/* Bottom gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-gradient-to-tr from-[#F25D00] to-[#F25D00] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
        ></div>
      </div>

      
    </div>

    </div>
  )
}

export default Hero
