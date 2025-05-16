import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome } from 'react-icons/fi'

function NotFoundPage() {
  return (
    <div className="container-padded min-h-[60vh] flex items-center justify-center py-16">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="text-9xl font-bold text-primary-500">404</span>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-neutral-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <Link to="/" className="btn-primary flex items-center justify-center mx-auto max-w-xs">
            <FiHome className="mr-2" />
            Go to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFoundPage