// GoogleLogin.jsx
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function GoogleAuth() {
  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;

    try {
      const res = await axios.post("http://localhost:8000/api/auth/google/", {
        id_token: idToken,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      console.log("Login Success:", res.data);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
}
