import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const restaurantId = localStorage.getItem('restaurantId');
  const [stats, setStats] = useState({
    totalOrders: 0,
    placed: 0,
    accepted: 0,
    preparing: 0,
    readyForPickup: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredOrders(recentOrders);
    } else {
      const filtered = recentOrders.filter((order) =>
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toString().includes(searchQuery)
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery, recentOrders]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://localhost:3002/api/order/6816238bdf3ff8b66ac78ad4`);
      const data = await response.json();

      if (!Array.isArray(data)) throw new Error("Invalid order data format");

      const statusCounts = {
        placed: 0,
        accepted: 0,
        preparing: 0,
        readyForPickup: 0
      };

      data.forEach(order => {
        const status = order.status?.toLowerCase().replace(/\s+/g, '');
        if (status === 'readyforpickup') statusCounts.readyForPickup++;
        else if (statusCounts.hasOwnProperty(status)) statusCounts[status]++;
      });

      const totalOrders = data.length;
      const totalRevenue = data.reduce((sum, order) => sum + (order.total || 0), 0);

      const recent = data.slice(0, 5).map(order => ({
        id: order._id,
        customer: order.customerName || 'Kasun',
        items: order.items?.length || 0,
        total: order. totalAmount || 0,
        status: order.status
      }));

      setStats({
        totalOrders,
        placed: statusCounts.placed,
        accepted: statusCounts.accepted,
        preparing: statusCounts.preparing,
        readyForPickup: statusCounts.readyForPickup,
        totalRevenue: totalRevenue.toFixed(2)
      });

      setRecentOrders(recent);
      setFilteredOrders(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this order from the dashboard?");
    if (!confirmDelete) return;
  
    // Just remove from local state, not from backend
    const updatedOrders = recentOrders.filter(order => order.id !== orderId);
    setRecentOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
  };
  

  const getStatusBadgeStyle = (status) => {
    const normalizedStatus = status.trim().toLowerCase();
    switch (normalizedStatus) {
      case 'placed':
        return { backgroundColor: '#f9ca24', color: '#fff' };
      case 'accepted':
        return { backgroundColor: '#2980b9', color: '#fff' };
      case 'preparing':
        return { backgroundColor: '#00b894', color: '#fff' };
      case 'ready for pickup':
        return { backgroundColor: '#2ecc71', color: '#fff' };
      default:
        return { backgroundColor: '#f0f0f0', color: '#555' };
    }
  };

  const StatCard = ({ title, value }) => (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#7f8c8d', fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>{value}</p>
    </div>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#2c3e50' }}>Dashboard Overview</h1>
        </div>

        <input
          type="text"
          placeholder="Search by Customer Name or Order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            border: '1px solid #dcdfe3',
            borderRadius: '8px',
            fontSize: '1rem',
            outline: 'none'
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          <StatCard title="Total Orders" value={stats.totalOrders} />
          <StatCard title="Placed" value={stats.placed} />
          <StatCard title="Accepted" value={stats.accepted} />
          <StatCard title="Preparing" value={stats.preparing} />
          <StatCard title="Ready for Pickup" value={stats.readyForPickup} />
        </div>

        {filteredOrders.length === 0 && searchQuery && (
          <div style={{ textAlign: 'center', color: '#e74c3c', fontSize: '1.2rem', marginBottom: '2rem' }}>
            Order not found.
          </div>
        )}

        <table
          style={{
            width: '100%',
            borderSpacing: 0,
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <thead>
            <tr>
              {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Actions'].map((title) => (
                <th
                  key={title}
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #f0f0f0',
                    color: '#888',
                    backgroundColor: '#f9fafc',
                    fontWeight: 600
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '1rem', color: '#333' }}>#{order.id}</td>
                <td style={{ padding: '1rem', color: '#333' }}>{order.customer}</td>
                <td style={{ padding: '1rem', color: '#333' }}>{order.items}</td>
                <td style={{ padding: '1rem', color: '#333' }}>${order.total.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.3rem 0.9rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      ...getStatusBadgeStyle(order.status)
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <FaEdit color="#3498db" style={{ cursor: 'pointer', fontSize: '1rem' }} />
                    <FaTrash
                      color="#e74c3c"
                      style={{ cursor: 'pointer', fontSize: '1rem' }}
                      onClick={() => handleDelete(order.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
