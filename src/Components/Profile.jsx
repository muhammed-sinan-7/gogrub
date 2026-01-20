// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  MapPin,
  ShoppingCart,
  Heart,
  Package,
  User,
} from "lucide-react";
import { ENDPOINTS } from "../api/endpoints";
import api from "../api/axios";
import Navbar from "./Navbar/Navbar";

function Profile() {
  const { logout } = useUser();
  const [profileData, setProfileData] = useState(null); // Stores user, orders, and stats
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(ENDPOINTS.ME); // Points to your ProfileAPIView
        setProfileData(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileData) return null;

  const { user, orders, stats, last_address } = profileData;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Top: User info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-500 text-white text-2xl font-semibold">
                {user.fullname?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {user.fullname}
                </h1>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/cart")}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <ShoppingCart className="w-4 h-4" /> Cart
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-slate-900 text-white hover:bg-black"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            {/* Last Known Address (Removed Input Area) */}
            

            {/* Real Stats Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total orders</span>
                  <span className="font-bold text-slate-900">
                    {stats.total_orders}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total spent</span>
                  <span className="font-bold text-orange-600 text-lg">
                    ₹{stats.total_spent.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Orders
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-slate-500 mb-4">
                  No orders placed yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* 1. Order Header: ID, Date, and Status */}
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          Order ID:
                        </span>
                        <span className="text-sm font-mono font-medium text-slate-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xs text-slate-500">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                            order.payment_status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                    </div>

                    {/* 2. List of ALL Products in this order */}
                    <div className="divide-y divide-slate-50">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-md bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                            <img
                              src={
                                item.product_image ||
                                "https://via.placeholder.com/150"
                              }
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-900 truncate">
                              {item.product_name}
                            </h4>
                            <p className="text-xs text-slate-500">
                              Qty: {item.quantity} × ₹
                              {parseFloat(item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 3. Order Footer: Total Price */}
                    <div className="bg-white px-4 py-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">
                        Total Amount Paid
                      </span>
                      <p className="text-lg font-black text-slate-900">
                        ₹{parseFloat(order.total_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
