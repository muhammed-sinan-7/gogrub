import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./Pages/Home";

import Category from "./Components/Category/Category";
import AllProducts from "./Components/All/AllProducts";
import Cart from "./Components/Cart/Cart";
import Product from "./Components/Product/Product";
import { useEffect, useState } from "react";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import Payment from "./Components/Payment/Payment";
import Wishlist from "./Components/Wishlist/wishlist";
import UserNotifications from "./Components/Notification/Notification";
import AdminNotificationPanel from "./Components/Admin/Notifications";
import ProductEdit from "./Components/Edit/ProductEdit";
import OrderConfirmed from "./Components/OrderConfirm";
import Profile from "./Components/Profile";
import AddProduct from "./Components/Admin/AddProduct";
import EditOrder from "./Components/Edit/OrderEdit";
import ForgotPassword from "./Components/ForgotPassword";
import { Toaster } from 'react-hot-toast';
import ResetPassword from "./Components/ResetPassword";
import AdminPanel from "./Components/Admin/AdminPanel";
import ProductDetailView from "./Components/Admin/ProductDetail";
import Chatbot from "./Components/Chat/Chatbot";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("activeUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <>
    <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment/" element={<Payment />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/product" element={<AdminPanel />} />
        <Route path="/admin/product/:id" element={<ProductDetailView />} />
        <Route path="/editproduct/:id" element={<ProductEdit />} />
        <Route path="/editorder/:id" element={<EditOrder />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/order-confirmed/:order_id" element={<OrderConfirmed />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-confirm/:uid/:token" element={<ResetPassword />} />
        <Route path="/notifications" element={<UserNotifications />} />
        <Route path="/admin/notifications" element={<AdminNotificationPanel />} />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
