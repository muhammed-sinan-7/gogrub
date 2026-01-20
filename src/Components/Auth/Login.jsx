import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await api.post(ENDPOINTS.LOGIN, {
        email,
        password,
      });

      login(response.data);
      response.data.user?.is_staff
        ? navigate("/admin")
        : navigate("/");

      toast.success("Login Successful");
    } catch (error) {
      const formattedErrors = {};
      const backendErrors = error.response?.data;

      if (backendErrors) {
        // 🔹 Handle non-field errors (invalid credentials)
        if (backendErrors.non_field_errors) {
          formattedErrors.general = backendErrors.non_field_errors[0];
        }

        // 🔹 Handle field errors
        Object.keys(backendErrors).forEach((key) => {
          if (key !== "non_field_errors") {
            formattedErrors[key] = Array.isArray(backendErrors[key])
              ? backendErrors[key][0]
              : backendErrors[key];
          }
        });
      }

      setErrors(formattedErrors);
      toast.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post(ENDPOINTS.GOOGLE_LOGIN, {
        id_token: credentialResponse.credential,
      });

      login(res.data);
      res.data.user?.is_staff
        ? navigate("/admin")
        : navigate("/");

      toast.success("Google Login Successful");
    } catch (err) {
      toast.error("Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-[#000000] items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold text-white leading-tight">
            <span className="text-orange-500">G</span>o
            <span className="text-orange-500">G</span>rub.
          </h1>
          <p className="text-gray-400 mt-6 text-xl">
            Premium food delivery, <br />
            refined for your lifestyle.
          </p>
          <div className="mt-12 h-1.5 w-24 bg-orange-500"></div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-bold">
              <span className="text-orange-500">G</span>o
              <span className="text-orange-500">G</span>rub.
            </h1>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-black tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-500 mt-2">
              Please enter your details to sign in.
            </p>
          </div>

          {/* 🔹 GENERAL ERROR */}
          {errors.general && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-orange-500 focus:bg-white outline-none transition-all text-black"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-black uppercase tracking-wide">
                  Password
                </label>
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-bold text-orange-500 cursor-pointer"
                >
                  Forgot?
                </span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-orange-500 focus:bg-white outline-none transition-all text-black"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white font-bold rounded-xl disabled:bg-gray-400"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login Failed")}
              />
            </div>
          </form>
          <p className="mt-10 text-center text-gray-600 font-medium">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-orange-500 font-bold hover:underline underline-offset-4"
            >
              Join GoGrub
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
