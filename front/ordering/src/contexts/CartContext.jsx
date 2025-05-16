import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

// Create the context
const CartContext = createContext(null)

// Provider component
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // Initialize from localStorage if available
    const savedCart = localStorage.getItem('foodExpressCart')
    return savedCart ? JSON.parse(savedCart) : { items: [], restaurantId: null }
  })

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodExpressCart', JSON.stringify(cart))
  }, [cart])

  // Calculate total items
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate total price
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Add item to cart
  const addItem = (item, restaurantId) => {
    // Check if adding from a different restaurant
    if (cart.restaurantId && cart.restaurantId !== restaurantId && cart.items.length > 0) {
      // Ask user if they want to clear cart
      if (window.confirm(
        "Your cart contains items from a different restaurant. Would you like to clear your cart and add this item instead?"
      )) {
        // Clear cart and add new item
        setCart({
          items: [{ ...item, quantity: 1 }],
          restaurantId
        })
        toast.success(`Added ${item.name} to your cart`)
      }
      return
    }

    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.items.findIndex(i => i._id === item._id)
      
      if (existingItemIndex >= 0) {
        // Increment quantity if item exists
        const updatedItems = [...prevCart.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        }
        
        toast.success(`Added another ${item.name} to your cart`)
        return {
          ...prevCart,
          items: updatedItems
        }
      } else {
        // Add new item with quantity 1
        toast.success(`Added ${item.name} to your cart`)
        return {
          restaurantId,
          items: [...prevCart.items, { ...item, quantity: 1 }]
        }
      }
    })
  }

  // Remove item from cart
  const removeItem = (itemId) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item._id !== itemId)
      
      return {
        ...prevCart,
        items: updatedItems,
        // If cart is empty, clear restaurant ID
        restaurantId: updatedItems.length > 0 ? prevCart.restaurantId : null
      }
    })
    
    toast.info('Item removed from cart')
  }

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeItem(itemId)
      return
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item._id === itemId ? { ...item, quantity } : item
      )
      
      return {
        ...prevCart,
        items: updatedItems
      }
    })
  }

  // Clear cart
  const clearCart = () => {
    setCart({ items: [], restaurantId: null })
    toast.info('Cart has been cleared')
  }

  // Check if restaurant is in cart
  const isRestaurantInCart = (restaurantId) => {
    return cart.restaurantId === restaurantId
  }

  const value = {
    cart,
    items: cart.items,
    restaurantId: cart.restaurantId,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isRestaurantInCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}