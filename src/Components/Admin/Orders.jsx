// src/components/admin/OrderManagementView.jsx
import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const OrderManagementView = ({ users, onNavigate }) => {
  // Flatten all orders from all users into one array
  const allOrders = users.flatMap(user => 
    user.orders?.map(order => ({
      ...order,
      customerName: user.name,
      customerEmail: user.email,
      totalAmount: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    })) || []
  ).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest first

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 leading-tight">Order Fulfillment</h2>
        <p className="text-slate-500">Track and manage every customer transaction.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50/50">
            <tr>
              {["Order Info", "Customer", "Items", "Amount", "Status", "Action"].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allOrders.map((order, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Order #{order.id}</div>
                      <div className="text-[10px] text-slate-400 font-medium italic">Ordered recently</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-700">{order.customerName}</div>
                  <div className="text-xs text-slate-400">{order.customerEmail}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                </td>
                <td className="px-6 py-4 text-sm font-black text-slate-900">₹{order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${
                    order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                    order.status === "Shipped" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onNavigate(`/editorder/${order.id}`)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
                  >
                    Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagementView;