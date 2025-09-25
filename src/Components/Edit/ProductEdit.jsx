import  { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    est_time: "",
    description: "",
    img_url: "",
    isSpecial: false,
    isStock: false,
  });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://gogrub-api-mock.onrender.com/product/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Update data on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://gogrub-api-mock.onrender.com/product/${id}`, formData);
      alert("Product updated!");
      navigate("/admin"); // optional: redirect after update
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white shadow-md rounded p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Update Product</h2>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Checkboxes */}
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isSpecial"
              checked={formData.isSpecial}
              onChange={handleChange}
              className="mr-2"
            />
            Special
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isStock"
              checked={formData.isStock}
              onChange={handleChange}
              className="mr-2"
            />
            In Stock
          </label>
        </div>

        {/* Estimated Time */}
        <div>
          <label className="block text-sm font-medium">Estimated Time</label>
          <input
            type="text"
            name="est_time"
            value={formData.est_time}
            onChange={handleChange}
            className="mt-1 block w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full border px-3 py-2 rounded"
            required
          ></textarea>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="url"
            name="img_url"
            value={formData.img_url}
            onChange={handleChange}
            className="mt-1 block w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Submit */}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
