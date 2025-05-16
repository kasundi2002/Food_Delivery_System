import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';

const ProfileManagement = () => {
  const API_URL = "http://localhost:3002/api/restaurant";
  
  const [restaurant, setRestaurant] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
    profileImage: null,
  });

  const fetchRestaurantData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      // Assuming API returns restaurant details directly
      setRestaurant({
        name: data.name || '',
        description: data.description || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        openingHours: data.openingHours || '',
        profileImage: null, // Image upload is separate
      });
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setRestaurant(prevState => ({
        ...prevState,
        profileImage: files[0]
      }));
    } else {
      setRestaurant(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('name', restaurant.name);
      formData.append('description', restaurant.description);
      formData.append('address', restaurant.address);
      formData.append('phone', restaurant.phone);
      formData.append('email', restaurant.email);
      formData.append('openingHours', restaurant.openingHours);
      if (restaurant.profileImage) {
        formData.append('profileImage', restaurant.profileImage);
      }

      const response = await fetch(API_URL, {
        method: 'PUT', // or POST based on your backend
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }

      alert('Restaurant profile updated successfully!');
      fetchRestaurantData(); // Refresh data after update

    } catch (error) {
      console.error("Error updating restaurant:", error);
      alert('Failed to update restaurant profile.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#2c3e50' }}>Restaurant Profile Management</h1>
        </div>

        <form 
          onSubmit={handleSubmit}
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: 'white',
            padding: '4rem',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Input Fields */}
          {[
            { label: 'Restaurant Name', name: 'name', type: 'text', placeholder: 'Enter restaurant name' },
            { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Enter restaurant description' },
            { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter address' },
            { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: 'Enter phone number' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter email address' },
            { label: 'Opening Hours', name: 'openingHours', type: 'text', placeholder: 'e.g., 9:00 AM - 10:00 PM' },
          ].map((field, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={restaurant[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #dcdfe3',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    minHeight: '100px',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={restaurant[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #dcdfe3',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              )}
            </div>
          ))}

          {/* Profile Image */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
              Profile Image
            </label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              width: '100%',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={e => (e.target.style.backgroundColor = '#27ae60')}
            onMouseOut={e => (e.target.style.backgroundColor = '#2ecc71')}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileManagement;
