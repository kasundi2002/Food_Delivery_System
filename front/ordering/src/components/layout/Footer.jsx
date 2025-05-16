import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-neutral-800 text-neutral-300">
      <div className="container-padded py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-3">FoodExpress</h3>
            <p className="text-sm mb-4">
              Order food from your favorite restaurants and track your delivery in real-time.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<FiInstagram size={18} />} />
              <SocialLink href="#" icon={<FiFacebook size={18} />} />
              <SocialLink href="#" icon={<FiTwitter size={18} />} />
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Explore</h4>
            <ul className="space-y-2">
              <FooterLink to="/restaurants">Restaurants</FooterLink>
              <FooterLink to="/orders">My Orders</FooterLink>
              <FooterLink to="/profile">My Account</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Get Help</h4>
            <ul className="space-y-2">
              <FooterLink to="#">Help Center</FooterLink>
              <FooterLink to="#">Delivery Info</FooterLink>
              <FooterLink to="#">Contact Us</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <FooterLink to="#">Terms of Service</FooterLink>
              <FooterLink to="#">Privacy Policy</FooterLink>
              <FooterLink to="#">Refund Policy</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-6 text-sm text-neutral-400 flex flex-col md:flex-row justify-between items-center">
          <p>© {currentYear} FoodExpress. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ for foodies everywhere</p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
        {children}
      </Link>
    </li>
  )
}

function SocialLink({ href, icon }) {
  return (
    <a 
      href={href} 
      className="text-neutral-400 hover:text-white transition-colors duration-200"
      target="_blank" 
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  )
}

export default Footer