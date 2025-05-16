import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiMapPin, FiSearch } from 'react-icons/fi'
import api from '../api'
import RestaurantCard from '../components/restaurant/RestaurantCard'

function HomePage() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.restaurants.getAll()
        // Get 3 random restaurants for featured section
        const shuffled = response.data.sort(() => 0.5 - Math.random())
        setFeaturedRestaurants(shuffled.slice(0, 3))
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRestaurants()
  }, [])
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg" 
            alt="Delicious food"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative container-padded py-20 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Food delivery made <span className="text-primary-500">simple</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-neutral-200">
              Order from your favorite restaurants and track your delivery in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/restaurants" 
                className="btn-primary py-3 px-6 text-base"
              >
                <span>Find restaurants</span>
                <FiArrowRight className="ml-2" />
              </Link>
              <Link 
                to="/orders" 
                className="btn-outline bg-white/10 border-white/20 text-white py-3 px-6 text-base"
              >
                Track your order
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container-padded">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              icon={<FiSearch size={24} />}
              title="Find restaurants"
              description="Browse restaurants near you and pick your favorite"
              stepNumber={1}
            />
            <StepCard 
              icon={<img src="/vite.svg" alt="Food" className="w-6 h-6" />} 
              title="Choose your meal"
              description="Browse menus and select delicious dishes"
              stepNumber={2}
            />
            <StepCard 
              icon={<FiMapPin size={24} />}
              title="Track your order"
              description="Watch in real-time as your order makes its way to you"
              stepNumber={3}
            />
          </div>
        </div>
      </section>
      
      {/* Featured Restaurants */}
      <section className="py-16 bg-neutral-50">
        <div className="container-padded">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Restaurants</h2>
            <Link 
              to="/restaurants" 
              className="text-primary-500 hover:text-primary-600 font-medium flex items-center"
            >
              View all
              <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="card aspect-[3/2] animate-pulse bg-neutral-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRestaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant._id}
                  restaurant={restaurant}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Call To Action */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container-padded text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to order?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Find your favorite restaurants and have delicious food delivered to your doorstep.
          </p>
          <Link 
            to="/restaurants" 
            className="btn bg-white text-primary-600 hover:bg-neutral-100 py-3 px-8 text-base"
          >
            Order now
          </Link>
        </div>
      </section>
    </div>
  )
}

function StepCard({ icon, title, description, stepNumber }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: stepNumber * 0.1 }}
      className="bg-white p-6 rounded-lg text-center relative"
    >
      <div className="w-12 h-12 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
        {stepNumber}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </motion.div>
  )
}

export default HomePage