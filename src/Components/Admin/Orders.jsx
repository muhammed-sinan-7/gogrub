import React, { useState, useEffect } from "react";
import { ShoppingBag, Eye, X } from "lucide-react";
import api from "../../api/axios";

const OrderManagementView = ({ orders = [], onNavigate }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Normalize incoming orders (functional safety only)
  useEffect(() => {
    setAllOrders(
      orders.map((order) => ({
        ...order,
        items: order.items || [],
      })),
    );
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
  // Store previous states for rollback if the API fails
  const previousOrders = [...allOrders];
  const previousSelected = selectedOrder ? { ...selectedOrder } : null;

  // 1. INSTANT UI UPDATE (Optimistic)
  // Update the main table list
  setAllOrders((prev) =>
    prev.map((order) =>
      order.order_id === orderId ? { ...order, order_status: newStatus } : order
    )
  );

  // Update the pop-up/modal if it's currently showing this order
  if (selectedOrder && selectedOrder.id === orderId) {
    setSelectedOrder((prev) => ({ ...prev, order_status: newStatus }));
  }

  try {
    // 2. BACKEND UPDATE
    await api.patch(`/admin/orders/${orderId}/update-status/`, {
      status: newStatus,
    });
    
    // Optional: You could trigger a small "Saved" toast here
  } catch (error) {
    console.error("Update failed:", error.response?.data || error.message);
    
    // 3. ROLLBACK ON ERROR
    setAllOrders(previousOrders);
    setSelectedOrder(previousSelected);
    alert("Server error: Could not update status. Reverting change.");
  }
};

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
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
              {["Order Info", "Customer", "Amount", "Status", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {allOrders.map((order) => (
              <tr
                key={order.order_id}
                className="hover:bg-slate-50/50 transition-colors"
              >
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

                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-700">
                    {order.customer_email}
                  </div>
                  <div className="text-xs text-slate-400">
                    {order.customer_name}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm font-black text-slate-900">
                  ₹{order.price}
                </td>

                <td className="px-6 py-4">
                  <select
                    value={order.order_status}
                    onChange={(e) =>
                      handleStatusChange(order.order_id, e.target.value)
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

                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">
                Order Details #{selectedOrder.order_id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                    Customer
                  </p>
                  <p className="font-semibold text-slate-800">
                    {selectedOrder.customer_name}
                  </p>
                  <p className="text-slate-500">
                    {selectedOrder.customer_email}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                    Date
                  </p>
                  <p className="font-semibold text-slate-800">
                    {selectedOrder.created_at}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 uppercase text-[10px] font-bold tracking-widest mb-3">
                  Items Ordered
                </p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                          <ShoppingBag size={18} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-900">
                        ₹{Number(item.price) * item.quantity}
                      </p>
                    </div>
                  ))}

                  {!selectedOrder.items.length && (
                    <p className="text-slate-400 italic">
                      No item details available.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">
                  Total Paid
                </span>
                <span className="text-2xl font-black text-blue-600">
                  ₹{selectedOrder.price}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementView;
