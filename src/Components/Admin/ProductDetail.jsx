import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import cloudinaryApi from "../../api/cloudinary";
import {
  ArrowLeft,
  Loader2,
  Save,
  Pencil,
  X,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { ENDPOINTS } from "../../api/endpoints";

const CLOUDINARY_CLOUD_NAME = "dyneydwxx";
const CLOUDINARY_UPLOAD_PRESET = "Product_preset";

const ProductDetailView = ({ productId, onBack }) => {
  /* =========================
      KEEPING YOUR LOGIC
  ========================= */
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    is_special: false,
    is_available: true,
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(ENDPOINTS.ADMIN_SINGLE_PRODUCT(productId));
        setProduct(res.data);
        setFormData(res.data);
        setPreviewUrl(res.data.image);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return null;
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    setImageUploading(true);
    try {
      const res = await cloudinaryApi.post(
        `/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        data,
      );
      return res.data.secure_url;
    } catch (err) {
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      let finalImageUrl = product.image;
      if (imageFile) {
        const uploadedUrl = await uploadToCloudinary();
        if (!uploadedUrl) {
          toast.error("Image upload failed");
          return;
        }
        finalImageUrl = uploadedUrl;
      }
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        category: Number(formData.category),
        is_special: formData.is_special,
        is_available: formData.is_available,
        description: formData.description,
        image: finalImageUrl,
      };
      const res = await api.put(
        ENDPOINTS.ADMIN_SINGLE_PRODUCT(productId),
        payload,
      );
      setProduct(res.data);
      setFormData(res.data);
      setPreviewUrl(res.data.image);
      setImageFile(null);
      setIsEditing(false);
      toast.success("Product updated successfully");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const cancelEdit = () => {
    setFormData(product);
    setPreviewUrl(product.image);
    setImageFile(null);
    setIsEditing(false);
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-600" size={32} />
      </div>
    );

  /* =========================
      MODERN UI (ORANGE/BLACK)
  ========================= */
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-900 font-bold hover:text-orange-600 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Products
        </button>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md active:scale-95"
          >
            <Pencil size={16} /> Edit Details
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: Current Product Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="relative">
              <img
                src={previewUrl}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-black text-slate-900 uppercase">
                {product.name}
              </h1>
              <p className="text-orange-600 text-xl font-black mt-1">
                ₹{product.price}
              </p>
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
                <p className="text-slate-500 text-sm italic">
                  "{product.description || "No description provided."}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Edit Form (Initially Disabled) */}
        <div className="lg:col-span-7">
          <div
            className={`bg-white rounded-3xl p-8 border transition-all duration-300 ${isEditing ? "border-orange-200 shadow-xl" : "border-slate-100"}`}
          >
            <h2 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">
              Configuration
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Display Name
                  </label>
                  <input
                    name="name"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none p-3.5 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      disabled={!isEditing}
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-none p-3.5 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full bg-slate-50 p-3.5 rounded-xl font-bold text-slate-900
               focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      <option value="">Select category</option>

                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Full Description
                  </label>
                  <textarea
                    name="description"
                    disabled={!isEditing}
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-slate-50 border-none p-3.5 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 disabled:opacity-50 resize-none"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="pt-2 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Change Image
                  </label>
                  <div className="mt-2 flex items-center gap-4">
                    <label className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                      <ImageIcon className="text-slate-300 mb-1" size={20} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Upload New File
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_special"
                    checked={formData.is_special}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Special Item
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-4 h-4 rounded text-black focus:ring-black border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Visible in Menu
                  </span>
                </label>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-8 border-t border-slate-100">
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors px-4 py-2"
                  >
                    <X size={14} /> Discard
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating || imageUploading}
                    className="bg-black text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-slate-200 disabled:bg-slate-300"
                  >
                    {updating || imageUploading ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Save size={14} />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
