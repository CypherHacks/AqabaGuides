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

 // Animation variants
 const fadeInUp: Variants = {
   hidden: { opacity: 0, y: 20 },
   visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
 };

 const stagger = {
   visible: { transition: { staggerChildren: 0.1 } }
 };

 const formattedSync = lastSync
   ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(new Date(lastSync))
   : '—';

 return (
   <section className="relative min-h-screen bg-gray-900 overflow-hidden">
     {/* Fixed Map Background - Properly Displayed */}
     <div className="absolute inset-0 z-0">
       {/* Map Layer - Fixed to show full map */}
       <div 
         className="absolute inset-0 w-full h-full"
         style={{ 
           backgroundImage: `url(${Map})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center',
           backgroundRepeat: 'no-repeat',
           backgroundAttachment: 'fixed'
         }}
       />
       
       {/* Overlay for readability - lighter for better map visibility */}
       <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/80" />
       
       {/* Subtle pattern overlay */}
       <div className="absolute inset-0 opacity-5">
         <div 
           className="w-full h-full"
           style={{
             backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
             backgroundSize: '50px 50px'
           }}
         />
       </div>
     </div>

     {/* Sponsors Section - Clean & Professional */}
     <motion.div
       className="relative z-10 bg-white/5 backdrop-blur-sm border-b border-white/10"
       initial="hidden"
       animate="visible"
       variants={stagger}
     >
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <motion.div className="text-center mb-8" variants={fadeInUp}>
           <h3 className="text-2xl font-bold text-white mb-2">
             {t('hero.supportersTitle')}
           </h3>
           <p className="text-gray-300 max-w-2xl mx-auto">
             {t('hero.supportersDesc')}
           </p>
         </motion.div>

         <motion.div 
           className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
           variants={stagger}
         >
           {sponsors.map((sponsor, _index) => (
             <motion.div key={sponsor.name} variants={fadeInUp}>
               <a
                 href={sponsor.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="group flex items-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-300"
               >
                 <div className="flex-shrink-0 bg-white rounded-lg p-3 mr-4">
                   <img 
                     src={sponsor.logo} 
                     alt={sponsor.name} 
                     className="h-12 w-auto object-contain" 
                   />
                 </div>
                 <div className="flex-1 min-w-0">
                   <h4 className="text-lg font-semibold text-white group-hover:text-yellow-300 transition-colors">
                     {sponsor.name}
                   </h4>
                   <p className="text-sm text-gray-300 mt-1">
                     {sponsor.description}
                   </p>
                   <span className="inline-flex items-center text-sm text-gray-400 mt-2 group-hover:text-yellow-200 transition-colors">
                     {t('hero.visitWebsite')} 
                     <ExternalLink className="ml-1 h-4 w-4" />
                   </span>
                 </div>
               </a>
             </motion.div>
           ))}
         </motion.div>
       </div>
     </motion.div>

     {/* Main Hero Content - Centered & Clean */}
     <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)]">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
         <motion.div
           className="text-center max-w-4xl mx-auto"
           initial="hidden"
           animate="visible"
           variants={stagger}
         >
           {/* Brand Title */}
           <motion.h1 
             className="text-5xl md:text-7xl font-bold text-white mb-6"
             variants={fadeInUp}
           >
             <span className="gradient-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
               {t('hero.brand')}
             </span>
           </motion.h1>

           {/* Tagline */}
           <motion.h2 
             className="text-2xl md:text-3xl font-medium text-gray-200 mb-4"
             variants={fadeInUp}
           >
             {t('hero.tagline')}
           </motion.h2>

           {/* Description */}
           <motion.p 
             className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
             variants={fadeInUp}
           >
             {t('hero.description')}
           </motion.p>

           {/* Search Bar - Clean & Modern */}
           <motion.div 
             ref={containerRef} 
             className="relative max-w-2xl mx-auto mb-16"
             variants={fadeInUp}
           >
             <div className="relative">
               <SearchIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
               <input
                 type="text"
                 placeholder={t('hero.searchPlaceholder')}
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 onFocus={() => query && setIsOpen(true)}
                 className="w-full h-16 pl-16 pr-6 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
               />
             </div>

             {/* Search Suggestions */}
             {isOpen && suggestions.length > 0 && (
               <div className="absolute top-full mt-2 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl z-50">
                 {suggestions.map((item) => (
                   <div
                     key={`${item.type}-${item.id}`}
                     onClick={() => handleSelect(item)}
                     className="flex justify-between items-center px-6 py-4 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
                   >
                     <span className="text-white font-medium">{item.name}</span>
                     <span className="text-gray-400 text-sm">
                       {t(item.type === 'business' ? 'hero.type.business' : 'hero.type.subcategory')}
                     </span>
                   </div>
                 ))}
               </div>
             )}
           </motion.div>

           {/* Stats - Clean Grid */}
           <motion.div 
             className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
             variants={stagger}
           >
             <motion.div variants={fadeInUp}>
               <StatCard
                 icon={<Building2 className="h-8 w-8 text-yellow-400 mx-auto mb-4" />}
                 value="1000+"
                 title={t('hero.stats.businesses')}
               />
             </motion.div>
             <motion.div variants={fadeInUp}>
               <StatCard
                 icon={<Users className="h-8 w-8 text-yellow-400 mx-auto mb-4" />}
                 value={t('hero.stats.communityTitle', 'Community Driven')}
                 title={t('hero.stats.communityDesc', 'Built for locals & visitors')}
               />
             </motion.div>
             <motion.div variants={fadeInUp}>
               <StatCard
                 icon={<Clock className="h-8 w-8 text-yellow-400 mx-auto mb-4" />}
                 value={formattedSync}
                 title={t('hero.stats.upToDate', 'Always up‑to‑date')}
               />
             </motion.div>
           </motion.div>
         </motion.div>
       </div>
     </div>

     {/* Custom Styles */}
     <style>{`
       .gradient-text {
         background-size: 200% 200%;
         animation: gradientShift 3s ease-in-out infinite;
       }
       
       @keyframes gradientShift {
         0%, 100% { background-position: 0% 50%; }
         50% { background-position: 100% 50%; }
       }

       /* Mobile optimizations */
       @media (max-width: 768px) {
         .bg-fixed {
           background-attachment: scroll;
         }
       }
     `}</style>
   </section>
 );
};

// -------------------- Stat Card Component --------------------
interface StatCardProps {
 icon: React.ReactNode;
 value: string;
 title: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, title }) => (
 <div className="text-center p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
   {icon}
   <div className="text-2xl font-bold text-white mb-2">{value}</div>
   <div className="text-gray-300">{title}</div>
 </div>
);

export default Hero;