import { createContext, useContext, useState, useEffect } from 'react'

// Create the context
const AuthContext = createContext(null)

// For demo purposes, we'll use a mock user
const mockUser = {
  _id: 'user123',
  name: 'Demo User',
  email: 'demo@example.com',
  phone: '123-456-7890',
  address: {
    type: 'Point',
    coordinates: [-73.9857, 40.7484] // New York City
  }
}

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // For a real app, this would check local storage/cookies for auth token
  // and validate the token with your backend
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // For demo purposes, we'll use our mock user
        setUser(mockUser)
        setLoading(false)
      } catch (err) {
        console.error("Authentication error:", err)
        setError("Failed to authenticate")
        setLoading(false)
      }
    }
    
    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email, password) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call to your auth endpoint
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // For demo, we'll just set our mock user
      setUser(mockUser)
      setError(null)
      return true
    } catch (err) {
      setError(err.message || "Login failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setLoading(true)
    try {
      // In a real app, this would be an API call to your logout endpoint
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setUser(null)
      return true
    } catch (err) {
      setError(err.message || "Logout failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call to your register endpoint
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // For demo, we'll set the user with the provided data + mock ID
      setUser({ ...userData, _id: 'user_' + Date.now() })
      setError(null)
      return true
    } catch (err) {
      setError(err.message || "Registration failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}