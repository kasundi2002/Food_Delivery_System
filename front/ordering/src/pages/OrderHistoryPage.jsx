import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiCheck, FiChevronRight, FiFilter, FiShoppingBag } from 'react-icons/fi'
import api from '../api'

function OrderHistoryPage() {
  const [restaurant, setRestaurant] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, completed
  
  useEffect(() => {
    const fetchOrdersWithRestaurantNames = async () => {
      try {
        setLoading(true)
        const response = await api.orders.getAll()
        const ordersWithRestaurantNames = await Promise.all(
          response.data.map(async (order) => {
            try {
              const restaurantResponse = await api.restaurants.getById(order.restaurantId)
              return { ...order, restaurantName: restaurantResponse.data.restaurantName }
            } catch (error) {
              console.error(`Error fetching restaurant name for ID ${order.restaurantId}:`, error)
              return { ...order, restaurantName: 'Unknown Restaurant' }
            }
          })
        )
        setOrders(ordersWithRestaurantNames)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrdersWithRestaurantNames()
  }, [])
  
  // Filter orders based on active filter
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    if (filter === 'active') return !order.isCancelled && order.status !== 'Delivered'
    if (filter === 'completed') return order.status === 'Delivered' || order.isCancelled
    return true
  })
  
  return (
    <div className="container-padded py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {/* Filter Tabs */}
      <div className="flex border-b border-neutral-200 mb-6">
        <FilterTab 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
          label="All Orders"
        />
        <FilterTab 
          active={filter === 'active'} 
          onClick={() => setFilter('active')}
          label="Active Orders"
        />
        <FilterTab 
          active={filter === 'completed'} 
          onClick={() => setFilter('completed')}
          label="Completed Orders"
        />
      </div>
      
      {/* Orders List */}
      {loading ? (
        <OrdersLoadingState />
      ) : filteredOrders.length > 0 ? (
        <AnimatePresence>
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <EmptyOrdersState filter={filter} />
      )}
    </div>
  )
}

function FilterTab({ active, onClick, label }) {
  return (
    <button
      className={`px-4 py-2 font-medium text-sm border-b-2 ${
        active 
          ? 'border-primary-500 text-primary-600' 
          : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function OrderCard({ order }) {
  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString()
  
  // Status badge
  const getStatusBadge = () => {
    if (order.isCancelled) {
      return <span className="badge bg-red-100 text-red-800">Cancelled</span>
    }
    
    switch (order.status) {
      case 'Delivered':
        return <span className="badge bg-secondary-100 text-secondary-800">Delivered</span>
      case 'On the way':
        return <span className="badge bg-primary-100 text-primary-800">On the way</span>
      case 'Ontheway':
        return <span className="badge bg-primary-100 text-primary-800">On the way</span>
      case 'Preparing':
        return <span className="badge bg-yellow-100 text-yellow-800">Preparing</span>
      default:
        return <span className="badge bg-neutral-100 text-neutral-800">{order.status}</span>
    }
  }
  
  // Status icon
  const getStatusIcon = () => {
    if (order.isCancelled) {
      return <FiFilter className="text-red-500" />
    }
    
    switch (order.status) {
      case 'Delivered':
        return <FiCheck className="text-secondary-500" />
      default:
        return <FiClock className="text-primary-500" />
    }
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <Link to={`/orders/${order._id}`} className="block hover:bg-neutral-50 transition-colors">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <span className="mr-2">
                {getStatusIcon()}
              </span>
              <h3 className="font-medium">{order.restaurantName}</h3>
            </div>
            {getStatusBadge()}
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              {/* <p className="text-sm text-neutral-600 mb-1">
                Order #{order._id.substring(order._id.length - 5)}
              </p> */}
              <p className="text-sm text-neutral-600">
                Placed on {orderDate}
              </p>
            </div>
            
            <div className="flex items-center">
              <span className="font-medium mr-2">${order.totalAmount.toFixed(2)}</span>
              <FiChevronRight className="text-neutral-400" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function OrdersLoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 w-40 bg-neutral-200 rounded"></div>
            <div className="h-6 w-24 bg-neutral-200 rounded"></div>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="h-4 w-32 bg-neutral-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-neutral-200 rounded"></div>
            </div>
            
            <div className="h-6 w-20 bg-neutral-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyOrdersState({ filter }) {
  let message = ''
  
  switch (filter) {
    case 'active':
      message = "You don't have any active orders at the moment."
      break
    case 'completed':
      message = "You don't have any completed orders yet."
      break
    default:
      message = "You haven't placed any orders yet."
  }
  
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiShoppingBag size={32} className="text-neutral-400" />
      </div>
      <h2 className="text-xl font-bold mb-2">No orders found</h2>
      <p className="text-neutral-600 mb-6">{message}</p>
      <Link to="/restaurants" className="btn-primary">
        Browse Restaurants
      </Link>
    </div>
  )
}

export default OrderHistoryPage