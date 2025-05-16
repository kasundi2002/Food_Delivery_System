import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiHome, FiMapPin, FiClock, FiUser, FiLogOut } from 'react-icons/fi'

// Animation variants
const menuVariants = {
  closed: {
    opacity: 0,
    x: '100%',
    transition: {
      duration: 0.2,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1,
      staggerDirection: 1
    }
  }
}

const itemVariants = {
  closed: { x: 20, opacity: 0 },
  open: { x: 0, opacity: 1 }
}

function MobileMenu({ isOpen, onClose }) {
  return (
    <motion.div 
      className={`fixed inset-0 z-50 bg-neutral-900/50 md:hidden ${isOpen ? 'block' : 'hidden'}`}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      onClick={onClose}
    >
      {/* Menu Content */}
      <motion.div 
        className="absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-xl flex flex-col p-5"
        variants={menuVariants}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        {/* User Info */}
        <div className="pb-4 mb-4 border-b border-neutral-200">
          <motion.div variants={itemVariants} className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
              <FiUser size={22} />
            </div>
            <div className="ml-3">
              <p className="font-medium">Guest User</p>
              <p className="text-sm text-neutral-500">guest@example.com</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-3">
            <MenuItem to="/" icon={<FiHome size={20} />} label="Home" variants={itemVariants} onClick={onClose} />
            <MenuItem to="/restaurants" icon={<FiMapPin size={20} />} label="Restaurants" variants={itemVariants} onClick={onClose} />
            <MenuItem to="/orders" icon={<FiClock size={20} />} label="My Orders" variants={itemVariants} onClick={onClose} />
            <MenuItem to="/profile" icon={<FiUser size={20} />} label="Profile" variants={itemVariants} onClick={onClose} />
          </ul>
        </nav>

        {/* Footer */}
        <motion.div variants={itemVariants} className="pt-4 mt-auto border-t border-neutral-200">
          <button 
            className="flex items-center w-full px-3 py-2 text-left text-neutral-700 hover:bg-neutral-100 rounded-md"
            onClick={() => {
              // In a real app, you would log out the user
              console.log("Logging out...")
              onClose()
            }}
          >
            <FiLogOut size={20} className="mr-3 text-neutral-500" />
            <span>Log out</span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function MenuItem({ to, icon, label, variants, onClick }) {
  return (
    <motion.li variants={variants}>
      <Link 
        to={to} 
        className="flex items-center px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-md"
        onClick={onClick}
      >
        <span className="mr-3 text-neutral-500">{icon}</span>
        <span>{label}</span>
      </Link>
    </motion.li>
  )
}

export default MobileMenu