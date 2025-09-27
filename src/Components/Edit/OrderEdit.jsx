import { useEffect,useState } from "react";
import { ChevronDown } from "lucide-react";
import { useParams } from "react-router-dom";

const OrderEdit = () => {
  const [orderStatus, setOrderStatus] = useState("pending");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    est_time: "",
    description: "",
    img_url: "",
    isSpecial: false,
    isStock: false,
  });

  const { id } = useParams();
  const statusOptions = [
    { value: "canceled", label: "Canceled", color: "bg-red-100 text-red-800" },
    {
      value: "delayed",
      label: "Delayed",
      color: "bg-orange-100 text-orange-800",
    },
    { value: "shipped", label: "Shipped", color: "bg-blue-100 text-blue-800" },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
  ];
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://gogrub-api-mock.onrender.com/users/orders/${id}`
        );
        setFormData(res.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleStatusChange = (newStatus) => {
    setOrderStatus(newStatus);
    setIsDropdownOpen(false);
    // Here you can add logic to save the status change
    console.log("Order status changed to:", newStatus);
  };
  const saveStatusUpdate = async () => {
    try {
      await axios.put(
        `https://gogrub-api-mock.onrender.com/users/orders/${id}`,
        {
          ...formData,
          status: orderStatus,
        }
      );
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://gogrub-api-mock.onrender.com/users/orders/${id}`
        );
        setFormData(res.data);
        setOrderStatus(res.data.status); // ✅ Set order status from API
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const currentStatus = statusOptions.find(
    (option) => option.value === orderStatus
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Edit Order Status
        </h2>
        <p className="text-gray-600">Update the current status of the order</p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="orderStatus"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Order Status
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${currentStatus?.color} mr-3`}
                >
                  {currentStatus?.label}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${
                    option.value === orderStatus ? "bg-blue-50" : ""
                  }`}
                >
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${option.color}`}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={saveStatusUpdate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Status
        </button>

        <button
          type="button"
          onClick={() => setOrderStatus("pending")}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>

      {/* Status Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Current Status:
        </h3>
        <span
          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${currentStatus?.color}`}
        >
          {currentStatus?.label}
        </span>
      </div>
    </div>
  );
};

export default OrderEdit;
