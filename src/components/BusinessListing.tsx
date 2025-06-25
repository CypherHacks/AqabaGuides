import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Crown,
  Star,
  Users,
  Building2,
} from 'lucide-react';
import { getBusinesses, Business } from '../lib/airtable';

interface Props {
  categoryId: string;
  subcategoryId: string;
  onBack: () => void;
  onBusinessSelect: (id: string) => void;
}

const BusinessListing: React.FC<Props> = ({
  categoryId,
  subcategoryId,
  onBack,
  onBusinessSelect,
}) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log(
      `▶️ [BusinessListing] fetching cat=${categoryId}, sub=${subcategoryId}`
    );
    getBusinesses(categoryId, subcategoryId)
      .then(bs => {
        console.log('▶️ [BusinessListing] got', bs.length, 'records');
        setBusinesses(bs);
      })
      .catch(e => {
        console.error('❌ [BusinessListing]', e);
        setError('Failed to load businesses.');
      })
      .finally(() => setLoading(false));
  }, [categoryId, subcategoryId]);

  const filtered = businesses.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPremium = !premiumOnly || b.isPremium;
    return matchSearch && matchPremium;
  });

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search businesses…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={premiumOnly}
              onChange={e => setPremiumOnly(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="flex items-center">
              <Crown className="w-5 h-5 text-yellow-500 mr-1" />
              Premium Only
            </span>
          </label>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white h-56 rounded-xl shadow" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-20">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-gray-500 text-center py-20">
            <Building2 className="w-16 h-16 mx-auto mb-4" />
            No businesses found.
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(b => (
              <div
                key={b.id}
                onClick={() => onBusinessSelect(b.id)}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer"
              >
                {b.image && (
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{b.name}</h3>
                  {b.rating !== undefined && (
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="ml-1">{b.rating}</span>
                      {b.reviews !== undefined && (
                        <span className="ml-3 text-gray-600 text-sm flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {b.reviews}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-gray-600 mb-4 truncate">{b.description}</p>
                  <span className="text-blue-600 font-semibold">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessListing;
