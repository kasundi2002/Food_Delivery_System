import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHome, FiClock } from 'react-icons/fi'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import MobileMenu from './MobileMenu'
import SearchBar from '../ui/SearchBar'

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when changing route
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-padded flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-heading font-bold text-primary-500">FoodExpress</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <NavLink to="/" icon={<FiHome />} label="Home" />
          <NavLink to="/restaurants" label="Restaurants" />
          <NavLink to="/orders" icon={<FiClock />} label="My Orders" />
        </nav>

        {/* Search toggler (mobile) */}
        <button 
          className="md:hidden text-neutral-700 hover:text-primary-500"
          onClick={() => setShowSearch(prev => !prev)}
          aria-label="Toggle search"
        >
          <FiSearch size={22} />
        </button>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Button (desktop) */}
          <button 
            className="hidden md:flex items-center text-neutral-700 hover:text-primary-500"
            onClick={() => setShowSearch(prev => !prev)}
          >
            <FiSearch size={20} />
            <span className="ml-1 text-sm">Search</span>
          </button>

          {/* Cart */}
          <Link 
            to="/cart" 
            className="relative p-1 text-neutral-700 hover:text-primary-500"
            aria-label="Shopping cart"
          >
            <FiShoppingCart size={22} />
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary-500 rounded-full"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          {/* User Menu */}
          <Link 
            to="/profile" 
            className="hidden md:flex items-center space-x-1 text-neutral-700 hover:text-primary-500"
          >
            <FiUser size={22} />
            <span className="text-sm">Profile</span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-1 text-neutral-700 hover:text-primary-500"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Search Bar (expandable) */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white border-b border-neutral-200"
          >
            <div className="container-padded py-3">
              <SearchBar 
                onSearch={(q) => {
                  console.log("Searching for:", q)
                  // In a real app, you would navigate to search results page
                  setShowSearch(false)
                }}
                onClose={() => setShowSearch(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  )
}

function NavLink({ to, label, icon }) {
  const location = useLocation()
  const isActive = location.pathname === to
  
  return (
    <Link 
      to={to} 
      className={`flex items-center font-medium transition-colors duration-200 hover:text-primary-500 ${
        isActive ? 'text-primary-500' : 'text-neutral-700'
      }`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
      {isActive && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500"
          style={{ bottom: '-4px' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  )
}

export default Header