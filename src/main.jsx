import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./Context/UserContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <GoogleOAuthProvider clientId="1031550755159-jq69p2tggnha8fg75f2ca1gubcp6vcj4.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
