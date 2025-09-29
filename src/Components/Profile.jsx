import React, { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { LogOut, MapPin } from "lucide-react";
import axios from "axios";

function Profile() {
  const { state, logout } = useUser();
  const { user } = state;
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [savedAddress, setSavedAddress] = useState("");
  const [orders, setOrders] = useState([]); // ✅ local state for fresh orders

  // Load saved address
  useEffect(() => {
    const storedAddress = localStorage.getItem("deliveryAddress");
    if (storedAddress) {
      setSavedAddress(storedAddress);
    }
  }, []);

  // ✅ Fetch latest user data from API so orders stay updated
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `https://gogrub-api-mock.onrender.com/users/${user.id}`
        );
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch user orders:", err);
      }
    };
    fetchUserOrders();
  }, [user]);

  const handleSaveAddress = () => {
    if (address.trim() === "") return;
    localStorage.setItem("deliveryAddress", address);
    setSavedAddress(address);
    setAddress("");
  };

  if (!user) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <h2 className="text-3xl font-bold text-gray-800">
          You are not logged in
        </h2>
        <p className="text-gray-600 mt-2">
          Login to view your profile and orders.
        </p>
        <button
          onClick={() => navigate("/signup?form=login")}
          className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl shadow hover:bg-orange-600 transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white shadow-md rounded-2xl p-6 mb-8 border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center text-3xl font-bold rounded-full shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-6 sm:mt-0 flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition shadow-sm"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
          <MapPin className="h-5 w-5 text-orange-500" />
          Delivery Address
        </h3>
        {savedAddress ? (
          <p className="mb-4 text-gray-700 bg-orange-50 p-4 rounded-xl border border-orange-100">
            {savedAddress}
          </p>
        ) : (
          <p className="mb-4 text-gray-500 italic">No address saved yet.</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter new delivery address"
            className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <button
            onClick={handleSaveAddress}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition shadow"
          >
            Save
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <h3 className="text-xl font-semibold mb-3 text-gray-800">My Orders</h3>
      {orders && orders.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl p-4 bg-white shadow hover:shadow-md transition text-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-500 font-mono text-xs">#{order.id}</p>
                <span
                  className={`px-2.5 py-1 text-xs rounded-full font-medium
                    ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Delayed"
                        ? "bg-orange-100 text-orange-700"
                        : order.status === "Canceled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border-b last:border-0 pb-2"
                  >
                    <img
                      src={item.img_url}
                      alt={item.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-gray-500 text-xs">
                        {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-xs text-gray-600">
                <span>{order.method}</span>
                <span className="font-medium">₹{order.total}</span>
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
