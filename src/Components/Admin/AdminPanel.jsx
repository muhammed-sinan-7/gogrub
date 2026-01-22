// src/pages/admin/AdminPanel.jsx
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { LayoutDashboard, Users, Package, ShoppingCart } from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardView from "./Dashboard";
import UserManagementView from "./Users";
import ProductManagementView from "./Producuts";
import ProductDetailView from "./ProductDetail";
import OrderManagementView from "./Orders";
import { ENDPOINTS } from "../../api/endpoints";
import AddProduct from "./AddProduct";

export const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`${ENDPOINTS.ADMIN_PRODUCTS}delete/${id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  const productId = searchParams.get("productId");

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleViewProduct = (id) => {
    setSearchParams({ tab: "product-details", productId: id });
  };

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(ENDPOINTS.ADMIN_USERS, {
          params: searchTerm ? { search: searchTerm } : {},
        });
        console.log("Fetched users:", res.data); // Add this
        setUsers(res.data);
      } catch (err) {
        console.error("User fetch failed", err);
      }
    };

    // Debounce search
    const delay = setTimeout(fetchUsers, searchTerm ? 300 : 0);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  /* ============================
     PRODUCTS + ORDERS FETCH
     ============================ */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, o] = await Promise.all([
          api.get(ENDPOINTS.ADMIN_PRODUCTS),
          api.get(ENDPOINTS.ADMIN_ORDERS),
        ]);

        setProducts(p.data);
        setOrders(o.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setSearchParams({ tab: "products" });
  };

  const handleToggleBlock = async (id) => {
    try {
      const response = await api.put(`${ENDPOINTS.ADMIN_USERS}block/${id}/`);
      const updatedUser = response.data;

      // Update local state immediately for responsive UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id
            ? { ...user, is_active: updatedUser.is_active }
            : user
        )
      );
    } catch (err) {
      console.error("Failed to toggle user status:", err);
      alert("Error updating user status.");
    }
  };
   const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`${ENDPOINTS.ADMIN_PRODUCTS}delete/${id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product. Please try again.");
    }
  };


  const stats = useMemo(() => {
    const revenue = orders
      .filter((order) => order.payment_status === "paid")
      .reduce((sum, order) => sum + parseFloat(order.price || 0), 0);

    const activeUsersCount = users.filter((u) => u.is_active).length;

    return {
      users: users.length,
      activeUsers: activeUsersCount,
      products: products.length,
      orders: orders.length,
      revenue: revenue.toFixed(2),
      carts: 0,
    };
  }, [users, products, orders]);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        items={sidebarItems}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardView recentOrders={orders} stats={stats} />
          )}

          {activeTab === "users" && (
            <UserManagementView
              users={users}
              onToggle={handleToggleBlock}
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
            />
          )}

          {activeTab === "products" && (
            <ProductManagementView
              products={products}
              onView={handleViewProduct}
              onDelete={handleDeleteProduct}
              onAddClick={() => setSearchParams({ tab: "add-product" })}
            />
          )}

          {activeTab === "product-details" && productId && (
            <ProductDetailView
              productId={productId}
              onBack={() => handleTabChange("products")}
            />
          )}

          {activeTab === "orders" && <OrderManagementView orders={orders} />}

          {activeTab === "add-product" && (
            <AddProduct
              onBack={() => setSearchParams({ tab: "products" })}
              onProductAdded={handleProductAdded}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
