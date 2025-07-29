import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowUpRight, Building2, Users } from 'lucide-react';
import { getSubcategories, Subcategory } from '../lib/airtable';
import aqabaLogo from '../assets/aqaba-water-logo.png';
import aqabaBrochure from '../Comp/مياه العقبة.pdf';

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
  const { t } = useTranslation();
  const [subs, setSubs] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSubcategories(categoryId)
      .then(list => setSubs(list))
      .catch(() => setError(t('sub.errorLoad')))
      .finally(() => setLoading(false));
  }, [categoryId, t]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Building2 className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-500" />
        <p className="text-lg text-gray-600">{t('sub.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 text-lg font-medium">{error}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition"
        >
          {t('sub.back')}
        </button>
      </div>
    );
  }

  if (subs.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 text-lg mb-4">{t('sub.none')}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
        >
          {t('sub.back')}
        </button>
      </div>
    );
  }

  const totalBusinesses = subs.reduce((sum, s) => sum + (s.businessCount || 0), 0);

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">{t('sub.back')}</span>
        </button>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t('sub.title')}
          </h1>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-blue-500" />
              {subs.length} {t('sub.count')}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              {totalBusinesses} {t('sub.total')}
            </div>
          </div>
        </div>

        {categoryId === 'rec3Aq9D2vhwm3mTB' && (
          <div className="mb-16">
            {/* Premium Supporter Card */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-blue-100/50 transition-all hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-white opacity-80"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-200/10 rounded-full filter blur-3xl"></div>

              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center">
                {/* Logo Container */}
                <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-12 w-full md:w-auto flex justify-center">
                  <a
                    href="https://aw.jo/web/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('sub.supporter.aria')}
                    className="block transition-all hover:scale-[1.02] transform-gpu"
                  >
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-100/50">
                      <img
                        src={aqabaLogo}
                        alt={t('sub.supporter.alt')}
                        className="w-64 h-auto object-contain mx-auto filter drop-shadow-lg"
                        style={{ minWidth: '256px' }}
                      />
                    </div>
                  </a>
                </div>

                {/* Text Content */}
                <div className="text-center md:text-left flex-1">
                  <span className="inline-block uppercase text-xs tracking-widest text-blue-700 font-semibold px-4 py-1.5 bg-blue-50 rounded-full mb-5 border border-blue-200/50">
                    {t('sub.supporterLabel')}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-5 leading-tight">
                    {t('sub.supporter.name')}
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                    {t('sub.supporter.desc')}
                  </p>

                  {/* PDF Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <a
                      href={aqabaBrochure}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-6 py-3 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {t('sub.viewPDF')}
                    </a>
                    <a
                      href={aqabaBrochure}
                      download="Aqaba-Water-Brochure.pdf"
                      className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      {t('sub.downloadPDF')}
                    </a>
                  </div>

                  <div className="flex justify-center md:justify-start">
                    <a
                      href="https://aw.jo/web/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
                    >
                      <span className="font-semibold text-lg">
                        {t('sub.supporter.visit')}
                      </span>
                      <ArrowUpRight className="w-5 h-5 ml-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subcategory List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subs.map(sub => (
            <div
              key={sub.id}
              onClick={() => onSubcategorySelect(categoryId, sub.id)}
              className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-blue-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                    {t(`subcategories.${sub.id}.name`, { defaultValue: sub.name })}
                  </h3>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                    {sub.businessCount} {t('sub.businesses')}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {t(`subcategories.${sub.id}.description`, {
                    defaultValue: sub.description,
                  })}
                </p>
                <div className="flex items-center justify-end">
                  <span className="text-blue-600 font-medium group-hover:text-blue-800 transition flex items-center">
                    {t('sub.viewAll')}
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubcategoryView;
