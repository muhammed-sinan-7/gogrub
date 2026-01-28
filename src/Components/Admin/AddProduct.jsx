import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../api/endpoints";
import api from "../../api/axios";
import cloudinaryApi from "../../api/cloudinary";

const CLOUDINARY_CLOUD_NAME = "dyneydwxx";
const CLOUDINARY_UPLOAD_PRESET = "Product_preset";

function AddProduct() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null); // Local file state
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(ENDPOINTS.CATEGORIES);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Upload the local file to Cloudinary and return secure_url or null
  const uploadToCloudinary = async () => {
    if (!imageFile) return null;
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    setImageUploading(true);
    try {
      const res = await cloudinaryApi.post(
        `/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        data
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed:", err.response?.data || err);
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!imageFile) { alert("Please select a product image."); return; }
  setLoading(true);

  try {
    // 1) Upload to Cloudinary
    const imageUrl = await uploadToCloudinary();
    if (!imageUrl) {
      alert("Image upload failed.");
      setLoading(false);
      return;
    }

    // 2) SEND AS PLAIN JSON OBJECT (Not FormData)
    const payload = {
      name: name,
      category: Number(selectedCategory),
      price: Number(price),
      description: desc,
      is_special: isSpecial,
      is_available: isAvailable,
      image: imageUrl, // This is just a string URL
    };

    // Axios will automatically set Content-Type: application/json
    await api.post(ENDPOINTS.ADMIN_PRODUCTS, payload);
    
    alert("Product added successfully! 🍕");
    navigate("/admin");
  } catch (error) {
      console.error("Server Error:", error.response?.data || error);
      const errorMsg = error.response?.data
        ? Object.entries(error.response.data)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        : "Check your connection";
      alert(`Error Details:\n${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-6 lg:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight">
              CREATE <span className="text-[#ff7e2e]">NEW</span> ITEM
            </h1>
            <p className="text-gray-400 font-medium">Update your digital menu</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#ff7e2e] transition-all"
          >
            BACK
          </button>
        </div>

        <form onSubmit={handleSendMessage} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-2 space-y-6 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Signature Truffle Burger"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#ff7e2e] focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#ff7e2e] focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-semibold"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#ff7e2e] focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Description
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder="Describe the ingredients, taste, and allergens..."
                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#ff7e2e] focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all resize-none font-medium"
                required
              ></textarea>
            </div>
          </div>

          {/* Right Column: Image & Status */}
          <div className="space-y-6">
            {/* Image Upload Box */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                Product Image
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                <div
                  className={`h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${imageFile ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 group-hover:border-[#ff7e2e]"}`}
                >
                  {previewUrl ? (
                    <div className="text-center p-2">
                      <img src={previewUrl} alt="preview" className="max-h-36 rounded" />
                      <p className="text-xs font-bold text-green-600 truncate max-w-[150px]">{imageFile?.name}</p>
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl mb-2">🖼️</span>
                      <p className="text-[10px] font-black text-gray-400 tracking-tighter uppercase">
                        Click to upload file
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status Toggles */}
            <div className="bg-black p-6 rounded-[32px] text-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest">Special Item</span>
                <input
                  type="checkbox"
                  checked={isSpecial}
                  onChange={(e) => setIsSpecial(e.target.checked)}
                  className="w-10 h-5 accent-[#ff7e2e] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest">Available</span>
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-10 h-5 accent-[#ff7e2e] cursor-pointer"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || imageUploading}
              className="w-full bg-[#ff7e2e] text-white font-black py-6 rounded-[32px] shadow-xl shadow-orange-200 hover:shadow-none hover:bg-black transition-all transform active:scale-95 disabled:bg-gray-300"
            >
              {loading || imageUploading ? "SAVING..." : "PUBLISH PRODUCT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;