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

 // Enhanced motion variants
 const containerVariants = {
   hidden: { opacity: 0 },
   visible: {
     opacity: 1,
     transition: {
       duration: 0.3,
       staggerChildren: 0.15,
     }
   }
 };

 const itemVariants: Variants = {
   hidden: { opacity: 0, y: 30 },
   visible: {
     opacity: 1,
     y: 0,
     transition: {
       duration: 0.6,
       ease: [0.25, 0.46, 0.45, 0.94]
     }
   }
 };

 const formattedSync = lastSync
   ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(new Date(lastSync))
   : '—';

 return (
   <section className="relative min-h-screen flex flex-col overflow-hidden">
     {/* Enhanced Map Background with Mobile Optimization */}
     <div className="absolute inset-0 z-0">
       {/* Primary map layer with mobile-optimized positioning */}
       <div 
         className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
         style={{ 
           backgroundImage: `url(${Map})`,
           backgroundPosition: 'center 30%', // Better mobile positioning
           filter: 'brightness(0.4) contrast(1.1) saturate(1.2)'
         }}
       />
       
       {/* Mobile-specific map overlay for better readability */}
       <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80 md:from-slate-900/40 md:via-slate-900/20 md:to-slate-900/60" />
       
       {/* Animated gradient overlay */}
       <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-emerald-900/20 animate-pulse-slow" />
       
       {/* Dynamic light effect */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl">
         <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-radial from-yellow-400/15 via-yellow-300/5 to-transparent rounded-full blur-3xl animate-float" />
       </div>
       
       {/* Subtle grid pattern for depth */}
       <div className="absolute inset-0 opacity-10">
         <div 
           className="w-full h-full animate-grid-flow"
           style={{
             backgroundImage: `
               linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
             `,
             backgroundSize: '60px 60px'
           }}
         />
       </div>
     </div>

     {/* Sponsors Section - Enhanced Mobile Design */}
     <motion.div
       className="relative z-20 backdrop-blur-md bg-slate-900/30 border-b border-white/10"
       initial="hidden"
       whileInView="visible"
       viewport={{ once: true, amount: 0.2 }}
       variants={containerVariants}
     >
       <div className="container mx-auto px-4 py-8 md:py-12">
         <motion.div className="text-center mb-8 md:mb-12" variants={itemVariants}>
           <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-3 tracking-tight">
             {t('hero.supportersTitle')}
           </h3>
           <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
             {t('hero.supportersDesc')}
           </p>
         </motion.div>

         <motion.div variants={itemVariants}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
             {sponsors.map((sponsor, index) => (
               <motion.div
                 key={sponsor.name}
                 variants={itemVariants}
                 whileHover={{ y: -4, scale: 1.02 }}
                 transition={{ duration: 0.3 }}
               >
                 <a
                   href={sponsor.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="group block h-full rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:border-yellow-400/30 hover:shadow-2xl hover:shadow-yellow-400/10 p-4 md:p-6"
                 >
                   <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 h-full">
                     <div className="flex-shrink-0 rounded-xl md:rounded-2xl bg-white/95 p-3 md:p-4 shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                       <img 
                         src={sponsor.logo} 
                         alt={sponsor.name} 
                         className="h-12 md:h-16 w-auto object-contain max-w-[140px] md:max-w-[180px]" 
                       />
                     </div>
                     <div className="text-center sm:text-left flex-1 min-w-0">
                       <h4 className="text-base md:text-lg font-bold text-white group-hover:text-yellow-300 transition-colors duration-300 mb-1 md:mb-2">
                         {sponsor.name}
                       </h4>
                       <p className="text-xs md:text-sm text-slate-300 mb-2 md:mb-3 line-clamp-2">
                         {sponsor.description}
                       </p>
                       <span className="inline-flex items-center text-xs md:text-sm text-slate-400 group-hover:text-yellow-200 transition-colors duration-300">
                         {t('hero.visitWebsite')} 
                         <ExternalLink className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                       </span>
                     </div>
                   </div>
                 </a>
               </motion.div>
             ))}
           </div>
         </motion.div>
       </div>
     </motion.div>

     {/* Main Hero Content - Enhanced Mobile-First Design */}
     <div className="relative z-10 flex-1 flex items-center">
       <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
         <motion.div
           className="max-w-4xl mx-auto text-center"
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, amount: 0.3 }}
           variants={containerVariants}
         >
           {/* Main Title */}
           <motion.h1 
             className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-4 md:mb-6"
             variants={itemVariants}
           >
             <span className="gradient-text bg-clip-text text-transparent inline-block">
               {t('hero.brand')}
             </span>
           </motion.h1>

           {/* Subtitle */}
           <motion.h2 
             className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-slate-200 mb-4 md:mb-6"
             variants={itemVariants}
           >
             {t('hero.tagline')}
           </motion.h2>

           {/* Description */}
           <motion.p 
             className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-slate-300 max-w-3xl mx-auto mb-8 md:mb-12"
             variants={itemVariants}
           >
             {t('hero.description')}
           </motion.p>

           {/* Enhanced Search Bar */}
           <motion.div 
             ref={containerRef} 
             className="relative mx-auto max-w-md md:max-w-lg mb-12 md:mb-16"
             variants={itemVariants}
           >
             <div className="relative group">
               <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-yellow-400 transition-colors duration-300 z-10" />
               <input
                 type="text"
                 placeholder={t('hero.searchPlaceholder')}
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 onFocus={() => query && setIsOpen(true)}
                 aria-autocomplete="list"
                 aria-expanded={isOpen}
                 aria-controls="hero-suggestions"
                 className="w-full h-14 md:h-16 rounded-2xl md:rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl px-12 md:px-14 text-white placeholder-slate-400 outline-none transition-all duration-300 focus:border-yellow-400/60 focus:bg-white/15 focus:shadow-2xl focus:shadow-yellow-400/20 text-sm md:text-base"
               />
               
               {/* Enhanced glow effect */}
               <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none">
                 <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-r from-yellow-400/20 via-yellow-300/30 to-yellow-400/20 blur-xl" />
               </div>
             </div>

             {/* Enhanced Suggestions Dropdown */}
             {isOpen && suggestions.length > 0 && (
               <motion.ul
                 id="hero-suggestions"
                 role="listbox"
                 className="absolute top-full mt-3 w-full max-h-64 overflow-auto rounded-2xl md:rounded-3xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-black/50 divide-y divide-white/5 z-50"
                 initial={{ opacity: 0, y: 8, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 transition={{ duration: 0.2 }}
               >
                 {suggestions.map((item) => (
                   <li
                     key={`${item.type}-${item.id}`}
                     role="option"
                     onClick={() => handleSelect(item)}
                     className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:backdrop-blur-xl group"
                   >
                     <span className="text-white text-sm md:text-base font-medium group-hover:text-yellow-300 transition-colors duration-200 truncate">
                       {item.name}
                     </span>
                     <span className="text-slate-400 text-xs md:text-sm font-medium ml-2 flex-shrink-0">
                       {t(item.type === 'business' ? 'hero.type.business' : 'hero.type.subcategory')}
                     </span>
                   </li>
                 ))}
               </motion.ul>
             )}
           </motion.div>

           {/* Enhanced Stats Grid */}
           <motion.div 
             className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
             variants={itemVariants}
           >
             <StatCard
               icon={<Building2 className="h-6 w-6 md:h-8 md:w-8" />}
               value="1000+"
               title={t('hero.stats.businesses')}
             />
             <StatCard
               icon={<Users className="h-6 w-6 md:h-8 md:w-8" />}
               value={t('hero.stats.communityTitle', 'Community Driven')}
               title={t('hero.stats.communityDesc', 'Built for locals & visitors')}
             />
             <StatCard
               icon={<Clock className="h-6 w-6 md:h-8 md:w-8" />}
               value={`Last Sync: ${formattedSync}`}
               title={t('hero.stats.upToDate', 'Always up‑to‑date')}
             />
           </motion.div>
         </motion.div>
       </div>
     </div>

     {/* Enhanced CSS Animations */}
     <style>{`
       .gradient-text {
         background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #f59e0b 75%, #fbbf24 100%);
         background-size: 300% 300%;
         animation: gradientShift 8s ease-in-out infinite;
       }
       
       @keyframes gradientShift {
         0%, 100% { background-position: 0% 50%; }
         50% { background-position: 100% 50%; }
       }
       
       .animate-pulse-slow {
         animation: pulseGlow 4s ease-in-out infinite;
       }
       
       @keyframes pulseGlow {
         0%, 100% { opacity: 0.3; }
         50% { opacity: 0.6; }
       }
       
       .animate-float {
         animation: floatMove 6s ease-in-out infinite;
       }
       
       @keyframes floatMove {
         0%, 100% { transform: translateY(0px) translateX(-50%); }
         50% { transform: translateY(-20px) translateX(-50%); }
       }
       
       .animate-grid-flow {
         animation: gridFlow 20s linear infinite;
       }
       
       @keyframes gridFlow {
         0% { transform: translate(0, 0); }
         100% { transform: translate(60px, 60px); }
       }
       
       .bg-gradient-radial {
         background: radial-gradient(circle, var(--tw-gradient-stops));
       }
       
       .line-clamp-2 {
         display: -webkit-box;
         -webkit-line-clamp: 2;
         -webkit-box-orient: vertical;
         overflow: hidden;
       }
       
       /* Mobile-specific improvements */
       @media (max-width: 640px) {
         .gradient-text {
           background-size: 200% 200%;
           animation-duration: 6s;
         }
       }
     `}</style>
   </section>
 );
};

// -------------------- Enhanced Sub Components --------------------
interface StatCardProps {
 icon: React.ReactNode;
 value: string;
 title: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, title }) => (
 <motion.div 
   className="group rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 text-center transition-all duration-500 hover:border-yellow-400/30 hover:bg-white/10 hover:shadow-2xl hover:shadow-yellow-400/10"
   whileHover={{ y: -2, scale: 1.02 }}
   transition={{ duration: 0.3 }}
 >
   <div className="text-yellow-400 mb-2 md:mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
     {icon}
   </div>
   <div className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 leading-tight">
     {value}
   </div>
   <div className="text-xs md:text-sm text-slate-300 leading-tight">
     {title}
   </div>
 </motion.div>
);

export default Hero;