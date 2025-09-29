import axios from "axios";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import Navbar from "../Navbar/Navbar";

function AllProducts() {
  const [foods, setFoods] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state, addToCart, addToWishlist } = useUser();
  const [filtered, setFiltered] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://gogrub-api-mock.onrender.com/product`
      );
      setFoods(res.data);
      setFiltered(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
      setFoods([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let updated = [...foods];

    if (categoryFilter !== "all") {
      updated = updated.filter((p) => p.category === categoryFilter);
    }

    if (sortOption === "price-asc") {
      updated.sort((a, b) => (a.price || a.prize) - (b.price || b.prize));
    } else if (sortOption === "price-desc") {
      updated.sort((a, b) => (b.price || b.prize) - (a.price || a.prize));
    } else if (sortOption === "name-asc") {
      updated.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      updated.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFiltered(updated);
    setCurrentPage(1);
  }, [sortOption, categoryFilter, foods]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) newFavorites.delete(productId);
      else newFavorites.add(productId);
      return newFavorites;
    });
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (!state?.user) {
      navigate("/signup");
      return;
    }
    addToCart(product);
  };

  const handleAddtoWishlist = (product, e) => {
    e.stopPropagation();
    addToWishlist(product);
  };

  // 🔹 Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // 🔹 Loading Spinner
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return <div className="max-w-7xl mx-auto px-4 py-8 pt-20">{error}</div>;

  if (foods.length === 0)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        No Products Available
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 pt-16 sm:pt-20">
        {/* Header & Filters */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              All Products
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Discover amazing foods
            </p>
          </div>

          {/* 🔹 Modern Dropdowns */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
              >
                <option value="all">All Categories</option>
                {[...new Set(foods.map((f) => f.category))].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {/* Left Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4a1 1 0 011-1h2a1 1 0 011 1v0a1 1 0 01-1 1H4a1 1 0 01-1-1v0zM3 12a1 1 0 011-1h10a1 1 0 011 1v0a1 1 0 01-1 1H4a1 1 0 01-1-1v0zM3 20a1 1 0 011-1h6a1 1 0 011 1v0a1 1 0 01-1 1H4a1 1 0 01-1-1v0z"
                />
              </svg>
              {/* Arrow */}
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
              >
                <option value="default">Sort By</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name-asc">Name: A → Z</option>
                <option value="name-desc">Name: Z → A</option>
              </select>
              {/* Left Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m6-6H6"
                />
              </svg>
              {/* Arrow */}
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {currentItems.map((product) => (
            <div
              key={product.id}
              className="bg-white cursor-pointer rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.img_url}
                  alt={product.name}
                  className="w-full h-48 sm:h-52 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onClick={() => navigate(`/product/${product.id}`)}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Image+Not+Available";
                  }}
                />
                <button
                  onClick={(e) => handleAddtoWishlist(product, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
                >
                  <Heart
                    size={18}
                    onClick={toggleFavorite}
                    className={
                      favorites.has(product.id)
                        ? "text-red-500 fill-current"
                        : "text-gray-600 hover:text-red-500"
                    }
                  />
                </button>
                <div className="absolute top-3 left-3">
                  <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 lg:p-4">
                <h3
                  className="font-bold text-gray-900 mb-2 text-base sm:text-lg lg:text-base line-clamp-2 group-hover:text-orange-600 transition-colors cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl sm:text-2xl lg:text-xl font-bold text-gray-900">
                      {product.prize || product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.discount && (
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2.5 sm:py-3 lg:py-2.5 px-4 rounded-lg sm:rounded-xl lg:rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-semibold text-sm sm:text-base lg:text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                currentPage === num
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="h-20 sm:h-8"></div>
      </div>
    </div>
  );
}

export default AllProducts;
