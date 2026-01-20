// ShoppingCart.js
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CreditCard,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import Navbar from "../Navbar/Navbar";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const Cart = () => {
  const { state, updateQuantity, removeFromCart } = useUser();
  const navigate = useNavigate();
  const cart = state.cart;

  const handleRemoveCart = (item, e) => {
    e.stopPropagation();
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signup");
      return;
    }
    removeFromCart(item);
    toast.success("Item Removed From Cart")
    console.log("DELETE ITEM:", item);
  };

  const handleCheckout = () => {
    navigate("/payment", {
      state: { mode: "cart" },
    });
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const total = subtotal;

  if (state.loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 text-center">
          <p className="text-gray-500">Loading your cart...</p>
        </main>
      </>
    );
  }
  return (
    <>
      <Navbar />
      <main className="bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-7 h-7 text-orange-500 flex-shrink-0" />
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              {cart.length > 0 && (
                <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full ml-2">
                  {cart.length} items
                </span>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Cart Items - 8 columns */}
            <section className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Items Header */}
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Items
                  </h2>
                </div>

                {/* Items Content */}
                {cart.length === 0 ? (
                  <div className="text-center py-20 px-6">
                    <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                      No items yet. Add some products to get started with your
                      shopping.
                    </p>
                    <button
                      onClick={() => navigate("/products")}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-gray-100">
                      {cart.map((item, index) => (
                        <div
                          key={item.id}
                          className="p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-5">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-grow min-w-0">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
                                    {item.product_name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    ₹{Number(item.price).toLocaleString()}
                                  </p>
                                </div>

                                {/* Remove Button */}
                                <button
                                  onClick={(e) => handleRemoveCart(item, e)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 ml-4"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>

                              {/* Quantity & Price */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                  <button
                                    onClick={() => updateQuantity(item, "dec")}
                                    className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-4 h-4 text-gray-500" />
                                  </button>
                                  <span className="px-6 py-3 text-lg font-semibold text-gray-900 border-x border-gray-200">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item, "inc")}
                                    className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-center"
                                  >
                                    <Plus className="w-4 h-4 text-gray-500" />
                                  </button>
                                </div>

                                <div className="text-right ml-6">
                                  <div className="text-2xl font-bold text-gray-900">
                                    ₹
                                    {(
                                      Number(item.price) * Number(item.quantity)
                                    ).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Continue Shopping */}
                    <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={() => navigate("/products")}
                        className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-1 transition-colors"
                      >
                        ← Continue Shopping
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Order Summary - 4 columns */}
            <aside className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8">
                {/* Summary Header */}
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-500" />
                    Order Summary
                  </h2>
                </div>

                {/* Summary Content */}
                {cart.length > 0 ? (
                  <div className="p-6">
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-600">
                          Subtotal ({cart.length} items)
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{subtotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Shipping
                        </span>
                        <span className="text-sm font-semibold text-orange-600">
                          FREE
                        </span>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-baseline">
                          <span className="text-lg font-semibold text-gray-900">
                            Total
                          </span>
                          <span className="text-3xl font-bold text-gray-900">
                            ₹{total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 mb-6"
                    >
                      <CreditCard className="w-5 h-5" />
                      Proceed to Checkout
                    </button>

                    <div className="text-center border-t border-gray-100 pt-5">
                      <div className="flex items-center justify-center gap-2 text-sm text-orange-600 font-medium mb-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9v-5a1 1 0 011-1h1a1 1 0 110 2v1a1 1 0 01-2 0v-1H4a1 1 0 01-1-1v-1a3 3 0 016 0v2a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-1a1 1 0 112 0v1a1 1 0 001 1h1a1 1 0 110 2H5a3 3 0 01-3-3v-2a3 3 0 013-3h1a1 1 0 110 2H5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Secure Checkout
                      </div>
                      <p className="text-xs text-gray-500">
                        Your payment info is protected with encryption
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm font-medium">
                      Add items to see order summary
                    </p>
                    <button
                      onClick={() => navigate("/products")}
                      className="mt-6 w-full px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default Cart;
