// src/lib/airtable.ts
import Airtable from 'airtable';

const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY as string,
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID as string);

// 1) Category model & fetcher
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}
export const getCategories = async (): Promise<Category[]> => {
  const records = await base<{ Name: string; Description: string; Icon: string }>('Categories')
    .select({ fields: ['Name', 'Description', 'Icon'] })
    .all();
  return records.map(r => ({
    id: r.id,
    name: r.fields.Name,
    description: r.fields.Description,
    icon: r.fields.Icon,
  }));
};

// 2) Count aggregators
export const getSubcategoryCounts = async (): Promise<Record<string, number>> => {
  const records = await base<{ Category: string[] }>('Subcategories')
    .select({ fields: ['Category'] })
    .all();
  return records.reduce((acc, rec) => {
    rec.fields.Category?.forEach(catId => { acc[catId] = (acc[catId]||0) + 1 });
    return acc;
  }, {} as Record<string, number>);
};

export const getBusinessCounts = async (): Promise<Record<string, number>> => {
  const records = await base<{ Category: string[] }>('Businesses')
    .select({ fields: ['Category'] })
    .all();
  return records.reduce((acc, rec) => {
    rec.fields.Category?.forEach(catId => { acc[catId] = (acc[catId]||0) + 1 });
    return acc;
  }, {} as Record<string, number>);
};

// 3) Subcategory fetcher
export interface Subcategory {
  id: string;
  name: string;
  description: string;
  businessCount: number;
}
export const getSubcategories = async (categoryId: string): Promise<Subcategory[]> => {
  const records = await base<{
    Category: string[];
    Name: string;
    Description: string;
    Businesses?: string[];
  }>('Subcategories')
    .select({ fields: ['Category','Name','Description','Businesses'] })
    .all();
  return records
    .filter(r => r.fields.Category?.includes(categoryId))
    .map(r => ({
      id: r.id,
      name: r.fields.Name,
      description: r.fields.Description,
      businessCount: r.fields.Businesses?.length ?? 0,
    }));
};

// 4) Business model, mapper & fetchers
export interface Business {
  id: string;
  name: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  image?: string;
  isPremium: boolean;
  rating?: number;
  reviews?: number;      // ← added here
  category: string;
  subcategory: string;
}
const mapBusiness = (rec: any): Business => {
  const catLink = rec.get('Category');
  const subLink = rec.get('Subcategory');
  return {
    id: rec.id,
    name: rec.get('Name'),
    description: rec.get('Description'),
    location: rec.get('Location'),
    phone: rec.get('Phone'),
    email: rec.get('Email'),
    website: rec.get('Website'),
    image: rec.get('Image'),
    isPremium: rec.get('IsPremium'),
    rating: rec.get('Rating'),
    reviews: rec.get('Reviews') as number | undefined,  // ← and here
    category: Array.isArray(catLink) ? catLink[0] : catLink,
    subcategory: Array.isArray(subLink) ? subLink[0] : subLink,
  };
};

/**
 * Fetch all businesses then filter in JS by category/subcategory.
 */
export const getBusinesses = async (
  categoryId: string,
  subcategoryId: string
): Promise<Business[]> => {
  const records = await base<{
    Category?: string[];
    Subcategory?: string[];
    Name: string;
    Description: string;
    Location: string;
    Phone: string;
    Email: string;
    Image?: string;
    IsPremium: boolean;
    Rating?: number;
  }>('Businesses')
    .select({
      fields: [
        'Category',
        'Subcategory',
        'Name',
        'Description',
        'Location',
        'Phone',
        'Email',
        'Image',
        'IsPremium',
        'Rating',
      ],
    })
    .all();

  // (logging omitted for brevity)

  const filtered = records.filter(r => {
    const cats = r.fields.Category || [];
    const subs = r.fields.Subcategory || [];
    return cats.includes(categoryId) && subs.includes(subcategoryId);
  });

  return filtered.map(mapBusiness);
};

/**
 * Fetch one business by its record ID
 */
export const getBusinessById = async (id: string): Promise<Business|null> => {
  try {
    const rec = await base('Businesses').find(id);
    return mapBusiness(rec);
  } catch (e) {
    console.error('❌ [getBusinessById]', e);
    return null;
  }
};
