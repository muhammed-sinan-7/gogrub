import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  ChevronDown,
  Heart,
  LayoutGrid,
  Home,
  X,
  Loader2,
  Bell,
  BellDot,
  on,
} from "lucide-react";
import { useUser } from "../../Context/UserContext";
import api from "../../api/axios";

function Navbar() {
  const { state } = useUser();
  const { authLoaded, user } = state;

  const navigate = useNavigate();
  const location = useLocation();

  const {logout}  =  useUser();
  const handleLogout = () => {
  logout();
  navigate("/", { replace: true });
};
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Search Logic (Handles Django Pagination: res.data.results)
  const fetchResults = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const res = await api.get(`/products/search/?search=${query}`);

      // Check if the data is wrapped in 'results' due to pagination
      const data = res.data.results || res.data;
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchResults]);

  const { cart, wishlist } = state;
  const userInitial = state.user?.fullname?.[0]?.toUpperCase() || "U";
  const isActive = (path) =>
    location.pathname === path ? "text-orange-500" : "text-slate-500";


    if (!authLoaded) {
  return null; // or loading skeleton if you want
}

  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center flex-shrink-0 cursor-pointer"
          >
            <span className="text-2xl md:text-4xl font-bold">
              <span className="text-orange-500">G</span>o
              <span className="text-orange-500">G</span>rub<span>.</span>
            </span>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-8">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchDropdown
              results={searchResults}
              loading={isSearching}
              query={searchQuery}
              navigate={navigate}
              clear={() => setSearchQuery("")}
            />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 md:gap-5">
            {/* Desktop Icons (Wishlist/Cart) */}
            <div className="hidden md:flex items-center gap-5 mr-2">
              <button
                onClick={() => navigate("/wishlist")}
                className="relative p-2 text-slate-600 hover:text-orange-500 transition-colors"
              >
                <Heart size={22} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-orange-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 text-slate-600 hover:text-orange-500 transition-colors"
              >
                <ShoppingCart size={22} />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 bg-slate-900 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate("/notifications")}
                className={`flex flex-col items-center gap-1 relative ${isActive("/cart")}`}
              >
                <on size={22} />
                {/* {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold ring-2 ring-white">
                    {cart.length}
                  </span>
                )} */}
                {/* <span className="text-[10px] font-bold"></span> */}
              </button>
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-slate-600"
            >
              {showMobileSearch ? <X size={24} /> : <Search size={24} />}
            </button>

            {/* Profile Dropdown (Shared UI) */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1 bg-slate-100 p-1 pr-2 rounded-full border border-slate-200"
                >
                  <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {userInitial}
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white shadow-2xl rounded-2xl border py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-slate-50 text-slate-700"
                    >
                      <User size={16} /> Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-red-600 hover:bg-red-50 font-medium border-t border-slate-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/signup")}
                className="bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-orange-600"
              >
                Join
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Input Overlay */}
        {showMobileSearch && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white px-4 py-3 border-b border-slate-100 shadow-lg z-40">
            <div className="relative">
              <input
                autoFocus
                className="w-full pl-4 pr-10 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-3.5 h-4 w-4 animate-spin text-orange-500" />
              )}
            </div>
            <SearchDropdown
              results={searchResults}
              loading={isSearching}
              query={searchQuery}
              navigate={navigate}
              clear={() => {
                setSearchQuery("");
                setShowMobileSearch(false);
              }}
            />
          </div>
        )}
      </nav>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 h-16 z-50 flex items-center justify-around pb-1 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center gap-1 ${isActive("/")}`}
        >
          <Home size={22} /> <span className="text-[10px] font-bold">Home</span>
        </button>
        <button
          onClick={() => navigate("/products")}
          className={`flex flex-col items-center gap-1 ${isActive("/products")}`}
        >
          <LayoutGrid size={22} />{" "}
          <span className="text-[10px] font-bold">Menu</span>
        </button>
        <button
          onClick={() => navigate("/wishlist")}
          className={`flex flex-col items-center gap-1 relative ${isActive("/wishlist")}`}
        >
          <Heart size={22} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold ring-2 ring-white">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] font-bold">Wishlist</span>
        </button>
        <button
          onClick={() => navigate("/cart")}
          className={`flex flex-col items-center gap-1 relative ${isActive("/cart")}`}
        >
          <ShoppingCart size={22} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold ring-2 ring-white">
              {cart.length}
            </span>
          )}
          <span className="text-[10px] font-bold">Cart</span>
        </button>
        <button
          onClick={() => navigate("/notifications")}
          className={`flex flex-col items-center gap-1 relative ${isActive("/cart")}`}
        >
          <on size={22} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold ring-2 ring-white">
              {cart.length}
            </span>
          )}
          <span className="text-[10px] font-bold">Notifications</span>
        </button>
      </div>

      {/* Backdrop for closing profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/5 md:bg-transparent"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Responsive Spacer to prevent content hiding behind bottom nav */}
      <div className="md:hidden" />
    </>
  );
}

// Search Results Dropdown Component
const SearchDropdown = ({ results, loading, query, navigate, clear }) => {
  if (!query) return null;
  return (
    <div className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-b-2xl border-x border-b border-slate-50 z-[60] max-h-72 overflow-y-auto mt-1">
      {loading ? (
        <div className="p-6 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-orange-500" />{" "}
          Searching...
        </div>
      ) : results.length > 0 ? (
        results.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              navigate(`/product/${item.id}`);
              clear();
            }}
            className="p-4 hover:bg-orange-50 flex items-center gap-4 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
          >
            <img
              src={item.image}
              className="w-12 h-12 rounded-lg object-cover shadow-sm"
              alt={item.name}
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 leading-none">
                {item.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 uppercase font-semibold">
                {item.category}
              </p>
            </div>
            <p className="text-sm font-black text-orange-600">₹{item.price}</p>
          </div>
        ))
      ) : (
        <div className="p-6 text-center text-sm text-slate-400">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
};

export default Navbar;
