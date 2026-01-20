import axios from "axios";
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Star,
  Clock,
  Truck,
  Shield,
  ArrowLeft,
  Plus,
  Minus,
  Share2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import Navbar from "../Navbar/Navbar";
import api from "../../api/axios";
import toast from "react-hot-toast";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [datas, setDatas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const { state, addToCart,addToWishlist } = useUser();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `/products/${id}/`;
        const res = await api.get(url);
        console.log(res.data);
        setDatas(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details. Please try again.");
        setDatas({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = (product, e, quantity) => {
    e.stopPropagation();
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signup");
      return;
    }

    addToCart(product, quantity);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleBuyNow = () => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signup");
      return;
    }

    // Prepare product data for payment page
    const productToBuy = {
      id: datas.id,
      name: datas.name,
      price: datas.price || datas.prize,
      quantity: quantity,
      image: datas.image,
      product_image: datas.image, // For Payment.jsx compatibility
    };

    navigate("/payment", {
      state: { product: productToBuy },
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <section className="min-h-screen bg-gray-50 py-8 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Image Skeleton */}
              <div className="animate-pulse">
                <div className="bg-gray-300 w-full h-64 sm:h-80 lg:h-96 rounded-2xl"></div>
              </div>
              {/* Content Skeleton */}
              <div className="animate-pulse space-y-6">
                <div className="bg-gray-300 h-8 w-3/4 rounded"></div>
                <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
                <div className="bg-gray-300 h-20 w-full rounded"></div>
                <div className="flex gap-4">
                  <div className="bg-gray-300 h-12 w-32 rounded-full"></div>
                  <div className="bg-gray-300 h-12 w-32 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <section className="min-h-screen bg-gray-50 py-8 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse All Products
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-4 sm:py-8 pt-16 sm:pt-20">
        {showPopup && (
          <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
            ✅ Added to Cart!
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-4 sm:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative group">
                <img
                  className="w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] object-cover rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                  src={datas.image}
                  alt={datas.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/500x400/f3f4f6/9ca3af?text=Image+Not+Available";
                  }}
                />
                <button
                  onClick={() => {
                    addToWishlist(datas);
                    toast.success(`${datas.name} added to wishlist!`);
                  }}
                  className="absolute top-4 left-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite ? "text-red-500 fill-current" : "text-gray-700"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {datas.name}
                </h1>
                <div className="mt-2">
                  <span className="inline-block bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                    {datas.category}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ₹{typeof datas.price === "string" ? datas.price : datas.price}
                </span>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Free Delivery</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {datas.description ||
                    "Delicious food prepared with fresh ingredients and authentic flavors. Perfect for satisfying your cravings!"}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={(e) => handleAddToCart(datas, e, quantity)}
                  className="flex-1 bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 py-3 sm:py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Order Now</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center space-x-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-20 sm:h-8"></div>
        </div>
      </section>
    </div>
  );
}

export default Product;
