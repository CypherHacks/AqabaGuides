import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  Mail,
} from 'lucide-react';
import { getCategories } from '../lib/airtable';
import logo from '../assets/logo.png';
import type { Category as AppCategory } from '../types';

const Footer: React.FC = () => {
  const [categories, setCategories] = useState<AppCategory[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await getCategories();
        const mapped: AppCategory[] = list.map((cat) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          icon: cat.icon,
          subcategories: [],
        }));
        setCategories(mapped);
      } catch (err) {
        console.error('Failed to load categories for footer:', err);
      }
    };

    loadCategories();
  }, []);

  const mainCategories = ['Logistics', 'Industrial', 'Tourism', 'Commercial'];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and Contact Info */}
          <div className="flex flex-col items-start">
            <Link to="/" className="mb-6 hover:opacity-90 transition-opacity">
              <img 
                src={logo} 
                alt="AqabaGuide" 
                className="h-16 w-48 object-contain bg-white p-3 rounded-lg shadow-sm" 
              />
              <p className="text-gray-400 mb-2 text-sm">ASEZA REG #2122012095</p>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted guide to Aqaba's business landscape, connecting visitors and businesses.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.tripadvisor.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-500 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-3.5-8v-1.5h7V14h-7zm0-2.5v-1.5h7v1.5h-7zm0-2.5V7h7v1.5h-7z"/>
                </svg>
              </a>
              <a href="https://wa.me/962776911233" className="text-gray-300 hover:text-green-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Main Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-orange-400 border-b border-gray-700 pb-2">Main Categories</h4>
            <ul className="space-y-2.5">
              {mainCategories.map((name) => {
                const category = categories.find((c) => c.name === name);
                return (
                  <li key={name}>
                    {category ? (
                      <Link
                        to={`/categories/${category.id}`}
                        className="text-gray-300 hover:text-white transition-colors flex items-start"
                      >
                        <span className="inline-block mr-2 text-orange-400">›</span>
                        {name}
                      </Link>
                    ) : (
                      <span className="text-gray-500 flex items-start">
                        <span className="inline-block mr-2 text-orange-400">›</span>
                        {name}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-orange-400 border-b border-gray-700 pb-2">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-start">
                  <span className="inline-block mr-2 text-orange-400">›</span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors flex items-start">
                  <span className="inline-block mr-2 text-orange-400">›</span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/list-your-business" className="text-gray-300 hover:text-white transition-colors flex items-start">
                  <span className="inline-block mr-2 text-orange-400">›</span>
                  List Your Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-orange-400 border-b border-gray-700 pb-2">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                <a href="tel:0776911233" className="text-gray-300 hover:text-white transition-colors">
                  00962776911233
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                <a href="mailto:aqabaguides@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  aqabaguides@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AqabaGuide. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;