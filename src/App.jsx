import { Route, Routes } from "react-router-dom";
import "./App.css";

// import Navbar from './Components/Navbar/Navbar'
import Home from "./Pages/Home";
import SignUpPage from "./Pages/Sign/SignUpPage";
import Category from "./Components/Category/Category";
import AllProducts from "./Components/All/AllProducts";
import Cart from "./Components/Cart/Cart";
import Product from "./Components/Product/Product";
import { useEffect, useState } from "react";
// import Login from './Components/Auth/Login'
import Payment from "./Components/Payment/Payment";
import Wishlist from "./Components/Wishlist/wishlist";
import Admin from "./Pages/Admin";
import ProductEdit from "./Components/Edit/ProductEdit";
import OrderEdit from "./Components/Edit/OrderEdit";
import Profile from "./Components/Profile";
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment/" element={<Payment />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/editproduct/:id" element={<ProductEdit />} />
        <Route path="/editorder/:id" element={<OrderEdit />} />
        <Route path="/profile" element={<Profile />} />

        {/* more routes */}
      </Routes>
    </>
  );
}

export default App;
