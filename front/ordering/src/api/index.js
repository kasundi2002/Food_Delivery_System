import axios from 'axios'

// Create instances for each service
const restaurantService = axios.create({
  baseURL: import.meta.env.VITE_RESTAURANT_SERVICE_URL
})

const productService = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_SERVICE_URL
})

const orderService = axios.create({
  baseURL: import.meta.env.VITE_ORDER_SERVICE_URL
})

// Request interceptor to add auth token to requests
const addAuthToken = (config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

restaurantService.interceptors.request.use(addAuthToken)
productService.interceptors.request.use(addAuthToken)
orderService.interceptors.request.use(addAuthToken)

// Error handler for response interceptors
const handleError = (error) => {
  // Handle errors (log, show notifications, etc.)
  console.error('API Error:', error)
  
  // Pass error to caller
  return Promise.reject(error)
}

restaurantService.interceptors.response.use(response => response, handleError)
productService.interceptors.response.use(response => response, handleError)
orderService.interceptors.response.use(response => response, handleError)

// For development/demo, we'll add a delay and mock data when needed
const MOCK_DELAY = 600 // ms
const USE_MOCK = false

// Helper for adding delay in development
const withDelay = (data) => {
  if (import.meta.env.DEV) {
    return new Promise(resolve => {
      setTimeout(() => resolve(data), MOCK_DELAY)
    })
  }
  return Promise.resolve(data)
}

// Export API methods
export const api = {
  // Restaurant endpoints
  restaurants: {
    getAll: async (params = {}) => {
      if (USE_MOCK) {
        return withDelay({ data: mockRestaurants })
      }
      return restaurantService.get('/api/restaurants', { params })
    },
    
    getById: async (id) => {
      if (USE_MOCK) {
        const restaurant = mockRestaurants.find(r => r._id === id)
        return withDelay({ data: restaurant })
      }
      return restaurantService.get(`/api/restaurants/${id}`)
    },
    
    search: async (query) => {
      if (USE_MOCK) {
        const filtered = mockRestaurants.filter(r => 
          r.restaurantName.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
        )
        return withDelay({ data: filtered })
      }
      return restaurantService.get('/api/restaurant/search', { params: { query } })
    }
  },
  
  // Product endpoints
  products: {
    getByRestaurant: async (restaurantId) => {
      if (USE_MOCK) {
        const products = mockProducts.filter(p => p.restaurantId === restaurantId)
        return withDelay({ data: products })
      }
      return productService.get(`/api/products`, { params: { restaurantId } })
    },
    
    getById: async (id) => {
      if (USE_MOCK) {
        const product = mockProducts.find(p => p._id === id)
        return withDelay({ data: product })
      }
      return productService.get(`/api/products/${id}`)
    }
  },
  
  // Order endpoints
  orders: {
    getAll: async () => {
      if (USE_MOCK) {
        return withDelay({ data: mockOrders })
      }
      return orderService.get('/api/orders')
    },
    
    getById: async (id) => {
      if (USE_MOCK) {
        const order = mockOrders.find(o => o._id === id)
        return withDelay({ data: order })
      }
      return orderService.get(`/api/orders/getOrder/${id}`)
    },
    
    create: async (orderData,token) => {
      if (USE_MOCK) {
        const newOrder = {
          _id: `order_${Date.now()}`,
          ...orderData,
          status: 'Placed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockOrders.push(newOrder)
        return withDelay({ data: newOrder })
      }
      return orderService.post('/api/orders/create ', orderData , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    
    updateStatus: async (id, status) => {
      if (USE_MOCK) {
        const orderIndex = mockOrders.findIndex(o => o._id === id)
        if (orderIndex >= 0) {
          mockOrders[orderIndex].status = status
          mockOrders[orderIndex].updatedAt = new Date().toISOString()
          
          if (status === 'Delivered') {
            mockOrders[orderIndex].deliveredAt = new Date().toISOString()
          }
          
          return withDelay({ data: mockOrders[orderIndex] })
        }
        throw new Error('Order not found')
      }
      return orderService.patch(`/api/orders/${id}/status`, { status })
    },
    
    cancel: async (id, reason) => {
      if (USE_MOCK) {
        const orderIndex = mockOrders.findIndex(o => o._id === id)
        if (orderIndex >= 0) {
          mockOrders[orderIndex].status = 'Cancelled'
          mockOrders[orderIndex].isCancelled = true
          mockOrders[orderIndex].cancellationReason = reason
          mockOrders[orderIndex].updatedAt = new Date().toISOString()
          
          return withDelay({ data: mockOrders[orderIndex] })
        }
        throw new Error('Order not found')
      }
      return orderService.post(`/api/orders/${id}/cancel`, { reason })
    }
  }
}

// Mock data for development
const mockRestaurants = [
  {
    _id: 'rest1',
    restaurantName: 'Burger Palace',
    restaurantOwner: 'John Smith',
    address: {
      type: 'Point',
      coordinates: [-73.9857, 40.7484] // New York City
    },
    phone: '123-456-7890',
    email: 'info@burgerpalace.com',
    category: 'Fast Food',
    status: 'Active',
    url: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'
  },
  {
    _id: 'rest2',
    restaurantName: 'Pizza Paradise',
    restaurantOwner: 'Maria Rossi',
    address: {
      type: 'Point',
      coordinates: [-74.0060, 40.7128]
    },
    phone: '123-456-7891',
    email: 'info@pizzaparadise.com',
    category: 'Italian',
    status: 'Active',
    url: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg'
  },
  {
    _id: 'rest3',
    restaurantName: 'Sushi Express',
    restaurantOwner: 'Takashi Yamamoto',
    address: {
      type: 'Point',
      coordinates: [-73.9900, 40.7300]
    },
    phone: '123-456-7892',
    email: 'info@sushiexpress.com',
    category: 'Japanese',
    status: 'Active',
    url: 'https://images.pexels.com/photos/684965/pexels-photo-684965.jpeg'
  },
  {
    _id: 'rest4',
    restaurantName: 'Taco Factory',
    restaurantOwner: 'Carlos Mendez',
    address: {
      type: 'Point',
      coordinates: [-73.9950, 40.7200]
    },
    phone: '123-456-7893',
    email: 'info@tacofactory.com',
    category: 'Mexican',
    status: 'Active',
    url: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg'
  },
  {
    _id: 'rest5',
    restaurantName: 'Curry House',
    restaurantOwner: 'Priya Patel',
    address: {
      type: 'Point',
      coordinates: [-74.0100, 40.7400]
    },
    phone: '123-456-7894',
    email: 'info@curryhouse.com',
    category: 'Indian',
    status: 'Active',
    url: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'
  }
]

const mockProducts = [
  // Burger Palace
  {
    _id: 'prod1',
    name: 'Classic Cheeseburger',
    price: 9.99,
    description: 'Juicy beef patty with American cheese, lettuce, tomato, and special sauce.',
    url: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    restaurantId: 'rest1',
    isAvailable: true
  },
  {
    _id: 'prod2',
    name: 'Double Bacon Burger',
    price: 12.99,
    description: 'Two beef patties with crispy bacon, cheddar cheese, and BBQ sauce.',
    url: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
    restaurantId: 'rest1',
    isAvailable: true
  },
  {
    _id: 'prod3',
    name: 'Veggie Burger',
    price: 10.99,
    description: 'Plant-based patty with avocado, lettuce, tomato, and vegan mayo.',
    url: 'https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg',
    restaurantId: 'rest1',
    isAvailable: true
  },
  
  // Pizza Paradise
  {
    _id: 'prod4',
    name: 'Margherita Pizza',
    price: 14.99,
    description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil.',
    url: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
    restaurantId: 'rest2',
    isAvailable: true
  },
  {
    _id: 'prod5',
    name: 'Pepperoni Pizza',
    price: 16.99,
    description: 'Traditional pizza topped with pepperoni slices and mozzarella cheese.',
    url: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg',
    restaurantId: 'rest2',
    isAvailable: true
  },
  {
    _id: 'prod6',
    name: 'Supreme Pizza',
    price: 18.99,
    description: 'Loaded with pepperoni, sausage, bell peppers, onions, and olives.',
    url: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
    restaurantId: 'rest2',
    isAvailable: true
  },
  
  // Sushi Express
  {
    _id: 'prod7',
    name: 'California Roll',
    price: 8.99,
    description: 'Crab, avocado, and cucumber wrapped in seaweed and rice.',
    url: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg',
    restaurantId: 'rest3',
    isAvailable: true
  },
  {
    _id: 'prod8',
    name: 'Salmon Nigiri',
    price: 10.99,
    description: 'Fresh salmon slices over pressed vinegared rice.',
    url: 'https://images.pexels.com/photos/684965/pexels-photo-684965.jpeg',
    restaurantId: 'rest3',
    isAvailable: true
  },
  {
    _id: 'prod9',
    name: 'Dragon Roll',
    price: 14.99,
    description: 'Eel and cucumber inside, topped with avocado and eel sauce.',
    url: 'https://images.pexels.com/photos/884596/pexels-photo-884596.jpeg',
    restaurantId: 'rest3',
    isAvailable: true
  },
  
  // Taco Factory
  {
    _id: 'prod10',
    name: 'Street Tacos',
    price: 9.99,
    description: 'Three corn tortillas with marinated beef, onions, and cilantro.',
    url: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg',
    restaurantId: 'rest4',
    isAvailable: true
  },
  {
    _id: 'prod11',
    name: 'Chicken Quesadilla',
    price: 11.99,
    description: 'Flour tortilla filled with grilled chicken, melted cheese, and peppers.',
    url: 'https://images.pexels.com/photos/2092897/pexels-photo-2092897.jpeg',
    restaurantId: 'rest4',
    isAvailable: true
  },
  {
    _id: 'prod12',
    name: 'Guacamole & Chips',
    price: 7.99,
    description: 'Freshly made guacamole served with crispy tortilla chips.',
    url: 'https://images.pexels.com/photos/5737247/pexels-photo-5737247.jpeg',
    restaurantId: 'rest4',
    isAvailable: true
  },
  
  // Curry House
  {
    _id: 'prod13',
    name: 'Butter Chicken',
    price: 15.99,
    description: 'Tender chicken in a rich, creamy tomato sauce with Indian spices.',
    url: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    restaurantId: 'rest5',
    isAvailable: true
  },
  {
    _id: 'prod14',
    name: 'Vegetable Biryani',
    price: 13.99,
    description: 'Fragrant basmati rice cooked with mixed vegetables and aromatic spices.',
    url: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg',
    restaurantId: 'rest5',
    isAvailable: true
  },
  {
    _id: 'prod15',
    name: 'Garlic Naan',
    price: 3.99,
    description: 'Soft bread topped with garlic and butter, baked in a tandoor oven.',
    url: 'https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg',
    restaurantId: 'rest5',
    isAvailable: true
  }
]

const mockOrders = [
  {
    _id: 'order1',
    customerID: 'user123',
    restaurantID: 'rest1',
    items: [
      {
        foodItem: 'prod1',
        name: 'Classic Cheeseburger',
        quantity: 2
      },
      {
        foodItem: 'prod2',
        name: 'Double Bacon Burger',
        quantity: 1
      }
    ],
    deliveryLocation: {
      type: 'Point',
      coordinates: [-73.9700, 40.7600]
    },
    restaurantLocation: {
      type: 'Point',
      coordinates: [-73.9857, 40.7484]
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    status: 'Delivered',
    totalAmount: 32.97,
    deliveryTimeEstimate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    deliveredAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    isCancelled: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
  },
  {
    _id: 'order2',
    customerID: 'user123',
    restaurantID: 'rest3',
    items: [
      {
        foodItem: 'prod7',
        name: 'California Roll',
        quantity: 2
      },
      {
        foodItem: 'prod8',
        name: 'Salmon Nigiri',
        quantity: 3
      }
    ],
    deliveryLocation: {
      type: 'Point',
      coordinates: [-73.9700, 40.7600]
    },
    restaurantLocation: {
      type: 'Point',
      coordinates: [-73.9900, 40.7300]
    },
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    status: 'On the way',
    totalAmount: 50.95,
    deliveryTimeEstimate: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 minutes from now
    isCancelled: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
  }
]

export default api