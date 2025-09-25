// ShoppingCart.js
import React from "react";
import { Plus, Minus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import Navbar from "../Navbar/Navbar";
const Cart = () => {
  const { state, updateQuantity, removeFromCart } = useUser();
  const { cart: items } = state;
  const navigate = useNavigate();

  
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const total = subtotal;

  return (
      <div>
        <Navbar/>
        <div className="max-w-7xl mx-auto p-6">
      
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {items.length} items
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Items in your cart
            </h2>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-2">
                  Add some items to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.img_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    </div>

                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        
                        <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, "dec")}
                            className="p-2 hover:bg-gray-100 rounded-l-xl transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, "inc")}
                            className="p-2 hover:bg-gray-100 rounded-r-xl transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">
                            {Number(item.price) * Number(item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/products")}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  ← Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>

        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            {items.length > 0 ? (
              <>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>

                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>{total}</span>
                  </div>
                </div>

                
                <button 
                onClick={()=> navigate('/payment')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4 flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Proceed to Payment
                </button>

                <div className="text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Secure Checkout
                  </div>
                  <p>Your payment information is protected</p>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <p>Add items to see order summary</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default Cart;
