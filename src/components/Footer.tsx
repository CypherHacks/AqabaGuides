// src/components/Footer.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getCategories } from '../lib/airtable';
import logo from '../assets/logo.png';
import type { Category as AppCategory } from '../types';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<AppCategory[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const list = await getCategories();
        const mapped = list.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          icon: cat.icon,
          subcategories: [],
        }));
        setCategories(mapped);
      } catch (err) {
        console.error(t('footer.loadError'), err);
      }
    }
    loadCategories();
  }, [t]);

  const mainCategories = [
    'Logistics',
    'Industrial',
    'Tourism',
    'Commercial',
    'Healthcare',
    'Governmental',
  ];

  const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
  const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="space-y-6">
            <Link to="/" onClick={scrollTop} className="inline-block transform hover:scale-105 transition">
              <img src={logo} alt={t('footer.logoAlt')} className="h-16 w-auto bg-white p-2 rounded-md shadow-md" />
            </Link>
            <p className="text-xs uppercase tracking-wide text-slate-400">ASEZA REG #2122012095</p>
            <p className="text-slate-300 leading-relaxed">{t('footer.description')}</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-full hover:bg-indigo-500 transition-colors transform hover:scale-110">
                <Facebook className="w-5 h-5 text-slate-100" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-full hover:bg-pink-500 transition-colors transform hover:scale-110">
                <Instagram className="w-5 h-5 text-slate-100" />
              </a>
              <a href="https://wa.me/962776911233" className="p-3 bg-slate-800 rounded-full hover:bg-green-400 transition-colors transform hover:scale-110">
                <svg className="w-5 h-5 text-slate-100" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335 .157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors transform hover:scale-110">
                <Linkedin className="w-5 h-5 text-slate-100" />
              </a>
            </div>
          </div>
          {/* Main Categories */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <h4 className="text-lg font-bold mb-4 text-indigo-400 border-b border-slate-700 pb-2 uppercase">{t('footer.mainCategoriesTitle')}</h4>
            <ul className="space-y-3">
              {mainCategories.map(name => {
                const found = categories.find(cat => normalize(cat.name) === normalize(name));
                return (
                  <li key={name}>
                    {found ? (
                      <Link to={`/categories/${found.id}`} onClick={scrollTop} className="flex items-center space-x-2 hover:text-slate-100 transition-colors">
                        <span className="text-indigo-400">›</span>
                        <span className="text-slate-300">{t(`categories.${name.toLowerCase()}`)}</span>
                      </Link>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-500">
                        <span className="text-indigo-400">›</span>
                        <span>{t(`categories.${name.toLowerCase()}`)}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Quick Links */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <h4 className="text-lg font-bold mb-4 text-indigo-400 border-b border-slate-700 pb-2 uppercase">{t('footer.quickLinksTitle')}</h4>
            <ul className="space-y-3">
              {['/', '/about', '/list-your-business'].map((path, idx) => {
                const label = ['nav.home', 'nav.about', 'nav.listYourBusiness'][idx];
                return (
                  <li key={path}>
                    <Link to={path} onClick={scrollTop} className="flex items-center space-x-2 hover:text-slate-100 transition-colors">
                      <span className="text-indigo-400">›</span>
                      <span className="text-slate-300">{t(label)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Contact Info */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <h4 className="text-lg font-bold mb-4 text-indigo-400 border-b border-slate-700 pb-2 uppercase">{t('footer.contactUsTitle')}</h4>
            <div className="space-y-4">
              <a href="tel:0776911233" onClick={scrollTop} className="flex items-center space-x-3 hover:text-slate-100 transition-colors">
                <div className="p-2 bg-slate-700 rounded-full hover:bg-indigo-500 transition-colors transform hover:scale-110">
                  <Phone className="w-5 h-5 text-slate-100" />
                </div>
                <span className="text-slate-300">00962776911233</span>
              </a>
              <a href="mailto:aqabaguides@gmail.com" onClick={scrollTop} className="flex items-center space-x-3 hover:text-slate-100 transition-colors">
                <div className="p-2 bg-slate-700 rounded-full hover:bg-indigo-500 transition-colors transform hover:scale-110">
                  <Mail className="w-5 h-5 text-slate-100" />
                </div>
                <span className="text-slate-300">aqabaguides@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
        {/* Bottom Legal */}
        <div className="mt-16 border-t border-slate-700 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} {t('header.siteName')}. {t('footer.allRights')}
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" onClick={scrollTop} className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link to="/terms" onClick={scrollTop} className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;