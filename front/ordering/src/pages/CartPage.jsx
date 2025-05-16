import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'
import { toast } from 'react-toastify'

function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
  const navigate = useNavigate()
  
  // Calculate delivery fee
  const deliveryFee = items.length ? 3.99 : 0
  const serviceFee = items.length ? 0 : 0
  const tax = items.length ? (totalPrice * 0.08).toFixed(2) : 0
  
  // Grand total
  const grandTotal = (parseFloat(totalPrice) + parseFloat(deliveryFee) + parseFloat(serviceFee) + parseFloat(tax)).toFixed(2)
  
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }
  
  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    navigate('/checkout')
  }
  
  return (
    <div className="container-padded py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-grow">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ul className="divide-y divide-neutral-200">
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <motion.li 
                      key={item._id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                          <img 
                            src={item.url || 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg'} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-neutral-600">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center">
                          <QuantityControl
                            quantity={item.quantity}
                            onDecrease={() => handleQuantityChange(item._id, item.quantity - 1)}
                            onIncrease={() => handleQuantityChange(item._id, item.quantity + 1)}
                          />
                          
                          <button
                            className="ml-4 text-neutral-400 hover:text-accent-500"
                            onClick={() => removeItem(item._id)}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              
              <div className="p-4 bg-neutral-50 border-t border-neutral-200">
                <button 
                  className="text-sm text-accent-500 hover:text-accent-600 font-medium flex items-center"
                  onClick={clearCart}
                >
                  <FiTrash2 className="mr-1" />
                  Clear cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Tax</span>
                  <span>${tax}</span>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 pt-3 mb-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${grandTotal}</span>
                </div>
              </div>
              
              <button 
                className="btn-primary w-full py-3 mb-2"
                onClick={handleCheckout}
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight className="ml-2" />
              </button>
              
              <Link 
                to="/restaurants" 
                className="text-center block w-full text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                Add more items
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiShoppingBag size={32} className="text-neutral-400" />
      </div>
      <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-neutral-600 mb-6">
        Looks like you haven't added any items to your cart yet.
      </p>
      <Link to="/restaurants" className="btn-primary">
        Browse Restaurants
      </Link>
    </div>
  )
}

function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="flex items-center border border-neutral-300 rounded-md">
      <button
        className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <FiMinus size={16} />
      </button>
      
      <div className="px-2 text-center min-w-[2rem]">
        {quantity}
      </div>
      
      <button
        className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100"
        onClick={onIncrease}
        aria-label="Increase quantity"
      >
        <FiPlus size={16} />
      </button>
    </div>
  )
}

export default CartPage