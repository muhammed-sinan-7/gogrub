import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-hot-toast";

function Signup() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await api.post(ENDPOINTS.REGISTER, {
        fullname,
        email,
        phone,
        password,
        confirm_password,
      });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      const formattedErrors = {};
      const backendErrors = error.response?.data;

      if (backendErrors) {
        // 🔹 Handle non-field errors (if any)
        if (backendErrors.non_field_errors) {
          formattedErrors.general = backendErrors.non_field_errors[0];
        }

        // 🔹 Handle field-level errors
        Object.keys(backendErrors).forEach((key) => {
          if (key !== "non_field_errors") {
            formattedErrors[key] = Array.isArray(backendErrors[key])
              ? backendErrors[key][0]
              : backendErrors[key];
          }
        });
      }

      setErrors(formattedErrors);
      toast.error("Please fix errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* FORM SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-lg">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-8">
              <span className="text-orange-500">G</span>o
              <span className="text-orange-500">G</span>rub.
            </h1>
            <h2 className="text-4xl font-extrabold text-black tracking-tight">
              Create your account
            </h2>
            <p className="text-gray-500 mt-2">
              Start your journey with us today.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-orange-500 outline-none transition-all text-black"
                placeholder="John Doe"
              />
              {errors.fullname && (
                <p className="text-red-500 text-[11px] mt-1 font-bold">
                  {errors.fullname}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-orange-500 outline-none transition-all text-black"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-[11px] mt-1 font-bold">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wider">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-orange-500 outline-none transition-all text-black"
                placeholder="+123456789"
              />
              {errors.phone && (
                <p className="text-red-500 text-[11px] mt-1 font-bold">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-orange-500 outline-none transition-all text-black"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-[11px] font-bold mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wider">
                Confirm
              </label>
              <input
                type="password"
                value={confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-orange-500 outline-none transition-all text-black"
                placeholder="••••••••"
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-[11px] font-bold mt-1">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-orange-500 text-black font-bold text-lg rounded-xl hover:bg-black hover:text-white transition-all transform active:scale-[0.98]"
              >
                {loading ? "Creating account..." : "Get Started"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-gray-600 font-medium">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-orange-500 font-bold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>

      {/* BRAND SIDE */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-12 border-l border-gray-100">
        <div className="text-center">
          <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto mb-8 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">G</span>
          </div>
          <h3 className="text-2xl font-bold text-black">
            Join GoGrub Today
          </h3>
          <p className="text-gray-400 mt-2 max-w-xs mx-auto font-medium">
            Access over 500+ local restaurants and get exclusive member-only
            grubs.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
