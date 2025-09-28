import { useEffect, useState, useRef, forwardRef } from "react";
import Card from "../Special/Card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Offer = forwardRef((props, ref) => {
  const [chinese, setChinese] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecial = async () => {
      try {
        const res = await axios.get(
          "https://gogrub-api-mock.onrender.com/product?category=Offer"
        );
        setChinese(res.data);
      } catch (error) {
        setChinese([]);
      }
    };
    fetchSpecial();
  }, []);

  const slideLeft = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.children[0]?.offsetWidth || 224;
      const gap =
        window.innerWidth >= 1024 ? 36 : window.innerWidth >= 768 ? 24 : 16;
      container.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
    }
  };

  const slideRight = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.children[0]?.offsetWidth || 224;
      const gap =
        window.innerWidth >= 1024 ? 36 : window.innerWidth >= 768 ? 24 : 16;
      container.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={ref}
      className="flex flex-col gap-6 sm:gap-8 lg:gap-12 p-4 sm:p-6 lg:p-8 lg:ml-55 lg:mr-55"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          Top Offers
        </h2>
        <div className="flex gap-2">
          <button
            onClick={slideLeft}
            className="bg-orange-500 hover:bg-orange-600 shadow-lg rounded-full p-2 transition-colors"
          >
            ◀
          </button>
          <button
            onClick={slideRight}
            className="bg-orange-500 hover:bg-orange-600 shadow-lg rounded-full p-2 transition-colors"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll [&::-webkit-scrollbar]:hidden gap-4 sm:gap-4 md:gap-6 lg:gap-9 pb-4"
        >
          {chinese.length > 0 ? (
            chinese.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-full sm:w-64 md:w-72 lg:w-80 mx-auto lg:mx-0"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <Card
                  name={item.name}
                  price={item.price}
                  img={item.img_url}
                  category={item.category}
                />
              </div>
            ))
          ) : (
            <p className="text-red-500 font-bold text-sm sm:text-base lg:text-lg">
              Items Not Available
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

export default Offer;
