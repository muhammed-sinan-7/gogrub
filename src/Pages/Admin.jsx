// src/pages/AdminPanel.jsx
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Eye,
  Edit,
  Trash2,
  Plus,
  IndianRupee,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let res = await axios(
          "https://gogrub-api-mock.onrender.com/users?isAdmin=false"
        );
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUser();
  }, []);

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res = await axios("https://gogrub-api-mock.onrender.com/product");
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://gogrub-api-mock.onrender.com/product/${id}`);
      setProduct(product.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  
  const toggleUserStatus = async (userId, isBlock) => {
    try {
      await axios.patch(
        `https://gogrub-api-mock.onrender.com/users/${userId}`,
        { isBlock: !isBlock }
      );

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isBlock: !user.isBlock } : user
        )
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };


  const totalUsers = users.length;
  const activeUsers = users.filter((user) => !user.isBlock).length;
  const blockedUsers = users.filter((user) => user.isBlock).length;
  const totalProducts = product.length;
  const inStockProducts = product.filter((p) => p.isStock).length;

  const totalRevenue = users.reduce((sum, user) => {
    const userDeliveredTotal =
      user.orders?.reduce((orderSum, order) => {
        if (order.status === "Delivered") {
          return (
            orderSum +
            order.items.reduce(
              (itemSum, item) => itemSum + item.price * item.quantity,
              0
            )
          );
        }
        return orderSum;
      }, 0) || 0;
    return sum + userDeliveredTotal;
  }, 0);

  
  const totalCartItems = users.reduce(
    (sum, user) => sum + (user.cart?.length || 0),
    0
  );

  
  const recentOrders = users
    .flatMap(
      (user) =>
        user.orders?.flatMap((order) =>
          order.items.map((item) => ({
            id: order.id,
            customer: user.name,
            product: item.name,
            amount: item.price * item.quantity,
            status: order.status,
          }))
        ) || []
    )
    .slice(0, 5);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalRevenue}
              </p>
              <span className="text-sm text-gray-500">
                From Delivered Orders
              </span>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              <span className="text-sm text-gray-500">
                {activeUsers} active, {blockedUsers} blocked
              </span>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalProducts}
              </p>
              <span className="text-sm text-gray-500">
                {inStockProducts} in stock
              </span>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cart Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCartItems}
              </p>
              <span className="text-sm text-gray-500">Items in carts</span>
            </div>
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Order Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID", "Customer", "Product", "Amount", "Status"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    ₹{order.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-500 text-white"
                          : order.status === "Shipped"
                          ? "bg-amber-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  
  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Users Management</h2>
      <p className="text-gray-600">Manage users and their permissions</p>

      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["User", "Role", "Status", "Cart Items", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.isAdmin ? "Admin" : "Customer"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isBlock
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isBlock ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.cart?.length || 0} items
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user.id, user.isBlock)}
                      className={`px-3 py-1 rounded text-sm ${
                        user.isBlock
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {user.isBlock ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  
  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Orders Management</h2>
      <p className="text-gray-600">Track and manage all customer orders</p>

      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Order ID",
                "Customer",
                "Product",
                "Amount",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentOrders.map((order, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.product}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  ₹{order.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-500 text-white"
                        : order.status === "Shipped"
                        ? "bg-amber-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/editorder/${order.id}`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ✅ Products Tab
  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Products Management</h2>
          <p className="text-gray-600">Manage menu items</p>
        </div>
        <button
          onClick={() => navigate("/addproduct")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Product", "Category", "Price", "Status", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {product.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{p.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {p.category}
                </td>
                <td className="px-6 py-4 text-sm font-medium">₹{p.price}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      p.isStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {p.isStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/editproduct/${p.id}`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return renderUsers();
      case "orders":
        return renderOrders();
      case "products":
        return renderProducts();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 mb-2 rounded ${
                  activeTab === item.id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminPanel;
