import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardView from "./Dashboard";
import UserManagementView from "./Users";
import ProductManagementView from "./Producuts";
import ProductDetailView from "./ProductDetail";
import OrderManagementView from "./Orders";
import { ENDPOINTS } from "../../api/endpoints";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

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
    const fetchAll = async () => {
      try {
        const [u, p, o] = await Promise.all([
          api.get(ENDPOINTS.ADMIN_USERS),
          api.get(ENDPOINTS.ADMIN_PRODUCTS),
          api.get(ENDPOINTS.ADMIN_ORDERS),
        ]);

        setUsers(u.data);
        setProducts(p.data);
        setOrders(o.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, []);

  const stats = useMemo(
    () => ({
      users: users.length,
      products: products.length,
      orders: orders.length,
    }),
    [users, products, orders]
  );

  // ✅ CORRECT SIDEBAR CONFIG
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
          {activeTab === "dashboard" && <DashboardView recentOrders={orders} stats={stats} />}

          {activeTab === "users" && (
            <UserManagementView users={users} />
          )}

          {activeTab === "products" && (
            <ProductManagementView
              products={products}
              onView={handleViewProduct}
            />
          )}

          {activeTab === "product-details" && productId && (
            <ProductDetailView
              productId={productId}
              onBack={() => handleTabChange("products")}
            />
          )}

          {activeTab === "orders" && (
            <OrderManagementView users={users} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
