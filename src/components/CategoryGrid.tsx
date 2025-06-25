import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Truck,
  Factory,
  Building2,
  ArrowRight,
} from 'lucide-react';
import {
  getCategories,
  getSubcategoryCounts,
  getBusinessCounts,
  Category,
} from '../lib/airtable';

interface Props {
  onCategorySelect: (categoryId: string) => void;
}

const iconMap = { MapPin, Truck, Factory, Building2 };

const CategoryGrid: React.FC<Props> = ({ onCategorySelect }) => {
  const [cats, setCats] = useState<Category[]>([]);
  const [subCount, setSubCount] = useState<Record<string, number>>({});
  const [bizCount, setBizCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [list, sc, bc] = await Promise.all([
          getCategories(),
          getSubcategoryCounts(),
          getBusinessCounts(),
        ]);
        setCats(list);
        setSubCount(sc);
        setBizCount(bc);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="categories" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Aqaba's Business Landscape
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate our directory by industry sector
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 rounded-2xl h-64"
                />
              ))
            : cats.map((category) => {
                const Icon = iconMap[category.icon as keyof typeof iconMap];
                return (
                  <div
                    key={category.id}
                    onClick={() => onCategorySelect(category.id)}
                    className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 hover:border-orange-200"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-orange-500 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">
                          {bizCount[category.id] ?? 0}
                        </div>
                        <div className="text-sm text-gray-500">
                          Businesses
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                          {subCount[category.id] ?? 0}
                        </div>
                        <div className="text-sm text-gray-500">
                          Sub-categories
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-orange-500 transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
