import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";
import cloudinaryApi from "../../api/cloudinary";

const CLOUDINARY_CLOUD_NAME = "dyneydwxx";
const CLOUDINARY_UPLOAD_PRESET = "Product_preset";

const AddProduct = ({ onBack, onProductAdded }) => {
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    is_special: false,
    is_available: true,
  });

  /* =========================
     Fetch Categories
  ========================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(ENDPOINTS.CATEGORIES);
        setCategories(res.data);
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  /* =========================
     Cleanup preview URL
  ========================= */
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /* =========================
     Handlers
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  /* =========================
     Cloudinary Upload (AXIOS)
  ========================= */
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
      console.error("Cloudinary upload failed:", err.response?.data);
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  /* =========================
     Submit Product
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Product image is required");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary();
      if (!imageUrl) {
        toast.error("Image upload failed");
        return;
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        category: Number(formData.category),
        image: imageUrl,
      };

      const res = await api.post(ENDPOINTS.ADMIN_PRODUCTS, payload);

      toast.success("Product added successfully");
      onProductAdded?.(res.data);
      onBack();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border space-y-4">
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <select
            required
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={categoriesLoading}
            className="w-full border p-3 rounded"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        <div className="bg-white p-6 rounded-xl border space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full rounded border"
            />
          )}
          <button
            type="submit"
            disabled={loading || imageUploading}
            className="w-full bg-orange-500 text-white py-3 rounded"
          >
            {loading || imageUploading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
