// src/components/Navbar/Navbar.jsx
import React, { use, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  Tag,
  User,
  UserPlus,
  LogOut,
  ChevronDown,
  Heart,
  TicketPercent,
} from "lucide-react";
import { useUser } from "../../Context/UserContext";
import "../Navbar/Navbar.css";
import axios from "axios";

function Navbar({ onOffersClick }) {
  const { state } = useUser(); // get state from UserContext
  const navigate = useNavigate();
  const [allitems, setAllItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // filtering search
  let searched = allitems.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    console.log("Logging out...");
    setIsProfileDropdownOpen(false);
    localStorage.removeItem("activeUser");
    localStorage.removeItem("cart");
    window.location.reload();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsProfileDropdownOpen(false);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let res = await axios.get(
          "https://gogrub-api-mock.onrender.com/product"
        );
        setAllItems(res.data);
      } finally {
        console.log("Done..!");
      }
    };
    fetchAll();
  }, []);

  const isLoggedIn = !!state.user;
  const user = state.user;
  const cartCount = state.cart.length;

  const wishlistCount = state.wishlist.length;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-21">
          <div
            onClick={() => navigate("/")}
            className="flex items-center flex-shrink-0"
          >
            <span
              className={`font-bold ${
                isLoggedIn ? "text-2xl md:text-4xl" : "text-4xl"
              }`}
            >
              <span className="text-orange-500">G</span>
              <span>o</span>
              <span className="text-orange-500">G</span>
              <span>ru</span>
              <span>b</span>
              <span>.</span>
            </span>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="relative max-w-md w-full">
              {/* Search icon */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>

              {/* Search input */}
              <input
                type="text"
                value={searchQuery}
                placeholder="Search for food."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />

              {searchQuery && searched.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border rounded-lg shadow-md mt-1 z-20 max-h-60 overflow-y-auto">
                  {searched.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => {
                        setSearchQuery("");
                        navigate(`/product/${item.id}`);
                      }}
                      className="px-4 py-2 flex items-center gap-5 cursor-pointer hover:bg-orange-100"
                    >
                      <img
                        className="w-10 rounded-ful"
                        src={item.img_url}
                        alt=""
                      />
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
            <button
              className="flex items-center space-x-1 text-gray-800 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-semibold transition-colors relative"
              onClick={() => {
                if (typeof onOffersClick === "function") onOffersClick();
              }}
            >
              <TicketPercent className="h-5 w-5" />
              <span>Offers</span>
            </button>

            <button
              className="flex items-center space-x-1 text-gray-800 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-semibold transition-colors relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              <span className="bg-amber-600 rounded-full mb-3 w-5 h-5 text-xs flex justify-center items-center text-white">
                {cartCount}
              </span>
            </button>

            <button
              className="flex items-center space-x-1 text-gray-800 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-semibold transition-colors relative"
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="h-5 w-5 " />
              <span>Wishlist</span>
              <span className="bg-amber-600 rounded-full mb-3 w-5 h-5 text-xs flex justify-center items-center text-white">
                {wishlistCount}
              </span>
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-1 text-gray-800 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-semibold transition-colors"
                >
                  <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span>{user?.name || "User"}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <button
                      onClick={handleProfile}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="flex items-center space-x-1 text-gray-800 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-semibold transition-colors"
                  onClick={() => navigate("/signup?form=login")}
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </button>
                <button
                  className="flex items-center space-x-1 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                  onClick={() => navigate("/signup?form=signup")}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-3">
            {!isLoggedIn && (
              <>
                <button
                  className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={() => navigate("/signup?form=login")}
                >
                  Login
                </button>
                <button
                  onClick={toggleSearch}
                  className="text-gray-700 hover:text-orange-500 p-2 rounded-md transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </>
            )}

            {isLoggedIn && (
              <>
                <button
                  onClick={toggleSearch}
                  className="text-gray-700 hover:text-orange-500 p-2 rounded-md transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>

                {/* Profile Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 p-2 rounded-md transition-colors"
                  >
                    <div className="h-7 w-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="text-sm font-medium max-w-16 truncate">
                      {user?.name || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* Mobile Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <button
                        onClick={handleProfile}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for food..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}

        {/*  Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="flex justify-center items-center py-2 px-8">
            <button
              onClick={() => navigate("/cart")}
              className="flex flex-col items-center justify-center px-6 py-1 text-gray-600 hover:text-orange-500 transition-colors relative"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center font-bold text-[10px]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">Cart</span>
              {}
            </button>

            {/* Vertical Divider */}
            <div className="h-8 w-px bg-gray-200 mx-4"></div>

            {/* Wishlist */}
            <button
              onClick={() => navigate("/wishlist")}
              className="flex flex-col items-center justify-center px-6 py-1 text-gray-600 hover:text-orange-500 transition-colors relative"
            >
              <div className="relative" onClick={() => navigate("/wishlist")}>
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center font-bold text-[10px]">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">Wishlist</span>
            </button>
          </div>
        </div>

        {/* Backdrop for dropdown */}
        {isProfileDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsProfileDropdownOpen(false)}
          />
        )}
      </div>
      <Outlet />
    </nav>
  );
}

export default Navbar;
