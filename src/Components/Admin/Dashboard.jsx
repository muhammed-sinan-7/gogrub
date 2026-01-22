import React from "react";
import { IndianRupee, Users, Package, ShoppingCart } from "lucide-react";
import StatCard from "./StatCard";

const DashboardView = ({ stats, recentOrders }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Revenue"
        value={`₹${stats.revenue}`}
        subtext="Paid transactions"
        icon={IndianRupee}
        colorClass="text-emerald-600"
        bgClass="bg-emerald-50"
      />
      <StatCard
        label="Total Users"
        value={stats.users}
        subtext={`${stats.activeUsers} active now`}
        icon={Users}
        colorClass="text-indigo-600"
        bgClass="bg-indigo-50"
      />
      <StatCard
        label="Products"
        value={stats.products}
        subtext="Total menu items"
        icon={Package}
        colorClass="text-violet-600"
        bgClass="bg-violet-50"
      />
      
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">
          Recent Transactions
        </h3>
      </div>
      <table className="w-full">
        <thead className="bg-slate-50/50">
          <tr>
            {["Order ID", "Customer", "Product", "Amount", "Status"].map(
              (h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {recentOrders.slice(0, 5).map(
            (
              order,
              i, // Only show top 5
            ) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-sm font-semibold">
                  #{order.order_id}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div>{order.customer_name}</div>
                  <div className="text-[10px] text-slate-400">
                    {order.customer_email}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {order.product_name}
                </td>
                <td className="px-6 py-4 text-sm font-bold">₹{order.price}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      order.order_status
                    }`}
                  >
                    {order.order_status?.toUpperCase()}
                  </span>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DashboardView;
