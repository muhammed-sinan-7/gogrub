import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Enter your email";
    if (!password.trim()) newErrors.password = "Enter your password";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First, validate the inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true); // Set loading to true before making the request

    try {
      const res = await axios.get(
        `http://localhost:3005/users?email=${email}&password=${password}`
      );

      if (res.data.length > 0) {
        const user = res.data[0];

        // Fetch full user data by ID to get cart + wishlist reliably
        const fullUser = await axios.get(
          `http://localhost:3005/users/${user.id}`
        );

        login(fullUser.data);
        alert("Login Successful");

        // Check user type and navigate accordingly
        if (fullUser.data.isAdmin === true) {
          console.log(fullUser.data.isAdmin)
          navigate("/admin"); // Navigate to admin dashboard
        } else {
          navigate("/"); // Navigate to home page
        }
      } else {
        setErrors({ general: "Invalid credentials" });
      }
    } catch (error) {
      setErrors({ general: "Something went wrong, please try again later" });
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <div className="flex-1 flex-col bg-orange-500 flex items-center pt-20 justify-evenly text-white">
      <div>
        <h2 className="relative bottom-6 register-head text-2xl">Login</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="reg-form relative bottom-18 flex flex-col mt-10 w-80"
      >
        {errors.general && (
          <p className="text-red-200 text-sm mb-2">{errors.general}</p>
        )}

        <div className="flex flex-col mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-2 border rounded text-black"
          />
          {errors.email && (
            <p className="text-red-200 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col mb-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-2 border rounded text-black"
          />
          {errors.password && (
            <p className="text-red-200 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="reg-button bg-white text-black h-13 w-40 cursor-pointer hover:bg-amber-200 rounded"
          >
            {loading ? "Logging in..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
