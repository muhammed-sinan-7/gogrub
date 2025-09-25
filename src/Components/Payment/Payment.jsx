import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import axios from "axios";

const Payment = () => {
  const { state: contextState, dispatch } = useUser();
  const { cart, user } = contextState;
  const navigate = useNavigate();
  const { state: locationState } = useLocation(); // 👈 to read passed product
  const { id } = useParams();

  const [method, setMethod] = useState("card");
  const [form, setForm] = useState({
    name: "",
    card: "",
    expiry: "",
    cvv: "",
  });

  const productFromBuyNow = locationState?.product || null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      method === "card" &&
      (!form.name || !form.card || !form.expiry || !form.cvv)
    ) {
      alert("Please fill all card details");
      return;
    }

    
    const order = {
      id: Date.now(),
      items: productFromBuyNow ? [productFromBuyNow] : cart,
      total: productFromBuyNow
        ? Number(productFromBuyNow.price) * Number(productFromBuyNow.quantity)
        : cart.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0
          ),
      method,
      date: new Date().toISOString(),
    };

    try {
      // Save order to user
      const updatedUser = {
        ...user,
        orders: [...(user.orders || []),{...order,  status: "Pending"}],
      };

      await axios.patch(`http://localhost:3005/users/${user.id}`, updatedUser);

      
      localStorage.setItem("activeUser", JSON.stringify(updatedUser));

      dispatch({ type: "SET_USER", payload: updatedUser });

      // if it's cart checkout, clear cart
      if (!productFromBuyNow) {
        dispatch({ type: "SET_CART", payload: [] });
      }

      alert(`Payment successful using ${method.toUpperCase()}!`);
      navigate("/");
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const total = productFromBuyNow
    ? Number(productFromBuyNow.price) * Number(productFromBuyNow.quantity)
    : cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Choose Payment Method</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                value="card"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              Card
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                value="cod"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                value="emi"
                checked={method === "emi"}
                onChange={() => setMethod("emi")}
              />
              EMI
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {method === "card" && (
            <>
              <div>
                <label className="block text-gray-700 mb-1">Name on Card</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  name="card"
                  value={form.card}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="MM/YY"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={form.cvv}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="123"
                  />
                </div>
              </div>
            </>
          )}

          {method === "cod" && (
            <p className="text-gray-600">
              You will pay <span className="font-semibold">₹{total}</span> in
              cash upon delivery.
            </p>
          )}

          <div className="flex justify-between items-center border-t pt-4 mt-6">
            <span className="text-lg font-semibold text-gray-900">
              Total: ₹{total}
            </span>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {method === "cod" ? "Place Order" : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
