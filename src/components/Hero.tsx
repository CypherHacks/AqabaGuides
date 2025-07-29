/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getCategories,
  getSubcategories,
  getAllBusinesses,
  Subcategory,
  Business,
} from '../lib/airtable';
import {
  Building2,
  ExternalLink,
  Search as SearchIcon,
  Users,
  Clock,
} from 'lucide-react';
import ADC from '../assets/ADC.png';
import ASEZA from '../assets/ASEZA.png';
import Map from '../assets/Map.png';
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
  const [lastSync, setLastSync] = useState<number | null>(null);

  // Load & cache subcategories & businesses
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
          // use cache timestamp if available, fallback to now
          setLastSync(searchCache?.timestamp ?? now);
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

  // Update suggestions when query changes
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle selection
  const handleSelect = (item: Suggestion) => {
    setQuery('');
    setIsOpen(false);
    if (item.type === 'business') {
      navigate(`/business/${item.id}`);
    } else {
      navigate(`/categories/${item.categoryId}/${item.id}`);
    }
  };

  const sponsors = [
    {
      name: 'Aqaba Development Corporation',
      logo: ADC,
      url: 'https://www.adc.jo/',
      description: t('hero.sponsors.adc'),
    },
    {
      name: 'Aqaba Special Economic Zone Authority',
      logo: ASEZA,
      url: 'https://aseza.jo/Default/En',
      description: t('hero.sponsors.aseza'),
    },
  ];

  // Motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
  };

  const formattedSync = lastSync
    ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(new Date(lastSync))
    : '—';

  return (
    <section className="relative isolate overflow-hidden bg-gray-950 text-white">
      {/* Decorative Background Layers */}
      <div
        className="absolute inset-0 -z-20 opacity-40"
        style={{ backgroundImage: `url(${Map})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 -z-30 bg-gradient-to-b from-gray-900 via-gray-950 to-black" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-yellow-400/30 via-yellow-200/10 to-transparent blur-3xl" />

      {/* Animated grid overlay */}
      <div className="absolute inset-0 -z-10 opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <div
          className="h-full w-full animate-slow-pan bg-[length:200%_200%]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Sponsors */}
      <motion.div
        className="relative py-10 border-b border-white/10 backdrop-blur-sm bg-gray-900/70"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div className="flex flex-col items-center mb-8" variants={fadeUp}>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {t('hero.supportersTitle')}
            </h3>
            <p className="mt-2 max-w-2xl text-center text-gray-300 leading-relaxed">
              {t('hero.supportersDesc')}
            </p>
          </motion.div>

          <div className="relative overflow-hidden">
            <ul className="flex flex-col md:flex-row items-stretch justify-center gap-8 max-w-5xl mx-auto">
              {sponsors.map((s, i) => (
                <motion.li key={s.name} custom={i} variants={fadeUp} className="flex-1">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-yellow-300/40 hover:shadow-[0_0_30px_rgba(250,204,21,.15)] hover:-translate-y-1"
                  >
                    <div className="flex h-full flex-col items-center md:flex-row md:items-start gap-6">
                      <div className="flex-shrink-0 rounded-xl bg-white p-4 shadow-md">
                        <img src={s.logo} alt={s.name} className="h-16 w-auto object-contain max-w-[180px]" />
                      </div>
                      <div className="text-center md:text-left flex-grow">
                        <h4 className="text-lg font-bold text-white transition-colors group-hover:text-yellow-300">
                          {s.name}
                        </h4>
                        <p className="mt-1 text-sm text-gray-300">{s.description}</p>
                        <span className="mt-3 inline-flex items-center text-sm text-gray-400 transition-colors group-hover:text-yellow-200">
                          {t('hero.visitWebsite')} <ExternalLink className="ml-1 h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <motion.div
          className="mx-auto max-w-3xl text-center space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight" variants={fadeUp}>
            <span className="gradient-text bg-clip-text text-transparent">{t('hero.brand')}</span>
          </motion.h1>

          <motion.h2 className="text-2xl md:text-3xl font-semibold text-gray-200" custom={1} variants={fadeUp}>
            {t('hero.tagline')}
          </motion.h2>

          <motion.p className="text-lg md:text-xl leading-relaxed text-gray-300" custom={2} variants={fadeUp}>
            {t('hero.description')}
          </motion.p>

          {/* Search */}
          <motion.div ref={containerRef} className="relative mx-auto mt-10 w-full max-w-md" custom={3} variants={fadeUp}>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('hero.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query && setIsOpen(true)}
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls="hero-suggestions"
              className="peer w-full rounded-full border border-white/10 bg-white/10 px-12 py-3 text-white placeholder-gray-400 backdrop-blur-sm outline-none transition-all focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-300/40"
            />
            {/* Glow effect */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity peer-focus:opacity-40"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(250,204,21,.35) 0%, rgba(250,204,21,0) 70%)',
              }}
            />

            {isOpen && suggestions.length > 0 && (
              <ul
                id="hero-suggestions"
                role="listbox"
                className="absolute top-full z-50 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl divide-y divide-white/5 animate-fade-in"
              >
                {suggestions.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    role="option"
                    onClick={() => handleSelect(item)}
                    className="flex cursor-pointer justify-between px-4 py-3 text-sm text-white transition-colors hover:bg-white/10"
                  >
                    <span>{item.name}</span>
                    <span className="text-gray-400">
                      {t(item.type === 'business' ? 'hero.type.business' : 'hero.type.subcategory')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-5 md:grid-cols-3" custom={4} variants={fadeUp}>
            <StatCard
              icon={<Building2 className="mx-auto h-7 w-7" />}
              value="1000+"
              title={t('hero.stats.businesses')}
            />
            <StatCard
              icon={<Users className="mx-auto h-7 w-7" />}
              value={t('hero.stats.communityTitle', 'Community Driven')}
              title={t('hero.stats.communityDesc', 'Built for locals & visitors')}
            />
            <StatCard
              icon={<Clock className="mx-auto h-7 w-7" />}
              value={`Last Sync: ${formattedSync}`}
              title={t('hero.stats.upToDate', 'Always up‑to‑date')}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Local styles for animations */}
      <style>{`
        .gradient-text {
          background-image: linear-gradient(90deg, #fde047, #facc15, #fde047);
          background-size: 200% 200%;
          animation: gradientShift 6s linear infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-slow-pan {
          animation: slowPan 30s linear infinite;
        }
        @keyframes slowPan {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

// -------------------- Sub Components --------------------
interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  title: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, title }) => (
  <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-center shadow-xl backdrop-blur-md transition-colors hover:border-yellow-300/40">
    <div className="text-yellow-300 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <div className="mt-2 text-xl font-bold text-white">{value}</div>
    <div className="mt-1 text-sm text-gray-300">{title}</div>
  </div>
);

export default Hero;
