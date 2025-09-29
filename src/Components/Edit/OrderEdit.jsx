// src/pages/EditOrder.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function EditOrder() {
  const { orderId } = useParams(); // 👈 comes as string
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          "https://gogrub-api-mock.onrender.com/users"
        );

        let foundOrder = null;
        res.data.forEach((user) => {
          user.orders?.forEach((o) => {
            console.log("Checking order:", o.id, "for user:", user.name);
            if (String(o.id) === String(orderId)) {
              foundOrder = { ...o, customer: user.name, userId: user.id };
            }
          });
        });

        if (!foundOrder) {
          setError("Order not found");
        } else {
          setOrder(foundOrder);
        }
      } catch (err) {
        console.error("API request failed:", err); // 👈 log full error
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded bg-white">
      <h2 className="text-xl font-bold mb-4">Edit Order Status</h2>
      <p>
        <strong>Customer:</strong> {order.customer}
      </p>
      <p>
        <strong>Order ID:</strong> {order.id}
      </p>
      <p>
        <strong>Current Status:</strong> {order.status}
      </p>

      {/* Update Status */}
      <select
        value={order.status}
        onChange={(e) => setOrder({ ...order, status: e.target.value })}
        className="mt-3 border p-2 rounded w-full"
      >
        <option value="pending">Pending</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="canceled">Canceled</option>
        <option value="delayed">Delayed</option>
      </select>

      <button
        onClick={async () => {
          try {
            // ✅ Fetch the correct user first
            const userRes = await axios.get(
              `https://gogrub-api-mock.onrender.com/users/${order.userId}`
            );

            // ✅ Update the right order inside that user
            const updatedOrders = userRes.data.orders.map((o) =>
              String(o.id) === String(order.id)
                ? { ...o, status: order.status }
                : o
            );

            await axios.patch(
              `https://gogrub-api-mock.onrender.com/users/${order.userId}`,
              { orders: updatedOrders }
            );

            alert("Order status updated successfully!");
          } catch (err) {
            alert("Failed to update order");
          }
        }}
        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        Update Status
      </button>
    </div>
  );
}

export default EditOrder;
