import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiCheck, FiMapPin, FiPhoneCall, FiInfo } from 'react-icons/fi'
import api from '../api'
import { toast } from 'react-toastify'
import MapComponent from '../components/map/MapComponent'

function OrderStatusPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true)
        // Fetch order details
        const orderResponse = await api.orders.getById(id)
        setOrder(orderResponse.data)
        
        // Fetch restaurant details
        const restaurantResponse = await api.restaurants.getById(orderResponse.data.restaurantID)
        setRestaurant(restaurantResponse.data)
      } catch (error) {
        console.error('Error fetching order data:', error)
        toast.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrderData()
    
    // Poll for order updates every 30 seconds
    const intervalId = setInterval(fetchOrderData, 30000)
    
    return () => clearInterval(intervalId)
  }, [id])
  
  // Handle order cancellation
  const handleCancelOrder = async () => {
    // Only allow cancellation for orders that are still in preparation
    if (!['Placed', 'Preparing'].includes(order.status)) {
      toast.error("This order can't be cancelled anymore")
      return
    }
    
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api.orders.cancel(id, 'Customer request')
        // Refresh order data
        const orderResponse = await api.orders.getById(id)
        setOrder(orderResponse.data)
        toast.success('Order cancelled successfully')
      } catch (error) {
        console.error('Error cancelling order:', error)
        toast.error('Failed to cancel order')
      }
    }
  }
  
  if (loading) {
    return <LoadingState />
  }
  
  if (!order) {
    return (
      <div className="container-padded py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <p className="text-neutral-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Link to="/orders" className="btn-primary">View Your Orders</Link>
      </div>
    )
  }
  
  // Format order date
  const orderDate = new Date(order.createdAt).toLocaleString()
  
  // Get status info
  const statusInfo = getOrderStatusInfo(order.status)
  
  return (
    <div className="container-padded py-8">
      <div className="mb-6">
        <Link to="/orders" className="text-primary-500 hover:text-primary-600 font-medium">
          &larr; Back to My Orders
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Status header */}
        <div className={`p-6 text-white ${statusInfo.bgColor}`}>
          <div className="flex items-center">
            <div className="mr-4">
              {statusInfo.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Order {order.isCancelled ? 'Cancelled' : statusInfo.title}
              </h1>
              <p>{statusInfo.description}</p>
            </div>
          </div>
        </div>
        
        {/* Order progress tracker */}
        {!order.isCancelled && (
          <div className="p-6 border-b border-neutral-200">
            <OrderProgressTracker currentStatus={order.status} />
          </div>
        )}
        
        {/* Order details */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Order info */}
            <div className="flex-grow">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              
              <div className="space-y-4 mb-6">
                {/* <div>
                  <h3 className="font-medium mb-1">Order ID</h3>
                  <p className="text-neutral-600">{order._id}</p>
                </div> */}
                
                <div>
                  <h3 className="font-medium mb-1">Order Placed</h3>
                  <p className="text-neutral-600">{orderDate}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Payment Method</h3>
                  <p className="text-neutral-600">{order.paymentMethod}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Payment Status</h3>
                  <span className={`badge ${
                    order.paymentStatus === 'Paid' 
                      ? 'bg-secondary-100 text-secondary-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                
                {order.isCancelled && (
                  <div>
                    <h3 className="font-medium mb-1">Cancellation Reason</h3>
                    <p className="text-neutral-600">{order.cancellationReason || 'Customer request'}</p>
                  </div>
                )}
              </div>
              
              <h3 className="font-bold mb-3">Items</h3>
              <ul className="divide-y divide-neutral-200 mb-6">
                {order.items.map((item, index) => (
                  <li key={index} className="py-3 flex justify-between">
                    <div>
                      <span className="font-medium">{item.quantity}x</span> {item.name}
                    </div>
                    <div className="font-medium">
                      ${(item.price || 9.99 * item.quantity).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="bg-neutral-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-600">Subtotal</span>
                  <span>${(order.totalAmount * 0.8).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-600">Delivery Fee</span>
                  <span>$3.99</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-600">Service Fee</span>
                  <span>$1.99</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-600">Tax</span>
                  <span>${(order.totalAmount * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Right column - Delivery info */}
            <div className="md:w-80 shrink-0">
              <div className="bg-neutral-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-3">Restaurant</h3>
                {restaurant && (
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                      <img 
                        src={restaurant.url || 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg'}
                        alt={restaurant.restaurantName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{restaurant.restaurantName}</h4>
                      <p className="text-sm text-neutral-600">{restaurant.category}</p>
                    </div>
                  </div>
                )}
                
                <h3 className="font-bold mb-3">Delivery Location</h3>
                <div className="mb-4">
                  <MapComponent 
                    initialLocation={order.deliveryLocation.coordinates} 
                    onLocationChange={() => {}} // Read-only
                  />
                </div>
                
                {!order.isCancelled && order.status !== 'Delivered' && (
                  <button 
                    className="btn-outline w-full border-accent-500 text-accent-500 hover:bg-accent-50"
                    onClick={handleCancelOrder}
                    disabled={!['Placed', 'Preparing'].includes(order.status)}
                  >
                    {!['Placed', 'Preparing'].includes(order.status) 
                      ? 'Cannot Cancel Order' 
                      : 'Cancel Order'}
                  </button>
                )}
              </div>
              
              {!order.isCancelled && order.status === 'On the way' && (
                <div className="bg-primary-50 border border-primary-200 p-4 rounded-lg">
                  <h3 className="font-bold flex items-center mb-3">
                    <FiInfo className="mr-2 text-primary-500" />
                    Delivery Information
                  </h3>
                  <div className="mb-3">
                    <p className="font-medium mb-1">Delivery Person</p>
                    <p>Michael Rodriguez</p>
                  </div>
                  <button className="btn-primary w-full flex items-center justify-center">
                    <FiPhoneCall className="mr-2" /> 
                    Call Driver
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderProgressTracker({ currentStatus }) {
  const statuses = [
    { key: 'Placed', label: 'Order Placed' },
    { key: 'Preparing', label: 'Preparing' },
    { key: 'On the way' || 'OnTheWay' || 'Ready for Pickup', label: 'On the Way' }, 
    { key: 'Delivered', label: 'Delivered' }
  ]
  
  // Find the current status index
  const currentIndex = statuses.findIndex(s => s.key === currentStatus)
  
  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="absolute top-6 left-0 right-0 h-1 bg-neutral-200">
        <motion.div 
          className="h-full bg-primary-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, (currentIndex / (statuses.length - 1)) * 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      
      {/* Status Points */}
      <div className="flex justify-between relative">
        {statuses.map((status, index) => {
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex
          
          return (
            <div key={status.key} className="flex flex-col items-center z-10">
              <motion.div 
                className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted 
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-200 text-neutral-600'
                } ${
                  isCurrent ? 'ring-4 ring-primary-100' : ''
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? <FiCheck size={14} /> : index + 1}
              </motion.div>
              <span className={`text-sm font-medium ${isCurrent ? 'text-primary-600' : 'text-neutral-600'}`}>
                {status.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getOrderStatusInfo(status) {
  switch(status) {
    case 'Placed':
      return {
        title: 'Placed',
        description: 'Your order has been received and is waiting for confirmation.',
        icon: <FiClock size={24} />,
        bgColor: 'bg-primary-500'
      }
    case 'Preparing':
      return {
        title: 'Being Prepared',
        description: 'The restaurant is preparing your food.',
        icon: <FiClock size={24} />,
        bgColor: 'bg-primary-600'
      }
    case 'On the way':
      return {
        title: 'On the Way',
        description: 'Your food is on the way to your location.',
        icon: <FiMapPin size={24} />,
        bgColor: 'bg-secondary-500'
      }
    // case 'OnTheWay':
    //   return {
    //     title: 'On the Way',
    //     description: 'Your food is on the way to your location.',
    //     icon: <FiMapPin size={24} />,
    //     bgColor: 'bg-secondary-500'
    //   }
    // case 'Ready for Pickup':
    //   return {
    //     title: 'On the Way',
    //     description: 'Your food is on the way to your location.',
    //     icon: <FiMapPin size={24} />,
    //     bgColor: 'bg-secondary-500'
    //   }
    case 'Delivered':
      return {
        title: 'Delivered',
        description: 'Your order has been delivered. Enjoy your meal!',
        icon: <FiCheck size={24} />,
        bgColor: 'bg-secondary-600'
      }
    case 'Cancelled':
      return {
        title: 'Cancelled',
        description: 'This order has been cancelled.',
        icon: <FiInfo size={24} />,
        bgColor: 'bg-accent-500'
      }
    default:
      return {
        title: status,
        description: 'Your order is being processed.',
        icon: <FiClock size={24} />,
        bgColor: 'bg-primary-500'
      }
  }
}

function LoadingState() {
  return (
    <div className="container-padded py-8">
      <div className="h-6 w-32 bg-neutral-200 rounded mb-6 animate-pulse" />
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 bg-neutral-200 h-32 animate-pulse" />
        
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between relative">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-neutral-300 mb-2 animate-pulse" />
                <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-grow">
              <div className="h-8 w-40 bg-neutral-200 rounded mb-4 animate-pulse" />
              
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="mb-4">
                  <div className="h-5 w-24 bg-neutral-200 rounded mb-2 animate-pulse" />
                  <div className="h-5 w-48 bg-neutral-200 rounded animate-pulse" />
                </div>
              ))}
              
              <div className="h-7 w-32 bg-neutral-200 rounded mb-3 animate-pulse" />
              
              {[1, 2].map(i => (
                <div key={i} className="py-3 flex justify-between">
                  <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
            
            <div className="md:w-80 shrink-0">
              <div className="bg-neutral-50 p-4 rounded-lg h-64 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderStatusPage