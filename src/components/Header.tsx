import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen(prev => !prev);
  const closeMobileMenu = () => setMobileOpen(false);
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  return (
    <header className="sticky top-0 z-50">
      {/* Sponsor Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 h-10 flex items-center justify-center">
        <p className="text-white text-sm md:text-base font-medium opacity-90">
          {t('sponsor.banner')}
        </p>
      </div>

      {/* Logo + Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="w-full flex items-center h-24 justify-between relative px-4 md:px-8">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center space-x-4 md:space-x-6 group">
            <img
              src={logo}
              alt={t('header.logoAlt')}
              className="h-14 md:h-16 object-contain transition-transform group-hover:scale-105"
            />
            <span className="hidden sm:block text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              {t('header.siteName')}
            </span>
          </Link>

          {/* Desktop Nav & Controls Wrapper */}
          <div className="hidden md:flex items-center space-x-12">
            <nav className="flex items-center space-x-12">
              <Link
                to="/"
                className="relative group font-medium text-base text-gray-700 hover:text-orange-500 transition-colors duration-200"
              >
                {t('nav.home')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/about"
                className="relative group font-medium text-base text-gray-700 hover:text-orange-500 transition-colors duration-200"
              >
                {t('nav.about')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/list-your-business"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap font-semibold"
              >
                {t('nav.listYourBusiness')}
              </Link>
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={i18n.language}
                  onChange={e => changeLanguage(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden absolute right-8 p-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors"
            aria-label={t('aria.toggleMenu')}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* --- Mobile Sidebar & Overlay (Only on mobile) --- */}
        <AnimatePresence>
          {mobileOpen && (
            <div className="md:hidden">
              {/* Overlay */}
              <motion.div
                className="fixed inset-0 bg-black/40 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobileMenu}
              />

              {/* Sidebar */}
              <motion.div
                className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl z-50 flex flex-col px-6 py-8"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              >
                <div className="flex items-center justify-between mb-10">
                  <span className="font-bold text-xl text-gray-800">{t('header.siteName')}</span>
                  <button
                    className="p-2 rounded hover:bg-gray-200"
                    onClick={closeMobileMenu}
                    aria-label={t('aria.closeMenu')}
                  >
                    <X size={28} />
                  </button>
                </div>
                <nav className="flex flex-col gap-5">
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="text-gray-700 hover:text-orange-500 font-medium text-lg transition-colors"
                  >
                    {t('nav.home')}
                  </Link>
                  <Link
                    to="/about"
                    onClick={closeMobileMenu}
                    className="text-gray-700 hover:text-orange-500 font-medium text-lg transition-colors"
                  >
                    {t('nav.about')}
                  </Link>
                  <Link
                    to="/list-your-business"
                    onClick={closeMobileMenu}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-md text-center font-semibold transition-all"
                  >
                    {t('nav.listYourBusiness')}
                  </Link>
                  {/* Language Selector */}
                  <div className="relative mt-6">
                    <select
                      value={i18n.language}
                      onChange={e => changeLanguage(e.target.value)}
                      className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </nav>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
