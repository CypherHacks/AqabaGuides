import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileOpen(prev => !prev);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Sponsor Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 h-10 flex items-center justify-center">
        <p className="text-white text-sm text-center opacity-80">
          Premium Aqaba Business Directory - Partner With Us
        </p>
      </div>

      {/* Logo + Navigation */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="AqabaGuide"
              className="h-10 w-auto md:h-12 object-contain"
            />
            <span className="hidden sm:block text-xl md:text-2xl font-bold text-gray-800">
              AqabaGuide
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-500 font-medium text-sm md:text-base"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-orange-500 font-medium text-sm md:text-base"
            >
              About Us
            </Link>
            <Link
              to="/list-your-business"
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 shadow whitespace-nowrap text-sm md:text-base"
            >
              List Your Business
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <nav className="flex flex-col px-4 py-2 space-y-2">
              <Link
                to="/"
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-orange-500 font-medium"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-orange-500 font-medium"
              >
                About Us
              </Link>
              <Link
                to="/list-your-business"
                onClick={toggleMobileMenu}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 shadow whitespace-nowrap"
              >
                List Your Business
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
