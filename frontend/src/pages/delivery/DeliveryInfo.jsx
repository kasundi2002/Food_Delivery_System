import { useState, useEffect } from "react";
import api from "../services/api";
import MapPicker from "../components/MapPicker";
import LoadingSpinner from "../components/LoadingSpinner";

const DeliveryInfo = () => {
  const [form, setForm] = useState({
    phone: "",
    vehicleNumber: "",
    license: "",
    gender: "Male",
    address: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        const coords = `${longitude},${latitude}`;
        setForm((f) => ({ ...f, location: coords, address: coords }));
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  const validate = () => {
    if (
      !form.phone ||
      !form.vehicleNumber ||
      !form.license ||
      !form.location ||
      !form.address
    ) {
      setError("All fields and locations are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const addressCoords = form.address.split(",").map(Number);
      const locationCoords = form.location.split(",").map(Number);

      await api.post("/delivery/register", {
        phone: form.phone,
        vehicleNumber: form.vehicleNumber,
        license: form.license,
        gender: form.gender,
        address: { type: "Point", coordinates: addressCoords },
        location: { type: "Point", coordinates: locationCoords },
      });

      alert("Delivery profile created!");
    } catch (err) {
        console.log(err);
      setError("Failed to create delivery profile.");
      alert("Failed to create delivery profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Complete Delivery Info</h3>
      {error && <p className="text-danger">{error}</p>}
      <input
        placeholder="Phone"
        className="form-control mb-2"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        placeholder="Vehicle Number"
        className="form-control mb-2"
        onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
      />
      <input
        placeholder="License Number"
        className="form-control mb-2"
        onChange={(e) => setForm({ ...form, license: e.target.value })}
      />
      <select
        className="form-select mb-3"
        onChange={(e) => setForm({ ...form, gender: e.target.value })}
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <p>Click to set address:</p>
      <MapPicker
        onCoordinatesSelect={([lat, lng]) => {
          setForm((f) => ({ ...f, address: `${lng},${lat}` }));
        }}
      />
      <p className="mt-2">Click to set current live location:</p>
      <MapPicker
        onCoordinatesSelect={([lat, lng]) => {
          setForm((f) => ({ ...f, location: `${lng},${lat}` }));
        }}
      />

      <div className="mt-3">
        {loading ? (
          <LoadingSpinner message="Submitting..." />
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default DeliveryInfo;
