// src/pages/Payment.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  ChevronLeft,
  Truck,
  CheckCircle,
  Smartphone,
  Building2,
  ShoppingBag,
} from "lucide-react";

/* ===================== INPUT COMPONENT ===================== */
const Input = ({
  label,
  value,
  onChange,
  name,
  placeholder,
  icon: Icon,
  maxLength,
  error,
}) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
        {label}
      </label>
      {error && (
        <span className="text-xs font-semibold text-red-500 px-2 py-1 bg-red-50 rounded">
          {error}
        </span>
      )}
    </div>
    <div className="relative">
      <Icon
        size={18}
        className={`absolute left-3 top-1/2 -translate-y-1/2 ${
          error ? "text-red-500" : "text-gray-400"
        }`}
      />
      <input
        type="text"
        name={name}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-14 pl-12 pr-4 rounded-2xl text-sm font-medium
        border-2 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50
        transition-all duration-200 bg-white ${
          error
            ? "border-red-300 shadow-red-100/50 bg-red-50/30"
            : "border-gray-200 hover:border-gray-300 shadow-sm"
        }`}
      />
    </div>
  </div>
);

/* ===================== MAIN COMPONENT ===================== */
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

  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("razorpay");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ===================== LOAD RAZORPAY ===================== */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => script.remove();
  }, []);

  /* ===================== VALIDATION ===================== */
  const validateRequired = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Name required";
    if (!phone.trim()) e.phone = "Phone required";
    if (!street.trim()) e.street = "Address required";
    if (!city.trim()) e.city = "City required";
    if (!zip.trim()) e.zip = "PIN required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ===================== PLACE ORDER ===================== */
  const handlePlaceOrder = async () => {
    if (!validateRequired()) return;

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        mode: productFromBuyNow ? "buy_now" : "cart",
        payment_method: method,
        address: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          street: street.trim(),
          city: city.trim(),
          zip: zip.trim(),
        },
      };

      if (productFromBuyNow) {
        payload.product_id = productFromBuyNow.id;
        payload.quantity = productFromBuyNow.quantity;
      }

      // ✅ CREATE ORDER (SOURCE OF TRUTH)
      const res = await api.post("api/orders/create/", payload);
      const orderId = res.data.order_id;

      /* ================= COD ================= */
      if (method === "cod") {
        if (!productFromBuyNow) await clearCart();
        setSuccess(true);
        return;
      }

      /* ================= RAZORPAY ================= */
      const razorpay = new window.Razorpay({
        key: res.data.razorpay_key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: res.data.name || "Your Store",
        order_id: res.data.razorpay_order_id,
        prefill: {
          name: fullName,
          contact: phone,
          email: user?.email || "",
        },
        theme: { color: "#F97316" },

        handler: async (rzp) => {
          try {
            await api.post("api/orders/verify-payment/", {
              order_id: orderId,
              razorpay_payment_id: rzp.razorpay_payment_id,
              razorpay_order_id: rzp.razorpay_order_id,
              razorpay_signature: rzp.razorpay_signature,
            });

            if (!productFromBuyNow) await clearCart();
            setSuccess(true);
          } catch (err) {
            alert("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            alert("Payment cancelled");
          },
        },
      });

      razorpay.open();
    } catch (err) {
      console.error("Order create failed:", err.response?.data);
      alert(
        err.response?.data?.error ||
          err.response?.data?.details ||
          "Order could not be placed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================== SUCCESS ===================== */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center">
          <CheckCircle size={80} className="mx-auto text-emerald-600" />
          <h1 className="text-3xl font-bold mt-6">Order Confirmed</h1>
          <p className="text-gray-600 mt-2">
            Your order has been placed successfully.
          </p>
          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full border py-3 rounded-xl font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-xl">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="address"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={ShieldCheck}
                error={errors.fullName}
              />
              <Input
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={Smartphone}
                error={errors.phone}
              />
              <Input
                label="Address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                icon={MapPin}
                error={errors.street}
              />
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                icon={Building2}
                error={errors.city}
              />
              <Input
                label="PIN"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                icon={Truck}
                error={errors.zip}
              />
              <button
                onClick={() => validateRequired() && setStep(2)}
                className="w-full mt-6 bg-orange-500 text-white py-3 rounded-xl font-bold"
              >
                Continue
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => setStep(1)}
                className="text-orange-600 mb-4 flex items-center gap-2"
              >
                <ChevronLeft size={16} /> Edit Address
              </button>

              <div className="space-y-3">
                <button
                  onClick={() => setMethod("razorpay")}
                  className={`w-full p-4 border rounded-xl ${
                    method === "razorpay"
                      ? "border-orange-400 bg-orange-50"
                      : ""
                  }`}
                >
                  Razorpay
                </button>
                <button
                  onClick={() => setMethod("cod")}
                  className={`w-full p-4 border rounded-xl ${
                    method === "cod" ? "border-emerald-400 bg-emerald-50" : ""
                  }`}
                >
                  Cash on Delivery
                </button>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-6 bg-orange-600 text-white py-3 rounded-xl font-bold"
              >
                {loading ? "Processing..." : `Place Order ₹${total}`}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Payment;
