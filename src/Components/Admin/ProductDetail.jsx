import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { ArrowLeft, Loader2, Save, ShoppingBag, Type, Hash, Layers } from "lucide-react";

const ProductDetailView = ({ productId, onBack }) => {
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/admin/products/${productId}/`);
        setProduct(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await api.put(`/admin/products/${productId}/`, formData);
      setProduct(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
        <p className="text-slate-400 mt-4 font-medium">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10 animate-in fade-in duration-500">
      
      {/* 1. Header Area */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back to Inventory</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full">
           <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
           <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider">Live Item</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* 2. Left Column: Product Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900">{product.name}</h2>
              <p className="text-orange-600 font-bold text-xl mt-1">₹{product.price}</p>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Category</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{product.category} - {product.category_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-black text-white rounded-xl">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-none">Product Settings</h3>
                <p className="text-sm text-slate-400 mt-1">Update price, description, and status</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Product Name</label>
                <div className="relative">
                   <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                   <input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Price (INR)</label>
                <div className="relative">
                   <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                   <input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Category</label>
                <div className="relative">
                   <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                   <input
                    name="category"
                    value={formData.category_name || ""}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Image URL</label>
                <input
                  name="image"
                  value={formData.image || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm font-medium h-32 resize-none"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-orange-100 flex items-center gap-2 disabled:opacity-50"
              >
                {updating ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;