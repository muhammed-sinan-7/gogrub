

import { useNavigate, useLocation } from 'react-router-dom';

function CategoryButton() {
  const categories = [
    "Pizza",
    "Seafood",
    "Vegetarian",
    "Dessert",
    "Smoothies",
    "Burgers",
    "Pasta",
    "Soups",
    "Cakes",
    "Ice Cream",
    "Chocolates",
    "Momos",
    "Organic",
  ];

  const location = useLocation();
  const activeCategory = location.pathname.split("/")[2];
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center mt-6 md:mt-10 px-4'>
      <h1 className='text-gray-800 text-xl md:text-3xl font-bold pb-4 md:pb-8 text-center'>Choose Your Taste</h1>
      <div className="flex flex-wrap gap-2 md:gap-4 pt-3 md:pt-5 justify-center items-center w-full max-w-4xl">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => navigate(`/category/${cat}`)}
            className={`px-3 py-1 md:px-5 md:py-2 border-1 font-bold rounded-[50px] transition-all duration-500 cursor-pointer text-sm md:text-base
              ${activeCategory === cat
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-amber-500 border-amber-500 hover:bg-amber-500 hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryButton;