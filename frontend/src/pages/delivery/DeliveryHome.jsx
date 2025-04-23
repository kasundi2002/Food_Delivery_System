import { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "../../components/delivery/orderCard";

const DeliveryHome = () => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [availability, setAvailability] = useState(true); // default
  const [loading, setLoading] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch assigned orders
  useEffect(() => {
    const fetchAssignedOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/delivery/assigned-orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAssignedOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch assigned orders", err);
      }
    };
    fetchAssignedOrders();
  }, []);

  // Fetch delivery history
  useEffect(() => {
    const fetchDeliveryHistory = async () => {
      try {
        const res = await axios.get("http://localhost:4000/delivery/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDeliveryHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch delivery history", err);
      }
    };
    fetchDeliveryHistory();
  }, []);

  // Fetch delivery person availability status
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/delivery/availability",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAvailability(res.data.isAvailable);
      } catch (err) {
        console.error("Failed to fetch availability status", err);
      }
    };
    fetchAvailability();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        setDriverLocation([longitude, latitude]);
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  // Toggle delivery person availability
  const toggleAvailability = async () => {
    try {
      setLoading(true);
      const newStatus = !availability;

      const res = await axios.post(
        `http://localhost:4000/delivery/availability`,
        { isAvailable: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      if(!res.data.success) {
        throw new Error("Failed to update availability status");
      }
      setAvailability(newStatus);
      alert(`You are now ${newStatus ? "available" : "unavailable"}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update availability");
    } finally {
      setLoading(false);
    }
  };

  // Accept an order
  const handleAccept = async (orderId) => {
    try {
      await axios.post(
        `http://localhost:4000/delivery/accept/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Order accepted!");
      setAssignedOrders((orders) =>
        orders.map((o) =>
          o._id === orderId ? { ...o, status: "Accepted" } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to accept order");
    }
  };

  // Decline an order
  const handleDecline = async (orderId) => {
    try {
      await axios.post(
        `http://localhost:4000/delivery/decline/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order declined.");
      setAssignedOrders((orders) => orders.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error(err);
      alert("Failed to decline order");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Delivery Dashboard</h2>

      {/* Quick Stats */}
      <div className="bg-light p-3 rounded shadow-sm mb-4">
        <h5>Quick Stats</h5>
        <p>
          <strong>Assigned Orders:</strong> {assignedOrders.length}
        </p>
        <p>
          <strong>Delivered Orders:</strong> {deliveryHistory.length}
        </p>
        <p>
          <strong>Availability Status:</strong>{" "}
          {availability ? (
            <span className="text-success">Available</span>
          ) : (
            <span className="text-danger">Unavailable</span>
          )}
        </p>

        <button
          className="btn btn-sm btn-outline-primary"
          onClick={toggleAvailability}
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : availability
            ? "Go Unavailable"
            : "Go Available"}
        </button>
      </div>

      {/* Assigned Orders Section */}
      <h4>Assigned Orders</h4>
      {assignedOrders.length === 0 ? (
        <p>No assigned orders yet.</p>
      ) : (
        assignedOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            driverLocation={driverLocation}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))
      )}
    </div>
  );
};

export default DeliveryHome;
