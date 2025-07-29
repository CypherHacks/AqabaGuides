// src/components/CategoryGrid.tsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import categoriesData from '../data/categories.json';
import { ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  subCount: number;
  bizCount: number;
}

interface CategoryGridProps {
  onCategorySelect: (id: string) => void;
}

// map Airtable record IDs → translation keys
const idToKey: Record<string, string> = {
  recw2M2JCwbRwpZID: 'governmental',
  rec3Aq9D2vhwm3mTB: 'logistics',
  recB5om03TPw0P558: 'industrial',
  recBhaJWUpjkzdeMl: 'tourism',
  recmjEiR7EMb8CbVH: 'healthcare',
  recvhKHj12kVGSaBP: 'commercial',
};

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const { t } = useTranslation();

  // Sort categories with "gov" first
  const orderedCategories = useMemo(() => {
    return [...(categoriesData as Category[])].sort((a, b) =>
      a.name.toLowerCase().includes('gov') ? -1 : 1
    );
  }, []);

  return (
    <section className="py-20 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('categories.exploreTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('categories.exploreDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {orderedCategories.map(category => {
            const key = idToKey[category.id] || category.id;
            const name = t(`categories.${key}`, {
              defaultValue: category.name,
            });
            const description = t(`categories.${key}.description`, {
              defaultValue: category.description,
            });

            return (
              <div
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden relative"
              >
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
                
                {/* Icon Section */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl flex items-center justify-center p-2 shadow-inner">
                    {category.icon && (
                      <img
                        src={category.icon}
                        alt={name}
                        className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className =
                            'w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full';
                          e.currentTarget.parentNode?.appendChild(fallback);
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition-colors">
                  {name}
                </h3>
                <p className="text-gray-600 mb-6 text-center min-h-[3rem]">
                  {description}
                </p>

                {/* Stats Row */}
                <div className="flex justify-between bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <span className="block text-xl font-bold text-blue-600">
                      {category.bizCount}
                    </span>
                    <span className="text-xs text-gray-500">
                      {t('categories.businesses')}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xl font-bold text-orange-500">
                      {category.subCount}
                    </span>
                    <span className="text-xs text-gray-500">
                      {t('categories.subcategories')}
                    </span>
                  </div>
                </div>

                {/* Explore Button */}
                <div className="flex items-center justify-center text-blue-500 group-hover:text-blue-700 transition-colors font-medium">
                  <span className="mr-2">
                    {t('categories.exploreLabel')}
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-40 -right-24 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
    </section>
  );
};

export default CategoryGrid;