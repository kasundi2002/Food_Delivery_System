import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMapPin, FiPhone, FiMail, FiEdit2, FiCreditCard, FiClock } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProfilePage() {
  const { user, logout } = useAuth()
  const [profileTab, setProfileTab] = useState('profile') // profile, addresses, payments, orders
  
  if (!user) {
    return (
      <div className="container-padded py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in</h2>
        <p className="text-neutral-600 mb-6">You need to be logged in to view your profile.</p>
        <Link to="/login" className="btn-primary">
          Sign In
        </Link>
      </div>
    )
  }
  
  return (
    <div className="container-padded py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-60 shrink-0">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Profile Header */}
            <div className="p-4 border-b border-neutral-200">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 mr-3">
                  <FiUser size={24} />
                </div>
                <div>
                  <h3 className="font-medium">{user.name || 'Demo User'}</h3>
                  <p className="text-sm text-neutral-600">{user.email}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="p-2">
              <ProfileNavItem 
                icon={<FiUser size={18} />}
                label="Profile Information"
                active={profileTab === 'profile'}
                onClick={() => setProfileTab('profile')}
              />
              <ProfileNavItem 
                icon={<FiMapPin size={18} />}
                label="Saved Addresses"
                active={profileTab === 'addresses'}
                onClick={() => setProfileTab('addresses')}
              />
              <ProfileNavItem 
                icon={<FiCreditCard size={18} />}
                label="Payment Methods"
                active={profileTab === 'payments'}
                onClick={() => setProfileTab('payments')}
              />
              <ProfileNavItem 
                icon={<FiClock size={18} />}
                label="Order History"
                active={profileTab === 'orders'}
                onClick={() => setProfileTab('orders')}
              />
            </nav>
            
            {/* Logout */}
            <div className="p-4 border-t border-neutral-200">
              <button 
                className="text-accent-500 hover:text-accent-600 font-medium text-sm"
                onClick={logout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-grow">
          <motion.div
            key={profileTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {profileTab === 'profile' && <ProfileInformation user={user} />}
            {profileTab === 'addresses' && <SavedAddresses user={user} />}
            {profileTab === 'payments' && <PaymentMethods />}
            {profileTab === 'orders' && <OrderHistory />}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function ProfileNavItem({ icon, label, active, onClick }) {
  return (
    <button
      className={`flex items-center w-full px-3 py-2 rounded-md text-left mb-1 ${
        active 
          ? 'bg-primary-50 text-primary-600' 
          : 'text-neutral-700 hover:bg-neutral-50'
      }`}
      onClick={onClick}
    >
      <span className={`mr-3 ${active ? 'text-primary-500' : 'text-neutral-500'}`}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

function ProfileInformation({ user }) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Profile Information</h2>
        <button className="text-primary-500 hover:text-primary-600 flex items-center text-sm font-medium">
          <FiEdit2 className="mr-1" size={16} />
          Edit Profile
        </button>
      </div>
      
      <div className="space-y-4">
        <ProfileField 
          icon={<FiUser className="text-primary-500" />} 
          label="Full Name" 
          value={user.name || 'Demo User'} 
        />
        <ProfileField 
          icon={<FiMail className="text-primary-500" />} 
          label="Email" 
          value={user.email} 
        />
        <ProfileField 
          icon={<FiPhone className="text-primary-500" />} 
          label="Phone" 
          value={user.phone || '123-456-7890'} 
        />
      </div>
    </div>
  )
}

function SavedAddresses({ user }) {
  // Mocked addresses
  const addresses = [
    {
      id: 1,
      label: 'Home',
      address: '123 Main St, Apartment 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isDefault: true
    },
    {
      id: 2,
      label: 'Work',
      address: '456 Office Ave, Floor 7',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      isDefault: false
    }
  ]
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Saved Addresses</h2>
        <button className="text-primary-500 hover:text-primary-600 flex items-center text-sm font-medium">
          <FiEdit2 className="mr-1" size={16} />
          Add New Address
        </button>
      </div>
      
      <div className="space-y-4">
        {addresses.map(address => (
          <div key={address.id} className="border border-neutral-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="font-medium">{address.label}</h3>
                  {address.isDefault && (
                    <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-neutral-600 text-sm">
                  {address.address}
                </p>
                <p className="text-neutral-600 text-sm">
                  {address.city}, {address.state} {address.zipCode}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button className="text-primary-500 hover:text-primary-600 text-sm">Edit</button>
                <button className="text-accent-500 hover:text-accent-600 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PaymentMethods() {
  // Mocked payment methods
  const paymentMethods = [
    {
      id: 1,
      type: 'Credit Card',
      last4: '4242',
      expiryDate: '12/25',
      cardType: 'Visa',
      isDefault: true
    },
    {
      id: 2,
      type: 'Credit Card',
      last4: '1234',
      expiryDate: '06/24',
      cardType: 'Mastercard',
      isDefault: false
    }
  ]
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Payment Methods</h2>
        <button className="text-primary-500 hover:text-primary-600 flex items-center text-sm font-medium">
          <FiEdit2 className="mr-1" size={16} />
          Add New Card
        </button>
      </div>
      
      <div className="space-y-4">
        {paymentMethods.map(method => (
          <div key={method.id} className="border border-neutral-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="font-medium">{method.cardType} •••• {method.last4}</h3>
                  {method.isDefault && (
                    <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-neutral-600 text-sm">
                  Expires {method.expiryDate}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button className="text-primary-500 hover:text-primary-600 text-sm">Edit</button>
                <button className="text-accent-500 hover:text-accent-600 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderHistory() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Order History</h2>
        <Link to="/orders" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
          View All Orders
        </Link>
      </div>
      
      <p className="text-center py-8 text-neutral-600">
        You will find your order history in the Orders section.
      </p>
    </div>
  )
}

function ProfileField({ icon, label, value }) {
  return (
    <div className="flex items-start">
      <div className="mr-3 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}

export default ProfilePage