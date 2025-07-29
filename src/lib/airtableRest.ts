// src/lib/airtableRest.ts

export interface Business {
  id: string
  name: string
  name_en?: string
  description: string
  description_en?: string
  location: string
  phone: string
  email: string
  website?: string
  image?: string
  isPremium: boolean
  rating?: number
  reviews?: number
  category: string
  subcategory: string
}

const API_KEY = typeof window === 'undefined'
  ? process.env.VITE_AIRTABLE_API_KEY
  : import.meta.env.VITE_AIRTABLE_API_KEY

const BASE_ID = typeof window === 'undefined'
  ? process.env.VITE_AIRTABLE_BASE_ID
  : import.meta.env.VITE_AIRTABLE_BASE_ID

const BUS_TABLE = 'Businesses'
const CAT_TABLE = 'Categories'
const SUB_TABLE = 'Subcategories'

async function fetchRecordName(table: string, recordId: string): Promise<string> {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}/${recordId}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } })
  if (!res.ok) throw new Error(`Failed to fetch ${table}/${recordId}`)
  const data = await res.json()
  return data.fields.Name as string
}

export const getBusinessesPaginated = async (
  categoryId: string,
  subcategoryId: string,
  offset?: string
): Promise<{ businesses: Business[]; offset?: string }> => {
  if (!API_KEY || !BASE_ID) {
    throw new Error('Missing Airtable configuration')
  }

  // fetch the human-readable names
  const [categoryName, subcategoryName] = await Promise.all([
    fetchRecordName(CAT_TABLE, categoryId),
    fetchRecordName(SUB_TABLE, subcategoryId),
  ])

  // build the filter on names
  const formula = [
    `FIND("${categoryName}", ARRAYJOIN({Category}))>0`,
    `FIND("${subcategoryName}", ARRAYJOIN({Subcategory}))>0`
  ].join(',')

  const url = new URL(
    `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(BUS_TABLE)}`
  )
  url.searchParams.set('filterByFormula', `AND(${formula})`)
  url.searchParams.set('pageSize', '50')  // increased page size
  if (offset) url.searchParams.set('offset', offset)

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${API_KEY}` }
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Airtable fetch failed: ${data.error?.message || res.status}`)
  }

  const businesses: Business[] = data.records.map((rec: any) => {
    const cat = rec.fields.Category
    const sub = rec.fields.Subcategory
    return {
      id: rec.id,
      name: rec.fields.Name,
      name_en: rec.fields.Name_EN,
      description: rec.fields.Description,
      description_en: rec.fields.Description_EN,
      location: rec.fields.Location,
      phone: rec.fields.Phone,
      email: rec.fields.Email,
      website: rec.fields.Website,
      image: rec.fields.Image,
      isPremium: rec.fields.IsPremium,
      rating: rec.fields.Rating,
      reviews: rec.fields.Reviews,
      category: Array.isArray(cat) ? cat[0] : cat,
      subcategory: Array.isArray(sub) ? sub[0] : sub,
    }
  })

  return { businesses, offset: data.offset }
}


