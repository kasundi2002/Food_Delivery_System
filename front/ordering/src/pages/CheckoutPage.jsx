import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMap, FiCreditCard, FiCheckCircle } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import api from '../api'
import { toast } from 'react-toastify'
import MapComponent from '../components/map/MapComponent'

function CheckoutPage() {
  const { user } = useAuth()
  const { cart, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  
  // Form state
  const [deliveryAddress, setDeliveryAddress] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [deliveryLocation, setDeliveryLocation] = useState({
    type: 'Point',
    coordinates: [-73.9857, 40.7484] // Default to NYC
  })
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [loading, setLoading] = useState(false)
  
  // Calculate fees
  const deliveryFee = 3.99
  const serviceFee = 0
  const tax = (totalPrice * 0.08).toFixed(2)
  const grandTotal = (parseFloat(totalPrice) + parseFloat(deliveryFee) + parseFloat(serviceFee) + parseFloat(tax)).toFixed(2)
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/cart')
      toast.error('Your cart is empty')
    }
  }, [cart.items.length, navigate])
  
  // Submit order
  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please log in to place an order')
      return
    }
    console.log
    try {
      setLoading(true)
      console.log(cart)
      // Prepare order data
      const orderData = {
        customerID: user._id,
        restaurantId: cart.restaurantId,
        items: cart.items.map(item => ({
          foodItem: item._id,
          name: item.name,
          quantity: item.quantity
        })),
        deliveryLocation,
        restaurantLocation: {
          type: 'Point', 
          coordinates: [-73.9857, 40.7484] // Mocked for demo
        },
        paymentMethod,
        paymentStatus: 'Pending',
        totalAmount: parseFloat(grandTotal),
        deliveryTimeEstimate: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min from now
      }
      
      // Submit order
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTYyNGNkZGYzZmY4YjY2YWM3OGFkNyIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0NjM1MzMwMywiZXhwIjoxNzQ2NDM5NzAzfQ.gmUGDhCX0Wka32TV2U80MbXUzrC8WS_SF6jgL8EMBu8'
      const response = await api.orders.create(orderData,token)
      
      // Clear cart on successful order
      clearCart()
      
      // Show success and redirect
      toast.success('Order placed successfully!')
      navigate(`/orders/${response.data._id}`)
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container-padded py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-grow">
          <form onSubmit={handleSubmitOrder}>
            {/* Delivery Address Section */}
            {/* <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="flex items-center text-xl font-bold mb-4">
                <FiMap className="mr-2 text-primary-500" />
                Delivery Address
              </h2>
              
              <div className="mb-6">
                <MapComponent 
                  initialLocation={deliveryLocation.coordinates} 
                  onLocationChange={(coords) => {
                    setDeliveryLocation({
                      type: 'Point',
                      coordinates: coords
                    })
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="streetAddress">Street Address</label>
                  <input
                    id="streetAddress"
                    type="text"
                    className="input"
                    value={deliveryAddress.streetAddress}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, streetAddress: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="label" htmlFor="city">City</label>
                  <input
                    id="city"
                    type="text"
                    className="input"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="label" htmlFor="state">State</label>
                  <input
                    id="state"
                    type="text"
                    className="input"
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="label" htmlFor="zipCode">ZIP Code</label>
                  <input
                    id="zipCode"
                    type="text"
                    className="input"
                    value={deliveryAddress.zipCode}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, zipCode: e.target.value})}
                    required
                  />
                </div>
              </div>
            </section> */}
            
            {/* Payment Method Section */}
            <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="flex items-center text-xl font-bold mb-4">
                <FiCreditCard className="mr-2 text-primary-500" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <PaymentOption
                  id="creditCard"
                  name="Credit Card"
                  description="Pay with your credit card"
                  selected={paymentMethod === 'Credit Card'}
                  onChange={() => setPaymentMethod('Credit Card')}
                />
                
                <PaymentOption
                  id="cashOnDelivery"
                  name="Cash on Delivery"
                  description="Pay in cash upon delivery"
                  selected={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                />
                
                <PaymentOption
                  id="upi"
                  name="UPI"
                  description="Pay using UPI"
                  selected={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                />
                
                <PaymentOption
                  id="netBanking"
                  name="Net Banking"
                  description="Pay directly from your bank account"
                  selected={paymentMethod === 'Net Banking'}
                  onChange={() => setPaymentMethod('Net Banking')}
                />
              </div>
            </section>
            
            {/* Submit Button (Mobile) */}
            <div className="lg:hidden mb-8">
              <button
                type="submit"
                className="btn-primary w-full py-3"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Place Order • $${grandTotal}`}
              </button>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            
            {/* Order Items */}
            <div className="max-h-60 overflow-y-auto mb-4">
              <ul className="space-y-3">
                {cart.items.map(item => (
                  <li key={item._id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity} x {item.name}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Costs Breakdown */}
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
            
            {/* Total */}
            <div className="border-t border-neutral-200 pt-3 mb-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${grandTotal}</span>
              </div>
            </div>
            
            {/* Submit Button (Desktop) */}
            <div className="hidden lg:block">
              <button
                type="submit"
                className="btn-primary w-full py-3"
                onClick={handleSubmitOrder}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentOption({ id, name, description, selected, onChange }) {
  return (
    <label 
      htmlFor={id}
      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
        selected 
          ? 'border-primary-500 bg-primary-50'
          : 'border-neutral-300 hover:bg-neutral-50'
      }`}
    >
      <input
        id={id}
        type="radio"
        className="sr-only"
        checked={selected}
        onChange={onChange}
      />
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
        selected ? 'border-primary-500' : 'border-neutral-400'
      }`}>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 rounded-full bg-primary-500"
          />
        )}
      </div>
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-sm text-neutral-600">{description}</div>
      </div>
    </label>
  )
}

export default CheckoutPage