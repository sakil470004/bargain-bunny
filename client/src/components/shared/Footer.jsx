import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';




const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-primary">
              BargainBunny
            </Link>
            <p className="text-gray-600 text-sm">
              Your trusted marketplace for buying and selling items locally.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="text-gray-600 hover:text-primary">
                  Transactions
                </Link>
              </li>
              <li>
                <Link to="/create-item" className="text-gray-600 hover:text-primary">
                  Sell Item
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=Electronics" className="text-gray-600 hover:text-primary">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/?category=Furniture" className="text-gray-600 hover:text-primary">
                  Furniture
                </Link>
              </li>
              <li>
                <Link to="/?category=Clothing" className="text-gray-600 hover:text-primary">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/?category=Books" className="text-gray-600 hover:text-primary">
                  Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {currentYear} BargainBunny. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-600 hover:text-primary text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-primary text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-600 hover:text-primary text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;