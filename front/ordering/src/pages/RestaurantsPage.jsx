import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiFilter, FiX } from 'react-icons/fi'
import api from '../api'
import RestaurantCard from '../components/restaurant/RestaurantCard'

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Categories derived from restaurants data
  const [categories, setCategories] = useState(['All'])
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)
        const response = await api.restaurants.getAll()
        
        setRestaurants(response.data)
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(response.data.map(r => r.category))]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRestaurants()
  }, [])
  
  // Filter restaurants based on category and search
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCategory = selectedCategory === 'All' || restaurant.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      restaurant.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })
  
  return (
    <div className="container-padded py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
      
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search restaurants by name or cuisine..."
            className="input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button 
          className="md:hidden btn-outline flex items-center"
          onClick={() => setShowFilters(prev => !prev)}
        >
          {showFilters ? <FiX className="mr-2" /> : <FiFilter className="mr-2" />}
          {showFilters ? 'Close Filters' : 'Filters'}
        </button>
      </div>
      
      {/* Filters - Mobile Expandable */}
      <div className={`md:hidden mb-6 ${showFilters ? 'block' : 'hidden'}`}>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <CategoryButton
                key={category}
                category={category}
                isSelected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop Sidebar */}
        <div className="hidden md:block w-60 shrink-0">
          <div className="sticky top-24 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="flex flex-col space-y-2">
              {categories.map(category => (
                <CategoryButton
                  key={category}
                  category={category}
                  isSelected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  vertical
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Restaurant Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card aspect-[3/2] animate-pulse bg-neutral-200" />
              ))}
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant._id}
                  restaurant={restaurant}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-neutral-600">No restaurants found matching your criteria.</p>
              <button 
                className="mt-2 text-primary-500 font-medium"
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CategoryButton({ category, isSelected, onClick, vertical = false }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        vertical ? 'text-left' : ''
      } ${
        isSelected 
          ? 'bg-primary-500 text-white' 
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
      }`}
      onClick={onClick}
    >
      {category}
    </motion.button>
  )
}

export default RestaurantsPage