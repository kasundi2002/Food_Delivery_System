import { useEffect, useState } from "react";
import api from "../services/api";
import OrderCard from "../components/OrderCard";

const DeliveryHome = () => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [availability, setAvailability] = useState(true); // default
  const [loading, setLoading] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);

  // Fetch assigned orders
  useEffect(() => {
    api
      .get("/delivery/assigned-orders")
      .then((res) => setAssignedOrders(res.data))
      .catch(() => alert("Failed to load assigned orders"));
  }, []);

  // Fetch delivery history
  useEffect(() => {
    api
      .get("/delivery/history")
      .then((res) => setDeliveryHistory(res.data))
      .catch(() => alert("Failed to load delivery history"));
  }, []);

  // Fetch delivery person availability status
  useEffect(() => {
    api
      .get("/delivery/me")
      .then((res) => setAvailability(res.data.isAvailable))
      .catch(() => alert("Failed to load availability"));
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

  const toggleAvailability = async () => {
    try {
      setLoading(true);
      const newStatus = !availability;
      await api.put("/delivery/availability", { isAvailable: newStatus });
      setAvailability(newStatus);
    } catch (err) {
        console.error(err);
      alert("Failed to update availability");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      await api.post(`/delivery/accept/${orderId}`);
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

  const handleDecline = async (orderId) => {
    try {
      await api.post(`/delivery/decline/${orderId}`);
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
