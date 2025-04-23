import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/common/Register";
import Login from "./pages/common/Login";

import DeliveryHome from "./pages/delivery/DeliveryHome";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";
import DeliveryProfilePage from "./pages/delivery/DeliveryProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Delivery Person */}

      <Route path="/deliveryHome" element={<DeliveryHome />} />
      <Route path="/deliveryHistory" element={<DeliveryHistory />} />
      <Route path="/deliveryProfile" element={<DeliveryProfilePage />} />

      {/* Customer */}

      {/* Restauarnt*/}
    </Routes>
  );
}

export default App;
