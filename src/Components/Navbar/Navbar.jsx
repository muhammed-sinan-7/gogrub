import React, { useState } from 'react'
// import logo from '../../assets/logo.png'
import {  useNavigate } from 'react-router-dom'
import { Search, Menu, X, ShoppingCart, Tag, User, UserPlus } from 'lucide-react';
import '../Navbar/Navbar.css'

function Navbar({isLoggedIn,user}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
   
  const navigate = useNavigate()


  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-21">

          <div className="flex items-center flex-shrink-0">
            <span className="text-4xl font-bold">
              <span className="text-orange-500">G</span>
              <span className="">o</span>
              <span className="text-orange-500">G</span>
              <span className="">ru</span>
              <span className="">b</span>
              <span className="">.</span>
            </span>
          </div>


          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for food."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>


          <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
            <button className="flex items-center space-x-1 text-gray-800 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-semibold transition-colors relative" onClick={()=> navigate('/products')}>
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>
            <button className="flex items-center space-x-1 text-gray-800 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
              <Tag className="h-5 w-5" />
              <span>Best Offer</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-800 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-semibold transition-colors" onClick={()=> navigate('/signup?form=login')}>
              <User className="h-5 w-5" />
              <span>Login</span>
            </button>
            <button className="flex items-center space-x-1 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors" onClick={()=>navigate('/signup?form=signup')}>
              <UserPlus className="h-5 w-5" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Mobile menu button and search button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={toggleSearch}
              className="text-gray-700 hover:text-orange-500 p-2 rounded-md transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-orange-500 p-2 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (collapsible) */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for food, restaurants..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors relative">
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              <span className="absolute right-3 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors">
              <Tag className="h-4 w-4" />
              <span>Best Offer</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors">
              <User className="h-4 w-4" />
              <span>Login</span>
            </button>

            
              <button className="flex items-center space-x-2 bg-orange-500 text-white hover:bg-orange-600 px-3 py-2 rounded-md text-base font-medium transition-colors mt-2"
                  onClick={()=> navigate("/signup")}
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </button>

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar
