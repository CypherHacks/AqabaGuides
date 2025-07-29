// src/components/BusinessListing.tsx
import React, { useState, useEffect, useCallback, useDeferredValue } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Search } from 'lucide-react'
import { getBusinessesPaginated, Business } from '../lib/airtableRest'

// Enhanced skeleton with modern loading animation
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
      </div>
    </div>
  </div>
)

interface Props {
  categoryId: string
  subcategoryId: string
  onBack: () => void
  onBusinessSelect: (id: string) => void
}

const BusinessListing: React.FC<Props> = ({ categoryId, subcategoryId, onBack, onBusinessSelect }) => {
  const { t, i18n } = useTranslation()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [offset, setOffset] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const deferredSearchTerm = useDeferredValue(searchTerm)

  // Initial fetch (unchanged)
  useEffect(() => {
    let isMounted = true
    const fetchInitial = async () => {
      setLoading(true)
      try {
        const { businesses: initialData, offset: next } = await getBusinessesPaginated(categoryId, subcategoryId)
        if (isMounted) {
          setBusinesses(initialData)
          setOffset(next)
        }
      } catch (e: any) {
        if (isMounted) setError(`${t('business.errorLoad')}: ${e.message}`)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchInitial()
    return () => { isMounted = false }
  }, [categoryId, subcategoryId, t])

  // Load more (unchanged)
  const loadMore = useCallback(async () => {
    if (!offset) return
    const scrollPos = window.scrollY
    setLoading(true)
    try {
      const { businesses: more, offset: next } = await getBusinessesPaginated(categoryId, subcategoryId, offset)
      setBusinesses(prev => [...prev, ...more])
      setOffset(next)
      // restore scroll
      setTimeout(() => window.scrollTo(0, scrollPos), 0)
    } catch (e: any) {
      setError(`${t('business.errorLoad')}: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }, [categoryId, subcategoryId, offset, t])

  // Filtered list (unchanged)
  const filtered = React.useMemo(() => {
    const term = deferredSearchTerm.toLowerCase()
    return businesses.filter(b => {
      const name = i18n.language === 'en' ? (b.name_en ?? b.name) : b.name
      return !term || name.toLowerCase().includes(term)
    })
  }, [businesses, deferredSearchTerm, i18n.language])

  // Handlers (unchanged)
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="sticky top-4 z-10 bg-gray-50 py-2">
          <button 
            onClick={onBack} 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4 px-3 py-2 rounded-lg hover:bg-blue-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">{t('business.back')}</span>
          </button>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Enhanced Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('business.searchPlaceholder') || 'Search…'}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-5 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow-sm transition-all"
              />
            </div>
          </div>
        </div>

        {loading && businesses.length === 0 && (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">{t('business.none')}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 pb-8">
          {filtered.map(b => {
            const displayName = i18n.language === 'en' ? (b.name_en ?? b.name) : b.name
            return (
              <div
                key={b.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex justify-between items-center border border-gray-100"
              >
                <span className="font-medium text-gray-800 text-lg truncate pr-4">{displayName}</span>
                <button
                  onClick={() => onBusinessSelect(b.id)}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center transition-colors whitespace-nowrap"
                >
                  {t('business.viewDetails')}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>

        {offset && (
          <div className="text-center py-6">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('business.loading')}
                </span>
              ) : (
                t('business.loadMore')
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default React.memo(BusinessListing)