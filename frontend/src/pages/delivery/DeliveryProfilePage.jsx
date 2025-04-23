import { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:4000/delivery/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
    
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
