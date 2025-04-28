import { Heart, Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-primary-500" />
              <span className="text-xl font-bold text-white ml-2">CyberTech</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted platform for cybersecurity education. We provide high-quality courses taught by industry experts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-400 hover:text-primary-500 transition">
                  Browse Courses
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-primary-500 transition">
                  Become an Instructor
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-primary-500 transition">
                  Student Success Stories
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-primary-500 transition">
                  Career Guidance
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-primary-500 transition">
                  Help Center
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-400 hover:text-primary-500 transition">
                  Penetration Testing
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-primary-500 transition">
                  Malware Analysis
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-primary-500 transition">
                  Network Security
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-primary-500 transition">
                  Cryptography
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-primary-500 transition">
                  Defensive Security
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-500 mt-1" />
                <p className="ml-2 text-gray-400">
                  123 Security Street<br />
                  Cyber City, CS 12345<br />
                  United States
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary-500" />
                <p className="ml-2 text-gray-400">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary-500" />
                <p className="ml-2 text-gray-400">support@cybertech.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 pb-4 mb-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white font-semibold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with the latest in cybersecurity education</p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-primary-500"
              />
              <button className="px-6 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} CyberTech. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-primary-500 text-sm transition">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-primary-500 text-sm transition">
                Terms of Service
              </button>
              <div className="flex items-center text-sm text-gray-400">
                Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> by CyberTech Team
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}