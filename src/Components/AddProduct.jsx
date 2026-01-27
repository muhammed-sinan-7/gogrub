import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../api/endpoints";

function AddProduct() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [img_url, setImg_url] = useState("");
  const [isSpecial, setIsSpecial] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(ENDPOINTS.CATEGORIES);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    const newProduct = { 
      name, 
      category: selectedCategory, 
      price: parseFloat(price), 
      description: desc, 
      image: img_url,
      is_special: isSpecial,
      is_available: isAvailable
    };

    try {
      await axios.post(ENDPOINTS.ADMIN_PRODUCTS, newProduct);
      alert("Product added successfully! 🍕");
      navigate('/admin');
    } catch (error) {
      alert("Failed to add product.");
    }
  };

  // Inline styles to force colors even if CSS is blocked
  const themeOrange = "#ff7e2e";
  const fieldBg = "#f3f4f6";

  return (
    <div id="gogrub-unique-wrapper" style={{ padding: '40px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#000', margin: 0 }}>
            ADD <span style={{ color: themeOrange }}>PRODUCT</span>
          </h2>
          <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#999' }}>
            ESC
          </button>
        </header>

        <form onSubmit={addProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            
            <label style={{ fontSize: '10px', fontWeight: '800', color: '#bbb', letterSpacing: '1px' }}>PRODUCT NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spicy Pepperoni"
              style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: 'none', backgroundColor: fieldBg, marginTop: '5px', marginBottom: '20px' }}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '800', color: '#bbb' }}>CATEGORY</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: 'none', backgroundColor: fieldBg, marginTop: '5px' }}
                  required
                >
                  <option value="">Choose...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '800', color: '#bbb' }}>PRICE (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: 'none', backgroundColor: fieldBg, marginTop: '5px' }}
                  required
                />
              </div>
            </div>

            <label style={{ fontSize: '10px', fontWeight: '800', color: '#bbb' }}>IMAGE URL</label>
            <input
              type="url"
              value={img_url}
              onChange={(e) => setImg_url(e.target.value)}
              placeholder="Cloudinary link..."
              style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: 'none', backgroundColor: fieldBg, marginTop: '5px', marginBottom: '20px' }}
              required
            />

            <label style={{ fontSize: '10px', fontWeight: '800', color: '#bbb' }}>DESCRIPTION</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: 'none', backgroundColor: fieldBg, marginTop: '5px', resize: 'none' }}
              required
            ></textarea>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                type="button" 
                onClick={() => setIsSpecial(!isSpecial)}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: isSpecial ? `1px solid ${themeOrange}` : '1px solid #ddd', backgroundColor: isSpecial ? '#fff5ed' : '#fff', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {isSpecial ? '★ SPECIAL' : 'REGULAR'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsAvailable(!isAvailable)}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: isAvailable ? '1px solid #22c55e' : '1px solid #ddd', backgroundColor: isAvailable ? '#f0fdf4' : '#fff', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {isAvailable ? '● IN STOCK' : 'OUT OF STOCK'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', backgroundColor: themeOrange, color: '#fff', fontSize: '16px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255, 126, 46, 0.3)', marginTop: '10px' }}
          >
            CREATE PRODUCT
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default AddProduct;