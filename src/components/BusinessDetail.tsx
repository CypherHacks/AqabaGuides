// src/components/BusinessDetail.tsx
import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Users,
  Crown,
  CheckCircle,
} from 'lucide-react';
import { getBusinessById, Business } from '../lib/airtable';

interface Props {
  businessId: string;
  onBack: () => void;
}

const BusinessDetail: React.FC<Props> = ({ businessId, onBack }) => {
  const [biz, setBiz] = useState<Business | null>(null);

  useEffect(() => {
    getBusinessById(businessId).then(setBiz);
  }, [businessId]);

  if (!biz) return null;

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Listings
        </button>

        {biz.isPremium && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-t-2xl mb-4">
            <div className="flex items-center justify-center text-white font-semibold">
              <Crown className="w-5 h-5 mr-2" />
              Premium Business Profile
            </div>
          </div>
        )}

        <div
          className={`bg-white shadow-2xl ${
            biz.isPremium ? 'rounded-b-2xl' : 'rounded-2xl'
          } overflow-hidden`}
        >
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {biz.name}
                </h1>

                {biz.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold text-gray-700">
                        {biz.rating}
                      </span>
                    </div>
                    {biz.reviews && (
                      <div className="flex items-center ml-4 text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{biz.reviews} reviews</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xl text-gray-600 leading-relaxed">
                  {biz.description}
                </p>
              </div>

              {biz.image && (
                <div className="w-full md:w-80 h-64 rounded-xl overflow-hidden mt-6 md:mt-0 md:ml-8">
                  <img
                    src={biz.image}
                    alt={biz.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 mb-3">Contact &amp; Location</h3>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span>{biz.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-green-500" />
                <span>{biz.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-red-500" />
                <span>{biz.email}</span>
              </div>
              {biz.website && (
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="w-4 h-4 mr-2 text-purple-500" />
                  <a
                    href={biz.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {biz.website}
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 mb-3">Special Services</h3>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>On-site Consultation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessDetail;
