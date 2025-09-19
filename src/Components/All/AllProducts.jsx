import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
function AllProducts() {

  const [foods, setFoods] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let res = await axios.get("http://localhost:3005/product")
        console.log(res.data);
        setFoods(res.data)
      } catch (error) {
        setFoods("Items Not Available")
      }
    }
    fetchAll()
  }, [])


  const navigate = useNavigate();
  return (
    <div className="max-w-7xl  mx-auto px-4 py-8 pt-20">

      <div className="grid grid-cols-4 gap-6 ">
        {foods.map((product) => (
          <div
            key={product.id}
            className="bg-white cursor-pointer rounded-lg shadow-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden"  >


              <img
                src={product.img_url}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onClick={() => navigate(`/product/${product.id}`)}

              />

              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
              >
                <Heart
                  size={20}
                //   className={favorites.has(product.id) ? "text-red-500 fill-current" : "text-gray-600"}
                />
              </button>

            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">
                    {product.prize}
                  </span>

                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

}

export default AllProducts
