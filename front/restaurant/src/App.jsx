import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Restaurant Pages

import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import MenuManagement from './pages/restaurant/MenuManagement';
import OrderManagement from './pages/restaurant/OrderManagement';
import ProfileManagement from './pages/restaurant/ProfileManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Restaurant Routes */}
        
        <Route path="/dashboard" element={<RestaurantDashboard />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/profile" element={<ProfileManagement />} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
