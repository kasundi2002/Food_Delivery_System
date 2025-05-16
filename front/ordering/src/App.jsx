import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

// Layout Components
import MainLayout from './layouts/MainLayout'

// Page Components
import HomePage from './pages/HomePage'
import RestaurantsPage from './pages/RestaurantsPage'
import RestaurantDetailPage from './pages/RestaurantDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderStatusPage from './pages/OrderStatusPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const location = useLocation()

  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Routes with Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:id" element={<OrderStatusPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App