import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen(prev => !prev);
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  return (
    <>
      <motion.header
        className="fixed w-full z-50 backdrop-blur bg-white/80 shadow-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sponsor Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-xs md:text-sm font-semibold py-2 text-center">
          {t('sponsor.banner')}
        </div>

        {/* Logo & Navigation */}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 md:space-x-4 group">
            <motion.img
              src={logo}
              alt={t('header.logoAlt')}
              className="h-10 md:h-12 object-contain"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <span className="hidden sm:block text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              {t('header.siteName')}
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-10">
            <Link
              to="/"
              className="relative group font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {t('nav.home')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
            </Link>

            <Link
              to="/about"
              className="relative group font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {t('nav.about')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
            </Link>

            <Link
              to="/list-your-business"
              className="inline-block bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg hover:from-indigo-600 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap font-semibold"
            >
              {t('nav.listYourBusiness')}
            </Link>

            {/* Language Selector */}
            <div>
              <select
                value={i18n.language}
                onChange={e => changeLanguage(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="en">EN</option>
                <option value="ar">العربية</option>
                <option value="fr">FR</option>
                <option value="es">ES</option>
                <option value="de">DE</option>
                <option value="it">IT</option>
                <option value="ru">RU</option>
                <option value="ja">日本語</option>
                <option value="tr">TR</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMobileMenu}
            aria-label={t('aria.toggleMenu')}
            className="lg:hidden p-2 rounded-md hover:bg-gray-200 focus:outline-none transition-all"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />
            <motion.nav
              className="fixed top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-xl p-6 space-y-6 z-50"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <Link
                to="/"
                onClick={toggleMobileMenu}
                className="block text-gray-700 hover:text-indigo-600 text-lg font-medium"
              >
                {t('nav.home')}
              </Link>

              <Link
                to="/about"
                onClick={toggleMobileMenu}
                className="block text-gray-700 hover:text-indigo-600 text-lg font-medium"
              >
                {t('nav.about')}
              </Link>

              <Link
                to="/list-your-business"
                onClick={toggleMobileMenu}
                className="block bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-md text-center font-semibold transform hover:-translate-y-0.5 transition-all duration-300"
              >
                {t('nav.listYourBusiness')}
              </Link>

              <div>
                <select
                  value={i18n.language}
                  onChange={e => changeLanguage(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="ru">Русский</option>
                  <option value="ja">日本語</option>
                  <option value="tr">Türkçe</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
