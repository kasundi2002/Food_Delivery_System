import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiStar, FiClock, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import api from '../api'
import { useCart } from '../contexts/CartContext'

function RestaurantDetailPage() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { addItem, isRestaurantInCart } = useCart()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch restaurant details
        const restaurantResponse = await api.restaurants.getById(id)
        setRestaurant(restaurantResponse.data)
        
        // Fetch restaurant products
        const productsResponse = await api.products.getByRestaurant(id)
        setProducts(productsResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id])
  
  // Extract categories from products
  const categories = ['All', ...new Set(products.map(product => product.category || 'Main Menu'))]
  
  // Filter products by category and restaurant ID
  const filteredProducts = selectedCategory === 'All' 
    ? products.filter(product => product.restaurantId === id)
    : products.filter(product => 
        (product.category || 'Main Menu') === selectedCategory && product.restaurantId === id
    )
  
  // Handle adding to cart
  const handleAddToCart = (product) => {
    addItem(product, id)
  }
  
  if (loading) {
    return <LoadingState />
  }
  
  if (!restaurant) {
    return (
      <div className="container-padded py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Restaurant not found</h2>
        <p className="text-neutral-600">The restaurant you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }
  
  return (
    <div>
      {/* Restaurant Header/Banner */}
      <div className="relative h-64 md:h-80 bg-neutral-900">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={restaurant.url || 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg'} 
            alt={restaurant.restaurantName}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="container-padded">
            <div className="flex justify-between items-end">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold mb-2"
                >
                  {restaurant.restaurantName}
                </motion.h1>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.2 } }}
                  className="flex flex-wrap gap-3 mb-2"
                >
                  <span className="badge-primary bg-primary-500 text-white">
                    {restaurant.category}
                  </span>
                  <div className="flex items-center text-white">
                    <FiStar className="mr-1 text-yellow-400" />
                    <span className="text-sm">{(3.5 + Math.random() * 1.5).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <FiClock className="mr-1" />
                    <span className="text-sm">{20 + Math.floor(Math.random() * 20)} min</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Restaurant Info & Menu */}
      <div className="container-padded py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with Restaurant Info */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white shadow-sm rounded-lg p-4 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Restaurant Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiMapPin className="mt-1 mr-3 text-primary-500" />
                  <div>
                    <h4 className="font-medium text-sm">Address</h4>
                    <p className="text-neutral-600 text-sm">
                      123 Main Street, Anytown, USA
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiPhone className="mt-1 mr-3 text-primary-500" />
                  <div>
                    <h4 className="font-medium text-sm">Phone</h4>
                    <p className="text-neutral-600 text-sm">{restaurant.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiMail className="mt-1 mr-3 text-primary-500" />
                  <div>
                    <h4 className="font-medium text-sm">Email</h4>
                    <p className="text-neutral-600 text-sm">{restaurant.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiClock className="mt-1 mr-3 text-primary-500" />
                  <div>
                    <h4 className="font-medium text-sm">Hours</h4>
                    <p className="text-neutral-600 text-sm">
                      Mon-Fri: 9:00 AM - 10:00 PM<br />
                      Sat-Sun: 10:00 AM - 11:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Menu Section */}
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-4">Menu</h2>
            
            {/* Categories */}
            <div className="mb-6 overflow-x-auto hide-scrollbar">
              <div className="flex space-x-2 pb-2">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Products */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product._id}
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ))}
                </div>
                
                {filteredProducts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-neutral-600">No items available in this category.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, onAddToCart }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden flex"
    >
      <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0">
        <img 
          src={product.url } 
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="flex-grow p-3 flex flex-col">
        <h3 className="font-medium mb-1">{product.name}</h3>
        <p className="text-sm text-neutral-600 line-clamp-2 mb-2 flex-grow">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-primary-800">${product.price.toFixed(2)}</span>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            onClick={onAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <FiPlus />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function LoadingState() {
  return (
    <div>
      {/* Shimmer for restaurant header */}
      <div className="h-64 md:h-80 bg-neutral-200 animate-pulse relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container-padded">
            <div className="h-10 bg-neutral-300 rounded w-2/3 mb-3"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-neutral-300 rounded w-20"></div>
              <div className="h-6 bg-neutral-300 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-padded py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Shimmer for sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white shadow-sm rounded-lg p-4">
              <div className="h-7 bg-neutral-200 rounded w-1/2 mb-4"></div>
              
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex mb-4">
                  <div className="w-6 h-6 bg-neutral-200 rounded-full mr-3"></div>
                  <div className="flex-grow">
                    <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Shimmer for menu */}
          <div className="flex-grow">
            <div className="h-8 bg-neutral-200 rounded w-32 mb-4"></div>
            
            <div className="flex space-x-2 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 bg-neutral-200 rounded-full w-24"></div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden flex">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-neutral-200 animate-pulse"></div>
                  <div className="flex-grow p-3">
                    <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-neutral-200 rounded w-16"></div>
                      <div className="h-8 w-8 bg-neutral-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetailPage