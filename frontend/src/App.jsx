import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import CustomerInfo from "./pages/CustomerInfo";
import DeliveryInfo from "./pages/DeliveryInfo";
import RestaurantInfo from "./pages/RestaurantInfo";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/customer" element={<CustomerInfo />} />
      <Route path="/register/restaurant" element={<RestaurantInfo />} />

      {/* Delivery Person */}

      <Route path="/register/delivery" element={<DeliveryInfo />} />
      <Route path="/deliveryHome" element={<DeliveryHome />} />
      <Route path="/deliveryHistory" element={<DeliveryHistory />} />
      <Route path="/deliveryProfile" element={<DeliveryProfilePage />} />

      {/* Customer */}

      {/* Restauarnt*/}
    </Routes>
  );
}

export default App;
