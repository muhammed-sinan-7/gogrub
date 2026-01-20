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
  ArrowRight,
  Building2,
  ShoppingBag,
} from "lucide-react";

// ✅ FIX: Define the Input component OUTSIDE the main component
// This prevents the "lose focus after one character" bug.
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
        className={`
          w-full h-14 pl-12 pr-4 rounded-2xl text-sm font-medium
          border-2 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50
          transition-all duration-200 bg-white
          ${
            error
              ? "border-red-300 shadow-red-100/50 bg-red-50/30"
              : "border-gray-200 hover:border-gray-300 shadow-sm"
          }
        `}
      />
    </div>
  </div>
);

const Payment = () => {
  const { state: contextState, clearCart } = useUser();
  const { cart, user } = contextState;
  const navigate = useNavigate();
  const { state: locationState } = useLocation();

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

  const productFromBuyNow = locationState?.product || null;
  const orderItems = productFromBuyNow ? [productFromBuyNow] : cart;
  const subtotal = orderItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
    0
  );
  const total = subtotal;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      const existing = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existing) existing.remove();
    };
  }, []);

  const validateRequired = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Name required";
    if (!phone.trim()) newErrors.phone = "Phone required";
    if (!street.trim()) newErrors.street = "Address required";
    if (!city.trim()) newErrors.city = "City required";
    if (!zip.trim()) newErrors.zip = "PIN required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateRequired()) return;
    setLoading(true);
    setErrors({});

    try {
      const orderData = {
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
        orderData.product_id = productFromBuyNow.id;
        orderData.quantity = productFromBuyNow.quantity;
      }

      const response = await api.post("/orders/create/", orderData);

      if (response.data.errors) {
        setErrors(response.data.errors);
        setLoading(false);
        return;
      }

      if (response.data.cod) {
        if (!productFromBuyNow) {
          await clearCart();
        }
        setSuccess(true);
        return;
      }

      const options = {
        key: response.data.razorpay_key,
        amount: response.data.amount,
        currency: response.data.currency,
        name: response.data.name || "Your Store",
        order_id: response.data.razorpay_order_id,
        prefill: {
          name: fullName,
          contact: phone,
          email: user?.email || "",
        },
        theme: { color: "#F97316" },
        handler: async (razorpayResponse) => {
          try {
            await api.post("/orders/verify-payment/", {
              order_id: response.data.order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });
            if (!productFromBuyNow) {
              await clearCart();
            }
            setSuccess(true);
          } catch (error) {
            alert("Payment verification failed");
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.error || "Order failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl max-w-lg w-full text-center border border-emerald-200"
        >
          <div className="w-28 h-28 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 p-6">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Your order is confirmed. Track it in your profile.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold"
            >
              Track My Order
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full border-2 border-gray-200 py-4 rounded-2xl font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12 lg:px-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="lg:flex lg:divide-x lg:divide-gray-100">
            <div className="flex-1 p-8 lg:p-12">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black text-gray-900">
                    Complete Order
                  </h1>
                  <p className="text-gray-600 mt-2">100% Secure Checkout</p>
                </div>
                <div className="flex items-center bg-gray-100/80 p-2 rounded-2xl">
                  <div
                    className={`px-4 py-2 rounded-xl font-semibold text-sm ${
                      step === 1 ? "bg-orange-500 text-white" : "text-gray-500"
                    }`}
                  >
                    1. Address
                  </div>
                  <div
                    className={`px-4 py-2 rounded-xl font-semibold text-sm ${
                      step === 2 ? "bg-orange-500 text-white" : "text-gray-500"
                    }`}
                  >
                    2. Payment
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        name="fullName"
                        icon={ShieldCheck}
                        placeholder="John Doe"
                        error={errors.fullName}
                      />
                      <Input
                        label="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        name="phone"
                        icon={Smartphone}
                        placeholder="9876543210"
                        maxLength={10}
                        error={errors.phone}
                      />
                    </div>
                    <Input
                      label="Full Address"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      name="street"
                      icon={MapPin}
                      placeholder="House, Street, Area, Landmark"
                      error={errors.street}
                    />
                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        name="city"
                        icon={Building2}
                        placeholder="Mumbai"
                        error={errors.city}
                      />
                      <Input
                        label="PIN Code"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        name="zip"
                        icon={Truck}
                        placeholder="400001"
                        maxLength={6}
                        error={errors.zip}
                      />
                    </div>
                    <button
                      onClick={() => validateRequired() && setStep(2)}
                      className="w-full h-14 bg-orange-500 text-white rounded-2xl font-bold text-lg"
                    >
                      Continue to Payment
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 text-orange-600 font-bold text-sm"
                    >
                      <ChevronLeft size={18} /> Edit Address
                    </button>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                      <button
                        onClick={() => setMethod("razorpay")}
                        className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 ${
                          method === "razorpay"
                            ? "border-orange-400 bg-orange-50"
                            : "border-gray-200"
                        }`}
                      >
                        <CreditCard
                          size={28}
                          className={
                            method === "razorpay"
                              ? "text-orange-600"
                              : "text-gray-400"
                          }
                        />
                        <span className="font-bold">Razorpay</span>
                      </button>
                      <button
                        onClick={() => setMethod("cod")}
                        className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 ${
                          method === "cod"
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-gray-200"
                        }`}
                      >
                        <Truck
                          size={28}
                          className={
                            method === "cod"
                              ? "text-emerald-600"
                              : "text-gray-400"
                          }
                        />
                        <span className="font-bold">Cash on Delivery</span>
                      </button>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-full h-14 bg-orange-600 text-white rounded-2xl font-bold text-lg"
                    >
                      {loading
                        ? "Processing..."
                        : `Place Order • ₹${total.toLocaleString()}`}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SUMMARY SECTION */}
            <div className="lg:w-96 p-8 bg-orange-50/30">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-orange-200/50">
                <ShoppingBag className="text-orange-600" size={24} />
                <h2 className="text-2xl font-black text-gray-900">Summary</h2>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto mb-8 pr-2">
                {orderItems.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100"
                  >
                    <img
                      src={
                        item.product_image || item.img_url || "/placeholder.jpg"
                      }
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity || 1}
                      </p>
                      <p className="text-sm font-bold text-orange-600">
                        ₹
                        {(
                          Number(item.price) * Number(item.quantity || 1)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-orange-100">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600 text-2xl">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
