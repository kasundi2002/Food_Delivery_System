import React, { useState } from "react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerRetina,
  shadowUrl: markerShadow,
});

const LocationMarker = ({ position, setPosition, onDragEnd, onClick }) => {
  useMapEvents({
    click(e) {
      const clicked = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };
      setPosition(clicked);
      onClick({
        type: "Point",
        coordinates: [clicked.lng, clicked.lat],
      });
    },
  });

  return position ? (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          setPosition(latlng);
          onDragEnd({
            type: "Point",
            coordinates: [latlng.lng, latlng.lat],
          });
        },
      }}
    />
  ) : null;
};

const LocateButton = ({ setMapCenter }) => {
  const map = useMap();

  const locate = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      map.setView(coords, 14);
      setMapCenter(coords);
    });
  };

  return (
    <button onClick={locate} style={{ margin: "10px", padding: "5px 10px" }}>
      📍 Locate Me
    </button>
  );
};

const MapPickerLeaflet = ({ onLocationChange }) => {
  const [position, setPosition] = useState(null); // Initially null

  const handleUpdate = (location) => {
    if (!location?.lat || !location?.lng) return;
    setPosition(location);
    onLocationChange({
      type: "Point",
      coordinates: [location.lng, location.lat],
    });
  };

  return (
    <div>
      <MapContainer
        center={{ lat: 6.9271, lng: 79.8612 }}
        zoom={13}
        style={{ height: "300px", width: "100%", marginBottom: "1rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onDragEnd={handleUpdate}
          onClick={handleUpdate}
        />
        <LocateButton setMapCenter={handleUpdate} />
      </MapContainer>

      {!position && (
        <p style={{ color: "red", textAlign: "center" }}>
          📍 Please click on the map to select your location.
        </p>
      )}
    </div>
  );
};

export default MapPickerLeaflet;
