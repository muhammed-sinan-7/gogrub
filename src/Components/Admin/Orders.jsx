import React, { useState, useEffect } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import api from "../../api/axios";

const OrderManagementView = ({ orders = [], onNavigate }) => {
  const [allOrders, setAllOrders] = useState([]);

  // Sync props → local state
  useEffect(() => {
    setAllOrders(orders);
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    const previousOrders = [...allOrders];

    // Optimistic UI update
    setAllOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, order_status: newStatus }
          : order
      )
    );

    try {
      await api.patch(`/admin/orders/${orderId}/update-status/`, {
        status: newStatus,
      });
    } catch (error) {
      console.error(error);
      setAllOrders(previousOrders);
      alert("Server error: Could not update order status.");
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 leading-tight">
          Order Fulfillment
        </h2>
        <p className="text-slate-500">
          Track and manage every customer transaction.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50/50">
            <tr>
              {["Order Info", "Customer", "Amount", "Order Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {allOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {/* Order Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        #{order.order_id}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium italic">
                        {order.created_at}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-700">
                    {order.customer_email}
                  </div>
                  <div className="text-xs text-slate-400">
                    {order.customer_name}
                  </div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4 text-sm font-black text-slate-900">
                  ₹{order.price}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <select
                    value={order.order_status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className={`px-3 py-1 text-[11px] font-bold rounded-full border-none outline-none cursor-pointer appearance-none ${
                      order.order_status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : order.order_status === "shipped"
                        ? "bg-indigo-100 text-indigo-700"
                        : order.order_status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                {/* Action */}
                
              </tr>
            ))}

            {allOrders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-slate-400 font-semibold"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagementView;
