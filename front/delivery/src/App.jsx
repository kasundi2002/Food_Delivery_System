import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/common/Register";
import Login from "./pages/common/Login";

import CustomerHome from "./pages/customer/CustomerHome";
import RestaurantHome from "./pages/restaurant/RestaurantHome";
import AdminHome from "./pages/admin/AdminHome";

import DeliveryLayout from "./components/delivery/DeliveryLayout";
import DeliveryHome from "./pages/delivery/DeliveryHome";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";
import DeliveryProfilePage from "./pages/delivery/DeliveryProfilePage";
import DeliveryTrackingPage from "./pages/delivery/TrackDelivery";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Delivery Person */}
      
        <Route path="/delivery" element={<DeliveryLayout />}>
          <Route path="home" element={<DeliveryHome />} />
          <Route path="history" element={<DeliveryHistory />} />
          <Route path="profile" element={<DeliveryProfilePage />} />
          <Route path="track/:orderId" element={<DeliveryTrackingPage />} />
        </Route>

      {/* Customer */}
      <Route path="/customerHome" element={<CustomerHome />} />

      {/* Restauarnt*/}
      <Route path="/restaurantHome" element={<RestaurantHome />} />

      {/* Admin */}
      <Route path="/adminHome" element={<AdminHome />} />
    </Routes>
  );
}

export default App;
