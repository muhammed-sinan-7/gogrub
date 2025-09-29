import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function AddProduct() {
  const [name, setName] = useState("");
  const [category, setCategory] = "";
  const [est, setEst] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [img_url, setImg_url] = useState("");
    const navigate = useNavigate()
  const addProduct = async () => {
    const newProduct = { name, category, est, desc, price, img_url };
    try {
      const res = axios.post(
        "https://gogrub-api-mock.onrender.com/product",
        newProduct
      );
      alert("Product added succesfully")
      navigate('/admin')
    } finally {
      console.log("Done");
    }
  };

  return (
    <div>
      <form
        onSubmit={addProduct}
        className="max-w-xl mx-auto bg-white shadow-md rounded p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e)=> setName(e.target.value)}
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
             value={category}
            onChange={(e)=> setCategory(e.target.value)}
            className="mt-1 block w-full border px-3 py-2 rounded"
            required
          />
        </div>

       

        {/* Estimated Time */}
        <div>
          <label className="block text-sm font-medium">Estimated Time</label>
          <input
            type="text"
            name="est_time"
             value={est}
            onChange={(e)=> setEst(e.target.value)}
            className="mt-1 block w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
             value={desc}
            onChange={(e)=> setDesc(e.target.value)}
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
             value={price}
            onChange={(e)=> setPrice(e.target.value)}
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
             value={img_url}
            onChange={(e)=> setImg_url(e.target.value)}
            
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
}

export default AddProduct;
