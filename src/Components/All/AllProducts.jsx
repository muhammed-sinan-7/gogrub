import { useEffect, useState } from "react";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import Navbar from "../Navbar/Navbar";
import { ENDPOINTS } from "../../api/endpoints";
import api from "../../api/axios";
import { toast } from "react-hot-toast"; // 1. Added Import

const PAGE_SIZE = 8;

function AllProducts() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { addToCart, addToWishlist } = useUser();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get(ENDPOINTS.PRODUCTS, {
        params: {
          page: currentPage,
          page_size: 8,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
        },
      });

      console.log("API RESPONSE:", res.data); // 🔍 TEMP DEBUG

      setFoods(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortOption, categoryFilter]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-[#f97316] font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />

      <main className="max-w-[1440px] mx-auto pt-10 px-6  sm:pt-28 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-48 space-y-10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
                Categories
              </h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => {
                      setCategoryFilter("all");
                      setCurrentPage(1);
                    }}
                    className={`text-xs font-bold uppercase ${
                      categoryFilter === "all"
                        ? "text-[#f97316]"
                        : "text-gray-900 hover:text-[#f97316]"
                    }`}
                  >
                    All Collections
                  </button>
                </li>
              </ul>
            </div>

           
          </aside>

          {/* Products */}
          <div className="flex-1">
            <div className="mb-10 flex justify-between items-end border-b border-gray-100 pb-4">
              <h1 className="text-2xl font-bold">
                Our <span className="text-[#f97316]">Catalog</span>
              </h1>
              <p className="text-gray-400 text-xs uppercase tracking-wider">
                {totalCount} Items
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {foods.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="aspect-square bg-gray-50 rounded-xl relative mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                      onClick={() => navigate(`/products/${product.id}`)}
                    />

                    {/* Hover Actions (Overlay) */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => {
                          addToWishlist(product);
                          toast.success(`${product.name} added to wishlist!`); // 2. Added Wishlist Toast
                        }}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#f97316] hover:text-white transition-colors"
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="px-1 pb-2">
                    <h3 className="text-sm font-bold text-gray-800 truncate mb-1 group-hover:text-[#f97316] transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex flex-col">
                        <span className="sm:text-[10px] text-[9px]  text-gray-400 uppercase font-bold tracking-tighter">
                          Price
                        </span>
                        <span className="font-black sm:text-lg text-xs text-gray-900">
                          ₹{product.price}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(product);
                          toast.success(`${product.name} added to cart!`); // 3. Added Cart Toast
                        }}
                        className="bg-[#f97316] hover:bg-orange-600 text-white sm:p-2.5 p-2 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center items-center gap-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft />
              </button>

              <span className="text-xs font-bold">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AllProducts;