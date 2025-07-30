/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import {
  getCategories,
  getSubcategories,
  getAllBusinesses,
  Subcategory,
  Business,
} from '../lib/airtable';
import { Search as SearchIcon } from 'lucide-react';
import Map from '../assets/Map.png';
import MapPortrait from '../assets/MapPortrait.png';
import { useTranslation } from 'react-i18next';

// -------------------- Types & Cache --------------------
interface SubWithCat extends Subcategory {
  categoryId: string;
}

type Suggestion =
  | { type: 'business'; id: string; name: string }
  | { type: 'subcategory'; id: string; name: string; categoryId: string };

type SearchData = {
  subcategories: SubWithCat[];
  businesses: Business[];
};

const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
let searchCache: (SearchData & { timestamp: number }) | null = null;

const fetchSearchData = async (_locale: string): Promise<SearchData> => {
  const categories = await getCategories();
  const subArrays = await Promise.all(
    categories.map((cat) =>
      getSubcategories(cat.id).then((subs) =>
        subs.map((s) => ({ ...s, categoryId: cat.id } as SubWithCat))
      )
    )
  );
  const allSubs = subArrays.flat();
  const businesses = await getAllBusinesses();
  return {
    subcategories: allSubs,
    businesses,
  };
};

// -------------------- Component --------------------
const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [subcategories, setSubcategories] = useState<SubWithCat[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const now = Date.now();
        let data: SearchData;
        if (searchCache && now - searchCache.timestamp < CACHE_TTL) {
          data = searchCache;
        } else {
          data = await fetchSearchData(i18n.language);
          searchCache = { ...data, timestamp: now };
        }
        if (!cancelled) {
          setSubcategories(data.subcategories);
          setBusinesses(data.businesses);
        }
      } catch (e) {
        console.error(t('hero.loadError'), e);
        if (!cancelled) setError(t('hero.loadError'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t, i18n.language]);

  useEffect(() => {
    if (!query.trim() || loading || error) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();

    const bizMatches: Suggestion[] = businesses
      .filter((b) => {
        const ar = b.name.toLowerCase();
        const en = (b.name_en ?? '').toLowerCase();
        return ar.includes(q) || en.includes(q);
      })
      .slice(0, 5)
      .map((b) => ({
        type: 'business',
        id: b.id,
        name: i18n.language === 'en' ? b.name_en ?? b.name : b.name,
      }));

    const subMatches: Suggestion[] = subcategories
      .filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((s) => ({
        type: 'subcategory',
        id: s.id,
        name: s.name,
        categoryId: s.categoryId,
      }));

    setSuggestions([...bizMatches, ...subMatches]);
    setIsOpen(true);
  }, [query, businesses, subcategories, loading, error, i18n.language]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: Suggestion) => {
    setQuery('');
    setIsOpen(false);
    if (item.type === 'business') {
      navigate(`/business/${item.id}`);
    } else {
      navigate(`/categories/${item.categoryId}/${item.id}`);
    }
  };

  // Define more granular animation variants for a modern feel
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const searchInputVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        delay: 0.4,
      },
    },
  };

  return (
    <section
      className="
        relative isolate
        overflow-hidden
        bg-gray-950 text-white
        pt-28
        min-h-[calc(100vh-7rem)]
        flex items-center justify-center
      "
    >
      {/* Background - Only Map Now */}
      <motion.div
        className="absolute inset-0 -z-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <picture className="block w-full h-full">
          <source media="(max-width: 767px)" srcSet={MapPortrait} />
          <source media="(min-width: 768px)" srcSet={Map} />
          <motion.img
            src={Map}
            alt="Decorative map background"
            className="block w-full h-full object-cover object-center scale-110 md:scale-105"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 60, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          />
        </picture>
      </motion.div>

      {/* Accent glow for dynamism */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-yellow-500/30 via-yellow-300/10 to-transparent blur-3xl opacity-70 z-0" />

      {/* =================== ENHANCED HERO BOX =================== */}
      <div className="relative container mx-auto px-4 flex flex-col items-center justify-center h-full z-10">
        <motion.div
          className="relative w-full max-w-4xl flex flex-col items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Gradient "Glass" Card Box for main hero content */}
          <motion.div
            className="
              bg-gradient-to-br from-white/85 via-yellow-50/80 to-yellow-100/75
              rounded-3xl md:rounded-[2.5rem]
              shadow-2xl
              border border-white/60
              backdrop-blur-[7px]
              px-6 py-10 md:px-14 md:py-16
              mb-8 md:mb-16
              w-full
              flex flex-col items-center
              transition-all duration-500
            "
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.15 }}
            style={{
              boxShadow: '0 8px 48px 0 rgba(245, 213, 71, 0.13), 0 4px 14px 0 rgba(17, 24, 39, 0.12)'
            }}
          >
            {/* Title & Tagline */}
            <motion.h1
              className="text-[2.4rem] md:text-6xl font-extrabold leading-tight tracking-tight gradient-text bg-clip-text text-transparent drop-shadow-2xl"
              variants={itemVariants}
            >
              {t('hero.brand')}
            </motion.h1>
            <motion.h2
              className="mt-5 text-xl md:text-3xl font-semibold text-gray-900 drop-shadow-lg"
              variants={itemVariants}
            >
              {t('hero.tagline')}
            </motion.h2>
            <motion.p
              className="mt-6 text-base md:text-xl text-gray-700 drop-shadow-md max-w-2xl mx-auto"
              variants={itemVariants}
            >
              {t('hero.description')}
            </motion.p>

            {/* Search */}
            <motion.div
              ref={containerRef}
              className="relative mx-auto mt-10 w-full max-w-xl"
              variants={searchInputVariants}
            >
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query && setIsOpen(true)}
                  aria-autocomplete="list"
                  aria-expanded={isOpen}
                  aria-controls="hero-suggestions"
                  className="peer w-full rounded-full border border-yellow-400/40 bg-white/40 backdrop-blur-lg px-14 py-4 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300
                             focus:border-yellow-400 focus:ring-4 focus:ring-yellow-200/60 shadow-xl placeholder:text-gray-400"
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-500 peer-focus:opacity-60"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(250,204,21,.40) 0%, rgba(250,204,21,0) 70%)',
                  }}
                />
              </div>
              {isOpen && suggestions.length > 0 && (
                <motion.ul
                  id="hero-suggestions"
                  role="listbox"
                  className="absolute top-full z-50 mt-3 max-h-72 w-full overflow-auto rounded-3xl border border-yellow-400/10 bg-white/95 shadow-2xl divide-y divide-yellow-100"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {suggestions.map((item) => (
                    <motion.li
                      key={`${item.type}-${item.id}`}
                      role="option"
                      onClick={() => handleSelect(item)}
                      className="flex cursor-pointer justify-between items-center px-5 py-3.5 text-base transition-colors duration-200 hover:bg-yellow-50/50"
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(254,243,199,0.4)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-sm text-yellow-700 bg-yellow-100 px-2.5 py-1.5 rounded-xl font-medium">
                        {t(
                          item.type === 'business' ? 'hero.type.business' : 'hero.type.subcategory'
                        )}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Local styles for animations */}
      <style>{`
        .gradient-text {
          background-image: linear-gradient(90deg, #fcd34d, #facc15, #fcd34d);
          background-size: 200% 200%;
          animation: gradientShift 8s ease-in-out infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
