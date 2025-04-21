import { useEffect, useState } from "react";
import api from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get("/delivery/me")
      .then((res) => setProfile(res.data))
      .catch(() => alert("Failed to load profile"));
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="container mt-4">
      <h3>My Profile</h3>
      <p>
        <strong>Name:</strong> {profile.name}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Phone:</strong> {profile.phone}
      </p>
      <p>
        <strong>Vehicle Number:</strong> {profile.vehicleNumber}
      </p>
      <p>
        <strong>License:</strong> {profile.license}
      </p>
      <p>
        <strong>Gender:</strong> {profile.gender}
      </p>
      <p>
        <strong>Status:</strong> {profile.status}
      </p>
    </div>
  );
};

export default Profile;
