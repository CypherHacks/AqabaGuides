export interface Business {
  id: string;
  name: string;
  phone: string;
  email: string;
  website?: string;
  location: string;
  category: string;
  subcategory: string;
  description: string;
  image?: string;
  isPremium: boolean;
  rating?: number;
  reviews?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  count: number;
}