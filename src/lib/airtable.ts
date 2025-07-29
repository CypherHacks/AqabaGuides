import Airtable from 'airtable';

const apiKey = typeof window === 'undefined'
  ? process.env.VITE_AIRTABLE_API_KEY
  : import.meta.env.VITE_AIRTABLE_API_KEY;

const baseId = typeof window === 'undefined'
  ? process.env.VITE_AIRTABLE_BASE_ID
  : import.meta.env.VITE_AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  throw new Error('Missing Airtable configuration');
}

const base = new Airtable({ apiKey }).base(baseId);

// —————————————————————————
// Category & Subcategory Types
// —————————————————————————

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  businessCount: number;
}

// —————————————————————————
// Category / Subcategory Fetchers
// —————————————————————————

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

export const getSubcategories = async (categoryId: string): Promise<Subcategory[]> => {
  const records = await base<{
    Category: string[];
    Name: string;
    Description: string;
    Businesses?: string[];
  }>('Subcategories')
    .select({ fields: ['Category', 'Name', 'Description', 'Businesses'] })
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

// —————————————————————————
// NEW: Business Count per Category
// —————————————————————————

/**
 * Count how many Business records belong to each Category ID
 */
export const getBusinessCounts = async (): Promise<Record<string, number>> => {
  const records = await base<{ Category: string[] }>('Businesses')
    .select({ fields: ['Category'] })
    .all();

  return records.reduce((acc, rec) => {
    rec.fields.Category?.forEach(catId => {
      acc[catId] = (acc[catId] ?? 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
};

// —————————————————————————
// Subcategory Count per Category
// —————————————————————————

export const getSubcategoryCounts = async (): Promise<Record<string, number>> => {
  const records = await base<{ Category: string[] }>('Subcategories')
    .select({ fields: ['Category'] })
    .all();

  return records.reduce((acc, rec) => {
    rec.fields.Category?.forEach(catId => {
      acc[catId] = (acc[catId] ?? 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
};

// —————————————————————————
// Business Type + Fetchers
// —————————————————————————

export interface Business {
  id: string;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  image?: string;
  isPremium: boolean;
  rating?: number;
  reviews?: number;
  category: string;
  subcategory: string;
}

const mapBusiness = (rec: Airtable.Record<any>): Business => {
  const catLink = rec.get('Category');
  const subLink = rec.get('Subcategory');
  return {
    id: rec.id,
    name: rec.get('Name') as string,
    name_en: rec.get('Name_EN') as string | undefined,
    description: rec.get('Description') as string,
    description_en: rec.get('Description_EN') as string | undefined,
    location: rec.get('Location') as string,
    phone: rec.get('Phone') as string,
    email: rec.get('Email') as string,
    website: rec.get('Website') as string | undefined,
    image: rec.get('Image') as string | undefined,
    isPremium: rec.get('IsPremium') as boolean,
    rating: rec.get('Rating') as number | undefined,
    reviews: rec.get('Reviews') as number | undefined,
    category: Array.isArray(catLink) ? catLink[0] : (catLink as string),
    subcategory: Array.isArray(subLink) ? subLink[0] : (subLink as string),
  };
};

export const getAllBusinesses = async (): Promise<Business[]> => {
  const records = await base<any>('Businesses')
    .select({ })
    .all();
  return records.map(mapBusiness);
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  try {
    const rec = await base('Businesses').find(id);
    return mapBusiness(rec);
  } catch {
    return null;
  }
};
