// GoogleLogin.jsx
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios"; // ✅ use central api client

export default function GoogleAuth() {
  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;

    try {
      const res = await api.post("/auth/google/", {
        id_token: idToken,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      console.log("Login Success:", res.data);
    } catch (err) {
      console.error("Login failed", err.response?.data || err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
}
