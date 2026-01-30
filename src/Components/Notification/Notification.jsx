import React, { useEffect } from "react";
import { Bell, Package, Tag, Clock } from "lucide-react";
import { useUser } from "../../Context/UserContext";

import Navbar from "../Navbar/Navbar";

const UserNotificationView = () => {
  // Initializes WebSocket (idempotent)


  const { state } = useUser();
  const notifications = state.notifications ?? [];

  // 🔍 Debug – confirms real-time updates
  useEffect(() => {
    console.log(
      "📬 Notifications updated:",
      notifications.length,
      notifications
    );
  }, [notifications]);

  return (
    <div>
      <Navbar/>
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
          <Bell className="text-orange-500" fill="currentColor" />
          Notifications
        </h1>

        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
          {notifications.length} New
        </span>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p>Your inbox is empty</p>
          </div>
        ) : (
          notifications.map((n, index) => {
            const isPrice = n?.title?.toLowerCase().includes("price");

            return (
              <div
                key={n?.id ?? `${index}-${n?.created_at}`}
                className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  {isPrice ? (
                    <Tag className="text-green-500" size={20} />
                  ) : (
                    <Package className="text-orange-500" size={20} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900">
                      {n?.title ?? "Notification"}
                    </h3>

                    {n?.created_at && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock size={12} />
                        {new Date(n.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {n?.message ?? ""}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
    </div>

  );
};

export default UserNotificationView;
