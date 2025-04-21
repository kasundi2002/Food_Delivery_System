// src/pages/DeliveryHistory.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import OrderCard from "../components/OrderCard";
import LoadingSpinner from "../components/LoadingSpinner";

const DeliveryHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/delivery/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Delivery History</h2>
      {loading ? (
        <LoadingSpinner message="Loading delivery history..." />
      ) : history.length > 0 ? (
        history.map((order) => <OrderCard key={order._id} order={order} />)
      ) : (
        <p>No deliveries yet.</p>
      )}
    </div>
  );
};

export default DeliveryHistory;
