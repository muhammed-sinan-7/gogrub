// Wishlist.js

import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useUser } from "../../Context/UserContext";
import Navbar from "../Navbar/Navbar";


const Wishlist = () => {
  const { state, dispatch } = useUser();
  const { wishlist = [], cart = [] } = state;

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    dispatch({ type: "SET_WISHLIST", payload: updated });
  };

  const moveToCart = (item) => {
    // if already in cart, skip
    const inCart = cart.find((c) => c.id === item.id);
    if (!inCart) {
      dispatch({ type: "SET_CART", payload: [...cart, { ...item, quantity: 1 }] });
    }
    removeFromWishlist(item.id);
  };

  if (!wishlist.length) {
    return (
      <div>
        <Navbar/>
      <div className="max-w-3xl mx-auto p-6 text-center">
        <Heart className="mx-auto w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-600">
          Your wishlist is empty
        </h2>
      </div>
      </div>
    );
  }

  return (
    <div>
     
        <Navbar/>
       <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="space-y-4">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white border rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.img_url || "https://via.placeholder.com/80"}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">₹{item.price}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => moveToCart(item)}
                className="flex items-center bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
              >
                <ShoppingCart size={16} className="mr-1" /> Move to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="flex items-center bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
              >
                <Trash2 size={16} className="mr-1" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    </div>
   
  );
};

export default Wishlist;
