import { ShoppingCart, Trash2, Heart } from "lucide-react";
import { useUser } from "../../Context/UserContext";
import Navbar from "../Navbar/Navbar";
import { ENDPOINTS } from "../../api/endpoints";
import api from "../../api/axios";
const Wishlist = () => {
  const { state, dispatch, removeFromWishlist } = useUser();
  const { wishlist = [], cart = [] } = state;

  const handleRemoveWishlist = (product, e) => {
    e.stopPropagation();
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signup");
      return;
    }
    removeFromWishlist(product);
    console.log("DELETE ITEM:", product);

  };

  const moveToCart = async (item,e) => {
    try{
      let res = await api.post(ENDPOINTS.CART,{
        product_id:item.product.id,
        quantity : 1
      },
    )
    const fullCart = await api.get(ENDPOINTS.CART)
    console.log(fullCart.data)
    dispatch({type:'SET_CART', payload:fullCart.data.cart.items})
    await removeFromWishlist(item)
      
    }catch(error){
      console.error(error)
    }
  };

  if (!wishlist.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <Navbar />
        <div className="max-w-lg mx-auto p-8 text-center pt-28">
          <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">No items saved</h2>
          <p className="text-sm text-gray-600">Add products to your wishlist to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 pt-20">
        <div className="flex items-center mb-6 pb-4 border-b border-orange-100">
          <Heart className="w-6 h-6 text-orange-500 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">Wishlist ({wishlist.length})</h1>
        </div>
        
        <div className="space-y-3">
          {wishlist.map((item) => {
            const product = item.product || item;
            return (
              <div
                key={item.id}
                className="bg-white rounded-md shadow-sm border border-orange-50 hover:shadow-md hover:border-orange-200 transition-all duration-200 p-5"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md shadow-sm"
                    />
                    <div className="absolute top-1 right-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      ♥
                    </div>
                  </div>
                  
                  <div className="flex-1 py-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                      <span className="ml-2 text-sm text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={(e) => moveToCart(item,e)}
                      className="flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-md hover:from-orange-600 hover:to-orange-700 shadow-sm transition-all duration-200 text-sm font-medium"
                    >
                      <ShoppingCart size={16} className="mr-1.5" />
                      Move to Cart
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(item)}
                      className="flex items-center text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 rounded-md transition-all duration-200"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
