import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCategories,
  getSubcategories,
  getBusinesses,
  Subcategory,
  Business,
} from '../lib/airtable';
import { Building2, Anchor, ExternalLink, BookOpen } from 'lucide-react';
import ADC from '../assets/ADC.png';
import ASEZA from '../assets/ASEZA.png';
import Map from '../assets/Map.png';

// --- Search Types & Cache ---
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

const fetchSearchData = async (): Promise<SearchData> => {
  const cats = await getCategories();
  const subArrays = await Promise.all(
    cats.map(cat =>
      getSubcategories(cat.id).then(subs =>
        subs.map(s => ({ ...s, categoryId: cat.id } as SubWithCat))
      )
    )
  );
  const allSubs = subArrays.flat();
  const bizArrays = await Promise.all(
    allSubs.map(subcat => getBusinesses(subcat.categoryId, subcat.id))
  );
  const allBiz = bizArrays.flat();
  return { subcategories: allSubs, businesses: allBiz };
};

const Hero: React.FC = () => {
  const navigate = useNavigate();

  // Search state
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [subcategories, setSubcategories] = useState<SubWithCat[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load & cache search data
  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const now = Date.now();
        let data: SearchData;
        if (searchCache && now - searchCache.timestamp < CACHE_TTL) {
          data = {
            subcategories: searchCache.subcategories,
            businesses: searchCache.businesses,
          };
        } else {
          data = await fetchSearchData();
          searchCache = { ...data, timestamp: now };
        }
        if (!cancelled) {
          setSubcategories(data.subcategories);
          setBusinesses(data.businesses);
        }
      } catch (e) {
        console.error('Search init error', e);
        if (!cancelled) setError('Failed to load search data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Update suggestions
  useEffect(() => {
    if (!query.trim() || loading || error) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const bizMatches: Suggestion[] = businesses
      .filter(b => b.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map(b => ({
        type: 'business' as const,
        id: b.id,
        name: b.name,
      }));
    const subMatches: Suggestion[] = subcategories
      .filter(s => s.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map(s => ({
        type: 'subcategory' as const,
        id: s.id,
        name: s.name,
        categoryId: s.categoryId,
      }));
    setSuggestions([...bizMatches, ...subMatches]);
    setIsOpen(true);
  }, [query, businesses, subcategories, loading, error]);

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

  const handleSelect = (item: Suggestion) => {
    setQuery('');
    setIsOpen(false);
    if (item.type === 'business') {
      navigate(`/business/${item.id}`);
    } else {
      navigate(`/categories/${item.categoryId}/${item.id}`);
    }
  };

  // Sponsors data
  const sponsors = [
    {
      name: 'Aqaba Development Corporation',
      logo: ADC,
      url: 'https://www.adc.jo/',
      description: 'Driving economic growth and development in Aqaba',
    },
    {
      name: 'Aqaba Special Economic Zone Authority',
      logo: ASEZA,
      url: 'https://aseza.jo/Default/En',
      description: "Overseeing Aqaba's special economic zone",
    },
  ];

  return (
    <section className="relative bg-gray-900 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${Map})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Sponsors */}
      <div className="relative bg-gray-900/90 py-8 shadow-xl border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-6">
            <h3 className="text-2xl font-bold text-center text-white">
              Our Valued Supporters
            </h3>
            <p className="text-gray-300 text-center max-w-2xl mt-2">
              These organizations play a vital role in supporting Aqaba's growth and development
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-4xl mx-auto">
            {sponsors.map((sponsor, index) => (
              <a
                key={index}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 hover:scale-[1.02] w-full md:w-1/2 flex flex-col"
              >
                <div className="p-6 flex flex-col md:flex-row items-center flex-grow">
                  <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0 bg-white p-3 rounded-lg shadow-sm border border-gray-200/50">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="h-16 w-auto object-contain max-w-[180px]"
                    />
                  </div>
                  <div className="text-center md:text-left flex-grow">
                    <h4 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                      {sponsor.name}
                    </h4>
                    <p className="text-gray-300 text-sm mt-1">
                      {sponsor.description}
                    </p>
                    <div className="mt-3 inline-flex items-center text-sm text-gray-400 group-hover:text-yellow-300 transition-colors">
                      Visit website
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hero & Search */}
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent animate-gradient">
              AqabaGuide
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-200">
            Discover Aqaba's Business Hub
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Your comprehensive guide to tourist facilities, logistics, industrial sites,
            and commercial establishments in Jordan's gateway to the Red Sea
          </p>

          {/* Search Input */}
          <div ref={containerRef} className="relative w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search businesses or subcategories..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => query && setIsOpen(true)}
              className="w-full px-4 py-2 rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {isOpen && suggestions.length > 0 && (
              <ul className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto z-50">
                {suggestions.map(item => (
                  <li
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                  >
                    <span className="text-white">{item.name}</span>
                    <span className="text-sm text-gray-400">
                      {item.type === 'business' ? 'Business' : 'Subcategory'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/10 hover:border-yellow-400/30 transition-colors">
              <Building2 className="w-7 h-7 mx-auto text-yellow-400" />
              <div className="text-xl font-bold text-white">500+</div>
              <div className="text-gray-300 text-sm">Businesses Listed</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/10 hover:border-yellow-400/30 transition-colors">
              <BookOpen className="w-7 h-7 mx-auto text-yellow-400" />
              <div className="text-xl font-bold text-white">4</div>
              <div className="text-gray-300 text-sm">Guides Published</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/10 hover:border-yellow-400/30 transition-colors">
              <Anchor className="w-7 h-7 mx-auto text-yellow-400" />
              <div className="text-xl font-bold text-white">4</div>
              <div className="text-gray-300 text-sm">Key Sectors</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
