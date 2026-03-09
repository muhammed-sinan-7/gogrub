// src/pages/Payment.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import api from "../../api/axios";
import { motion } from "framer-motion";
import {
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Smartphone,
  Building2,
  ShoppingBag,
} from "lucide-react";

const Payment = () => {
  const { state, clearCart } = useUser();
  const { cart, user } = state;

  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const productFromBuyNow = locationState?.product || null;
  const orderItems = productFromBuyNow ? [productFromBuyNow] : cart;

  const subtotal = orderItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
    0
  );

  const total = subtotal;

  const [fullName, setFullName] = useState(user?.fullname || "");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const [method, setMethod] = useState("razorpay");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* Razorpay Script */
  useEffect(() => {
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* Validation */
  const validate = () => {
    const e = {};

    if (!fullName.trim()) e.fullName = "Name required";
    if (!phone.trim()) e.phone = "Phone required";
    if (!street.trim()) e.street = "Address required";
    if (!city.trim()) e.city = "City required";
    if (!zip.trim()) e.zip = "PIN required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* Place Order */
  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        mode: productFromBuyNow ? "buy_now" : "cart",
        payment_method: method,
        address: {
          fullName,
          phone,
          street,
          city,
          zip,
        },
      };

      if (productFromBuyNow) {
        payload.product_id = productFromBuyNow.id;
        payload.quantity = productFromBuyNow.quantity;
      }

      const res = await api.post("/api/orders/create/", payload);

      const orderId = res.data.order_id;

      /* COD */
      if (method === "cod") {
        if (!productFromBuyNow) await clearCart();
        setSuccess(true);
        return;
      }

      /* Razorpay */
      const razorpay = new window.Razorpay({
        key: res.data.razorpay_key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "GoGrub",
        order_id: res.data.razorpay_order_id,
        theme: { color: "#f97316" },

        handler: async (rzp) => {
          await api.post("/api/orders/verify-payment/", {
            order_id: orderId,
            razorpay_payment_id: rzp.razorpay_payment_id,
            razorpay_order_id: rzp.razorpay_order_id,
            razorpay_signature: rzp.razorpay_signature,
          });

          if (!productFromBuyNow) await clearCart();
          setSuccess(true);
        },
      });

      razorpay.open();
    } catch (err) {
      alert(err.response?.data?.error || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  /* Success Screen */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center">
          <CheckCircle size={80} className="mx-auto text-emerald-600" />
          <h1 className="text-3xl font-bold mt-6">Order Confirmed</h1>
          <p className="text-gray-600 mt-2">
            Your order has been placed successfully.
          </p>

          <button
            onClick={() => navigate("/profile")}
            className="mt-6 bg-emerald-600 text-white px-8 py-3 rounded-xl"
          >
            Track Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">

        {/* Address Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-md"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MapPin size={20}/> Shipping Address
          </h2>

          <div className="space-y-4">
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e)=>setFullName(e.target.value)}
              className="input"
            />

            <input
              placeholder="Phone"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              className="input"
            />

            <input
              placeholder="Street Address"
              value={street}
              onChange={(e)=>setStreet(e.target.value)}
              className="input"
            />

            <input
              placeholder="City"
              value={city}
              onChange={(e)=>setCity(e.target.value)}
              className="input"
            />

            <input
              placeholder="ZIP"
              value={zip}
              onChange={(e)=>setZip(e.target.value)}
              className="input"
            />
          </div>

          {/* Payment Method */}
          <div className="mt-8">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard size={18}/> Payment Method
            </h3>

            <div className="flex gap-3">
              <button
                onClick={()=>setMethod("razorpay")}
                className={`paymentBtn ${
                  method==="razorpay" && "paymentActive"
                }`}
              >
                Razorpay
              </button>

              <button
                onClick={()=>setMethod("cod")}
                className={`paymentBtn ${
                  method==="cod" && "paymentActive"
                }`}
              >
                Cash on Delivery
              </button>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full mt-8 bg-orange-600 text-white py-4 rounded-xl font-bold"
          >
            {loading ? "Processing..." : `Place Order ₹${total}`}
          </button>
        </motion.div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-md h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ShoppingBag size={20}/> Order Summary
          </h2>

          <div className="space-y-4">
            {orderItems.map((item)=>(
              <div
                key={item.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty {item.quantity || 1}
                  </p>
                </div>

                <span className="font-semibold">
                  ₹{item.price * (item.quantity || 1)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;