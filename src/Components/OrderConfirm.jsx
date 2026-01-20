import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderConfirmed() {
  const { order_id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
        >
          <CheckCircle size={80} className="text-green-500 mx-auto" />
        </motion.div>

        <h1 className="text-3xl font-black mt-6 text-gray-800">
          Order Confirmed!
        </h1>

        <p className="text-gray-600 mt-3 text-sm">
          Your payment was successful and your order has been placed.
        </p>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            Order ID
          </p>
          <div className="font-mono text-sm mt-2 text-gray-800 break-all">
            {order_id}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/profile?tab=orders")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
            <Package size={20} />
            View My Orders
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition"
          >
            Continue Shopping
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          A confirmation email has been sent to your registered email address.
        </p>
      </motion.div>
    </div>
  );
}
