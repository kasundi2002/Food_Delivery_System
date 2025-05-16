import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

const OrderManagement = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const restaurantId = "6816238bdf3ff8b66ac78ad4"; // TODO: replace dynamically later

  useEffect(() => {
    fetchOrders();
  }, []);



  // Fetch orders from the server
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3002/api/order/6816238bdf3ff8b66ac78ad4`//http://localhost:5000/api/orders/restaurant/${restaurantId}
      );
      console.log("Fetched orders:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  //status update function
  const handleStatusUpdate = async (orderId, newStatus) => {
    
    try {
      console.log("Updating order status:", orderId, newStatus);
      await axios.put(
        `http://localhost:3002/api/order/update-status/${orderId}`,
        { status: newStatus , updatedBy: restaurantId} // Assuming restaurantId is the updater's ID
      );
      fetchOrders(); // Refresh after update
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Filter orders based on the selected status
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  // Function to get the style for the status badge
  const getStatusStyle = (status) => {
    const base = {
      padding: "0.3rem 0.8rem",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "600",
      textTransform: "capitalize",
      color: "white",
    };
    switch (status) {
      case "Placed":
        return { ...base, backgroundColor: "#f9ca24" };
      case "Accepted":
        return { ...base, backgroundColor: "#2980b9" };
      case "Preparing":
        return { ...base, backgroundColor: "#00b894" };
        case "Ready for Pickup":
        return { ...base, backgroundColor: "#ee6b6e" };

      default:
        return base;
    }
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#f5f6fa" }}
    >
      <Sidebar />
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ fontSize: "1.6rem", color: "#2c3e50" }}>
            Order Management
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          {["all", "Placed", "Accepted", "Preparing","Ready for Pickup"].map((status) => (
            <button
              key={status}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                backgroundColor:
                  activeFilter === status ? "#e74c3c" : "transparent",
                color: activeFilter === status ? "#fff" : "#333",
                border: `1px solid ${
                  activeFilter === status ? "#e74c3c" : "#ccc"
                }`,
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() => setActiveFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                  transition: "0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    fontSize: "1rem",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: "600", color: "#3498db" }}>
                    Order #{order._id}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={getStatusStyle(order.status)}>
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      style={{
                        padding: "0.4rem 0.7rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        backgroundColor: "#ecf0f1",
                        cursor: "pointer",
                      }}
                    >
                      {["Placed", "Accepted", "Preparing","Ready for Pickup"].map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #eee",
                    borderBottom: "1px solid #eee",
                    padding: "1rem 0",
                  }}
                >
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 0",
                        color: "#555",
                      }}
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "1rem",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "1rem",
                      color: "#2c3e50",
                    }}
                  >
                    Total: ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
