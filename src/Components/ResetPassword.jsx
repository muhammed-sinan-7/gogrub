import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { ENDPOINTS } from "../api/endpoints";

function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await api.post(ENDPOINTS.CONFIRM_PASSWORD, {
        uid: uid,
        token: token,
        new_password: password
      });
      toast.success("Password updated! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error("This link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold"><span className="text-orange-500">G</span>o<span className="text-orange-500">G</span>rub.</h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">New Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="password" placeholder="New Password" required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input 
            type="password" placeholder="Confirm Password" required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg">
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;