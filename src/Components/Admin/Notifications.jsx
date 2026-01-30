import { ShieldCheck, AlertCircle } from "lucide-react";
import { useUser } from "../../Context/UserContext";

import { useEffect } from "react";

const AdminNotificationView = () => {
  // Initializes socket
  const { state } = useUser();
  const notifications = state.notifications;

  // Debug: Log when notifications change
  useEffect(() => {
    console.log("📊 Admin View - Notifications updated:", notifications.length);
  }, [notifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications/");
        dispatch({
          type: "CATIONS",
          payload: res.data,
        });
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-100">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-10 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-2 rounded-lg">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                ADMIN MONITOR
              </h1>
              <p className="text-slate-400 text-sm">
                System-wide real-time alerts
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
            <p className="text-green-400 flex items-center gap-2 justify-end">
              <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              Live ({notifications.length})
            </p>
          </div>
        </header>

        <div className="grid gap-3">
          {notifications.map((n, i) => (
            <div
              key={n.id || i}
              className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center justify-between hover:border-orange-500/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <AlertCircle
                  className={
                    n.title?.includes("Order")
                      ? "text-orange-500"
                      : "text-blue-400"
                  }
                />
                <div>
                  <h4 className="font-bold">{n.title}</h4>
                  <p className="text-sm text-slate-400">{n.message}</p>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded border border-slate-700">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600">
              No recent system activity detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationView;
