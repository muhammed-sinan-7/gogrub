// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

function Profile() {
  const { state, logout } = useUser();
  const { user } = state;
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [savedAddress, setSavedAddress] = useState("");

  // Load saved address from localStorage
  useEffect(() => {
    const storedAddress = localStorage.getItem("deliveryAddress");
    if (storedAddress) {
      setSavedAddress(storedAddress);
    }
  }, []);

  // Save address to localStorage
  const handleSaveAddress = () => {
    if (address.trim() === "") return;
    localStorage.setItem("deliveryAddress", address);
    setSavedAddress(address);
    setAddress("");
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">You are not logged in</h2>
        <button
          onClick={() => navigate("/signup?form=login")}
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ✅ Delivery Address Display */}
      {savedAddress && (
        <div className="mb-6 p-4 border rounded-lg bg-orange-50">
          <h3 className="text-lg font-semibold text-orange-700">
            Delivery Address:
          </h3>
          <p className="text-gray-700">{savedAddress}</p>
        </div>
      )}

      {/* Profile Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-orange-500 text-white flex items-center justify-center text-2xl font-bold rounded-full">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {/* ✅ Delivery Address Input */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">
          Add/Update Delivery Address
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery location"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={handleSaveAddress}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Save
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <h3 className="text-xl font-semibold mb-3">My Orders</h3>
      {user.orders && user.orders.length > 0 ? (
        <div className="space-y-4">
          {user.orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-500">
                  Order ID: <span className="font-mono">{order.id}</span>
                </p>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Shipped"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b last:border-0 py-2"
                  >
                    <img
                      src={item.img_url}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-sm text-gray-600">
                <span>Payment: {order.method}</span>
                <span>Total: ₹{order.total}</span>
                <span>
                  {new Date(order.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No orders yet.</p>
      )}
    </div>
  );
}

export default Profile;
