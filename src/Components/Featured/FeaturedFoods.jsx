import { useEffect, useState, useRef } from 'react'
import Card from './Card'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { ENDPOINTS } from '../../api/endpoints'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function FeaturedFoods() {
  const [sections, setSections] = useState({
    special_products: [],
    chinese_products: [],
    offer_products: []
  })
  const navigate = useNavigate()
  
  const specialRef = useRef(null)
  const chineseRef = useRef(null)
  const offerRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(ENDPOINTS.HOMEPAGEPRODUCTS)
        setSections({
          special_products: res.data.special_products || [],
          chinese_products: res.data.chinese_products  || [],
          offer_products: res.data.offer_products || []
        })
      } catch (error) {
        console.error('Error:', error)
      }
    }
    fetchData()
  }, [])

  const scroll = (ref, direction) => {
    if (ref.current) {
      const offset = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }

  const renderRow = (title, products, scrollRef) => (
    /* Reduced py-12 to py-4 for tight spacing between rows */
    <div className="max-w-7xl mx-auto px-4 py-4"> 
      {/* Reduced mb-8 to mb-3 for tight header spacing */}
      <div className="flex justify-between items-end mb-3"> 
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
          <div className="h-1 w-8 bg-orange-500 rounded-full mt-1"></div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => scroll(scrollRef, 'left')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(scrollRef, 'right')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
       
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.length > 0 ? (
          products.map((item) => (
            <div 
              key={item.id} 
              className="snap-start"
              onClick={() => navigate(`/products/${item.id}`)}
            >
              <Card
                name={item.name}
                price={item.price}
                img={item.image}
                category={item.category}
              />
            </div>
          ))
        ) : (
          <div className="w-full py-4 text-center border border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-400 text-xs">No delicacies available.</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <section className="bg-white py-2"> {/* Added small padding to top of section */}
      {renderRow("Top Rated Dishes", sections.special_products, specialRef)}
      <div className="bg-slate-50 border-y border-slate-100">
         {renderRow("Chinese Specials", sections.chinese_products, chineseRef)}
      </div>
      {renderRow("Exclusive Offers", sections.offer_products, offerRef)}
    </section>
  )
}

export default FeaturedFoods