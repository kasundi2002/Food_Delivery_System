import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiStar } from 'react-icons/fi'

function RestaurantCard({ restaurant }) {
  // Generate random rating for demo
  const rating = (3.5 + Math.random() * 1.5).toFixed(1)
  const deliveryTime = Math.floor(20 + Math.random() * 25)
  
  // Format category with capitalization
  const formatCategory = (category) => {
    return category.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/restaurants/${restaurant._id}`} className="block card h-full">
        <div className="relative aspect-[3/2] overflow-hidden rounded-t-lg">
          <img 
            src={restaurant.url || 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg'}
            alt={restaurant.restaurantName}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex justify-between items-center">
              <span className="badge bg-white text-neutral-800 font-medium">
                {formatCategory(restaurant.category)}
              </span>
              <div className="flex items-center space-x-1 text-white bg-black/30 px-2 py-1 rounded-md">
                <FiStar className="text-yellow-400" />
                <span className="font-medium">{rating}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{restaurant.restaurantName}</h3>
          
          <div className="flex items-center text-sm text-neutral-500 mb-2">
            <FiClock className="mr-1" />
            <span>{deliveryTime}-{deliveryTime + 10} min delivery</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {['Popular', 'Free Delivery'].map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default RestaurantCard