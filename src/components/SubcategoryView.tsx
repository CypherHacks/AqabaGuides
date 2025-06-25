import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Building2, Users, Download } from 'lucide-react';
import { getSubcategories, Subcategory } from '../lib/airtable';
//import logisticsPdf from '../assets/logistics.pdf';
import logisticsImage from '../assets/logistics-thumbnail.png';
import aqabaLogo from '../assets/aqaba-water-logo.png';

interface Props {
  categoryId: string;
  onBack: () => void;
  onSubcategorySelect: (cat: string, sub: string) => void;
}

const SubcategoryView: React.FC<Props> = ({
  categoryId,
  onBack,
  onSubcategorySelect,
}) => {
  const [subs, setSubs] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSubcategories(categoryId)
      .then(list => setSubs(list))
      .catch(() => setError('Failed to load sub-categories.'))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading)
    return (
      <div className="p-8 text-center">
        <Building2 className="animate-spin w-8 h-8 mx-auto mb-4" />
        Loading sub-categories…
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (subs.length === 0)
    return <div className="p-8 text-center text-gray-500">No sub-categories available.</div>;

  const totalBusinesses = subs.reduce((sum, s) => sum + s.businessCount, 0);

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Categories
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Subcategories</h1>
          <div className="flex items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              <span>{subs.length} Subcategories</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>{totalBusinesses} Total Businesses</span>
            </div>
          </div>
        </div>

        {/* LOGISTICS GUIDE & SUPPORTER LOGO ONLY FOR LOGISTICS CATEGORY */}
        {categoryId === 'rec3Aq9D2vhwm3mTB' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Enhanced Logistics Guide Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Logistics Guide</h2>
                <p className="text-gray-600 mb-4">
                  Comprehensive guide to logistics services in the region with helpful resources.
                </p>
                <div className="relative group">
                  <a
                    //href={logisticsPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={logisticsImage}
                      alt="Logistics Guide"
                      className="w-full h-auto rounded-lg border border-gray-200 transition-transform group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                      <div className="bg-white/90 px-4 py-2 rounded-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-blue-600 font-medium">Download Guide</span>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="mt-4 flex justify-center">
                  <a
                    //href={logisticsPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>

            {/* Enhanced Supporter Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden shadow-lg border border-blue-200 transition-all hover:shadow-xl">
              <div className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <span className="inline-block uppercase text-xs tracking-wider text-blue-700 font-semibold px-3 py-1 bg-white/70 rounded-full border border-blue-200">
                    Proudly Supported by
                  </span>
                </div>
                
                <div className="flex-grow flex flex-col justify-center items-center">
                  <div className="bg-white p-6 rounded-lg shadow-inner border border-blue-100 mb-4 w-full max-w-xs">
                    <a
                      href="https://aw.jo/web/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-all hover:scale-[1.02] active:scale-95"
                      aria-label="Visit Aqaba Water Company website"
                    >
                      <img
                        src={aqabaLogo}
                        alt="Aqaba Water Company Logo"
                        className="w-full h-auto object-contain mx-auto"
                        style={{
                          maxHeight: '80px',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }}
                      />
                    </a>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Aqaba Water Company</h3>
                  <p className="text-gray-600 text-sm text-center mb-4 max-w-md">
                    Providing sustainable water solutions for the region since 2004.
                  </p>
                  
                  <a
                    href="https://aw.jo/web/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    Visit Website
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subs.map(sub => (
            <div
              key={sub.id}
              onClick={() => onSubcategorySelect(categoryId, sub.id)}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 hover:border-orange-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                  {sub.name}
                </h3>
                <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {sub.businessCount}
                </div>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">{sub.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {sub.businessCount} businesses
                </span>
                <span className="text-blue-600 font-semibold group-hover:text-orange-500 transition">
                  View All →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubcategoryView;