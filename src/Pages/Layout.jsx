import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";

const Layout = () => {
  const location = useLocation();

  // hide navbar on login, signup, admin
  const hideNavbarRoutes = ["/login", "/signup", "/admin"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <Outlet />
    </div>
  );
};

export default Layout;