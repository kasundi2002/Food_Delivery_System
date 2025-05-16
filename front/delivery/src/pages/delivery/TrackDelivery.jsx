import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import DeliveryMapView from "./DeliveryMapView";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

const TrackingPage = () => {
  const { state } = useLocation();
  const { order, driverLocation: initialDriverLocation } = state || {};
  const [liveLocation, setLiveLocation] = useState(
    initialDriverLocation
      ? [initialDriverLocation[1], initialDriverLocation[0]] // SWAP
      : [0, 0]
  );
  const [status, setStatus] = useState(order.status || "Pending");
  const [pendingStatus, setPendingStatus] = useState("");
  const [isTracking, setIsTracking] = useState(true); // To toggle live updates on/off
  const [isSimulating, setIsSimulating] = useState(false);  
  const { orderId } = useParams();

    const restaurantCoords =
      Array.isArray(order?.restaurantLocation?.coordinates) &&
      order.restaurantLocation.coordinates.length === 2
        ? order.restaurantLocation.coordinates.slice().reverse()
        : null;

    const customerCoords =
      Array.isArray(order?.deliveryLocation?.coordinates) &&
      order.deliveryLocation.coordinates.length === 2
        ? order.deliveryLocation.coordinates.slice().reverse()
        : null;

    const markers = [];

    if (restaurantCoords) {
      markers.push({ label: "Restaurant", coordinates: restaurantCoords });
    }
    if (liveLocation) {
      markers.push({ label: "Delivery Person", coordinates: liveLocation });
    }
    if (customerCoords) {
      markers.push({ label: "Customer", coordinates: customerCoords });
    }

    const moveDriver = (from, to, duration = 5000) => {
      const socket = io("http://localhost:3004");

      const steps = 50;
      const delay = duration / steps;
      let currentStep = 0;

      const latDiff = (to[0] - from[0]) / steps;
      const lngDiff = (to[1] - from[1]) / steps;

      const interval = setInterval(() => {
        currentStep++;
        const newLat = from[0] + latDiff * currentStep;
        const newLng = from[1] + lngDiff * currentStep;
        setLiveLocation([newLat, newLng]);

        socket.emit("delivery-update", {
          orderId: order._id,
          location: [newLng, newLat],
        });

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, delay);
    };

  const startSimulation = async () => {
    setIsSimulating(true);

    // Move to Restaurant
    setStatus("PickedUp");
    await moveSmoothly(liveLocation, restaurantCoords);

    // Move to halfway
    setStatus("OnTheWay");
    const midway = [
      (restaurantCoords[0] + customerCoords[0]) / 2,
      (restaurantCoords[1] + customerCoords[1]) / 2,
    ];
    await moveSmoothly(restaurantCoords, midway);

    // Move to Customer
    setStatus("Delivered");
    await moveSmoothly(midway, customerCoords);

    setIsSimulating(false);
  };

  const moveSmoothly = (from, to) => {
    return new Promise((resolve) => {
      moveDriver(from, to, 5000);
      setTimeout(() => {
        resolve();
      }, 5000); // match the moveDriver duration
    });
  };
  const raw = localStorage.getItem("token");
  let token = "";
 // assuming you have this from order

  try {
    const parsed = JSON.parse(raw); // ✅ only works if stored as JSON
    token = parsed.token;

  } catch (err) {
    console.log("Token is already a string or malformed JSON", err);
    token = raw; // fallback
 // fallback if userId was stored separately
  }


useEffect(() => {
  // Connect to the socket.io server
  const socket = io("http://localhost:3004"); // Change to actual server URL

  // Listen for updates to driver location
  socket.on("delivery-update", (locationData) => {
    if (locationData.orderId === order._id) {
      const flippedLocation = [
        locationData.location[1],
        locationData.location[0],
      ]; // <-- SWAP
      setLiveLocation(flippedLocation);
    }
  });

  // Clean up the socket connection when the component is unmounted
  return () => {
    socket.disconnect();
  };
}, [order._id]);

const handleStatusChange = (newStatus) => {
  setPendingStatus(newStatus);
};

const handleSaveStatus = useCallback(async () => {
  if (!pendingStatus) return;
  console.log("inside handleSaveStatus");
  console.log("Order ID:", order._id);
  console.log("Delivery Person ID:", order.deliveryPerson); // assuming you have this from order
  console.log("Token:", token); // assuming you have this from order
  setStatus(pendingStatus);
  console.log("Saving status:", pendingStatus);
  try {
    // 1. Send status update to backend
    const res = await axios.put(
      `http://localhost:3003/api/orders/update-status/${order._id}`,
      {
        deliveryPersonId: order.deliveryPerson, // assuming you have this from order
        status: pendingStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if(res.status !== 200) {
      throw new Error("Failed to update status on server");
    }
    // 2. Update local status

    const socket = io("http://localhost:3004");

    let targetLocation;
    if (pendingStatus === "PickedUp") {
      targetLocation = restaurantCoords;
    } else if (pendingStatus === "OnTheWay") {
      // halfway between restaurant and customer
      targetLocation = [
        (restaurantCoords[0] + customerCoords[0]) / 2,
        (restaurantCoords[1] + customerCoords[1]) / 2,
      ];
    } else if (pendingStatus === "Delivered") {
      targetLocation = customerCoords;
            
        const resAvailability = await axios.put(
          `http://localhost:3004/api/delivery/updateAvailability/${order.deliveryPerson}`,
          { isAvailable: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
         if (resAvailability.status === 200) {
           console.log("Driver availability updated successfully.");
           alert("Order delivered. You are now available for new deliveries.");
         } else {
           console.warn("Failed to update driver availability");
           alert("Order delivered but failed to update availability.");
         }
    }
// 3. Emit the new location to the socket server
    if (targetLocation) {
      socket.emit("delivery-update", {
      orderId: order._id,
      location: [targetLocation[1], targetLocation[0]], // backend expects [lng, lat]
      });

      setLiveLocation(targetLocation);
    }

    setPendingStatus(""); // reset
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status. Please try again.");
  }
}, [pendingStatus,token, order._id, order.deliveryPerson, restaurantCoords, customerCoords]);


  const handlePauseTracking = () => {
    setIsTracking(false);
  };

  const handleResumeTracking = () => {
    setIsTracking(true);
  };

  const handleRecenter = () => {
    // Recenter the map to the driver’s current location
    setLiveLocation(initialDriverLocation);
  };

  return (
    <div className="tracking-container">
      <h2>Tracking Order #{orderId}</h2>
      <div className="tracking-status">
        <div className="status-update">
          <span className="status-text">{status}</span>
          <span className="timestamp">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="map-container">
        <DeliveryMapView markers={markers} isTracking={isTracking} />
      </div>

      <div className="tracking-controls">
        {isTracking ? (
          <button className="btn btn-warning" onClick={handlePauseTracking}>
            Pause Tracking
          </button>
        ) : (
          <button className="btn btn-success" onClick={handleResumeTracking}>
            Resume Tracking
          </button>
        )}
        <button className="btn btn-info" onClick={handleRecenter}>
          Recenter Map
        </button>
      </div>

      <div className="status-change-controls" style={{ marginTop: "20px" }}>
        <h4>Change Delivery Status</h4>

        <div className="button-group">
          <button
            className={`btn ${
              pendingStatus === "PickedUp"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => handleStatusChange("PickedUp")}
          >
            Picked Up
          </button>

          <button
            className={`btn ${
              pendingStatus === "OnTheWay"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => handleStatusChange("OnTheWay")}
          >
            On The Way
          </button>

          <button
            className={`btn ${
              pendingStatus === "Delivered"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => handleStatusChange("Delivered")}
          >
            Delivered
          </button>
        </div>

        <button
          className="btn btn-success"
          style={{ marginTop: "10px" }}
          onClick={handleSaveStatus}
          disabled={!pendingStatus}
        >
          Save Status
        </button>

        <div style={{ marginTop: "20px" }}>
          <button
            className="btn btn-primary"
            onClick={startSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? "Simulating..." : "Start Simulation"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TrackingPage;
