import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Smartphone,
  CreditCard,
  Shield,
  Truck,
  Star,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  
    const navigate = useNavigate();
  

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-bold text-3xl">
                <span className="text-orange-500">G</span>
                <span>o</span>
                <span className="text-orange-500">G</span>
                <span>ru</span>
                <span>b</span>
                <span>.</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your favorite food delivered fresh and fast. From quick bites to
              full meals, we bring the best flavors right to your doorstep.
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-500">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate("/products")}
                  className="text-gray-300 hover:text-orange-500 flex items-center group"
                >
                  <ChevronRight className="w-3 h-3 mr-1 group-hover:translate-x-1 transition-transform" />
                  Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/about")}
                  className="text-gray-300 hover:text-orange-500 flex items-center group"
                >
                  <ChevronRight className="w-3 h-3 mr-1 group-hover:translate-x-1 transition-transform" />
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="text-gray-300 hover:text-orange-500 flex items-center group"
                >
                  <ChevronRight className="w-3 h-3 mr-1 group-hover:translate-x-1 transition-transform" />
                  Contact
                </button>
              </li>
              
              <li>
                <button
                  onClick={() => navigate("/profile")}
                  className="text-gray-300 hover:text-orange-500 flex items-center group"
                >
                  <ChevronRight className="w-3 h-3 mr-1 group-hover:translate-x-1 transition-transform" />
                  My Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/support")}
                  className="text-gray-300 hover:text-orange-500 flex items-center group"
                >
                  <ChevronRight className="w-3 h-3 mr-1 group-hover:translate-x-1 transition-transform" />
                  Help & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-500">
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    123 Food Street, Delicious District,
                    <br />
                    Taste City, TC 12345
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <p className="text-gray-300 text-sm">+91 7907770534</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <p className="text-gray-300 text-sm">hello@gogrub.com</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                <div className="text-gray-300 text-sm">
                  <p>Mon - Sun: 8:00 AM - 11:00 PM</p>
                  <p className="text-orange-400 font-medium">
                    Always Open for You!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* App Download & Features */}
          <div className="space-y-4">
            {/* Features */}
            <div className="pt-4 border-t border-gray-800">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-300">Free Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-300">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-300">Quality Food</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-300">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <button
                onClick={() => handleNavigation("/privacy")}
                className="hover:text-orange-500 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => handleNavigation("/terms")}
                className="hover:text-orange-500 transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => handleNavigation("/cookies")}
                className="hover:text-orange-500 transition-colors"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2024 Go Grub. All rights reserved. | Made with for food lovers
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>🌟 Rated 4.8/5 by 10,000+ customers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
