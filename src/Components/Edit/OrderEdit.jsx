// src/pages/EditOrder.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditOrder = () => {
  const { id } = useParams(); // order id
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [userId, setUserId] = useState(null); // to know which user owns this order
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          "https://gogrub-api-mock.onrender.com/users"
        );
        const users = res.data;

        let foundOrder = null;
        let foundUserId = null;

        // Find order and its user
        for (const user of users) {
          const userOrder = user.orders?.find((o) => o.id === id);
          if (userOrder) {
            foundOrder = userOrder;
            foundUserId = user.id;
            break;
          }
        }

        if (foundOrder) {
          setOrder(foundOrder);
          setUserId(foundUserId);
          setStatus(foundOrder.status);
        } else {
          alert("Order not found");
          navigate("/admin"); 
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!userId || !order) return;

    try {
      
      const res = await axios.get(
        `https://gogrub-api-mock.onrender.com/users/${userId}`
      );
      const user = res.data;

     
      const updatedOrders = user.orders.map((o) =>
        o.id === order.id ? { ...o, status } : o
      );

    
      await axios.patch(
        `https://gogrub-api-mock.onrender.com/users/${userId}`,
        {
          orders: updatedOrders,
        }
      );

      alert("Order status updated successfully!");
      navigate("/admin"); 
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Order - {order.id}</h2>

      <div className="mb-4">
        
        <p className="text-gray-700 mb-2">
          Product: {order.items.map((i) => i.name).join(", ")}
        </p>
        <p className="text-gray-700 mb-2">
          Total Amount: ₹
          {order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update Status
      </button>
    </div>
  );
};

export default EditOrder;
