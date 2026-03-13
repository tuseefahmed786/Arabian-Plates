export type Emirate =
  | "Dubai"
  | "Abu Dhabi"
  | "Sharjah"
  | "Ajman"
  | "Ras Al Khaimah"
  | "Fujairah"
  | "Umm Al Quwain";

export type ListingSort =
  | "newest"
  | "lowest-price"
  | "highest-price"
  | "most-popular"
  | "premium-picks";

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  type: "Dealer" | "Private Owner" | "Broker";
  verified: boolean;
  totalSales: number;
  responseTime: string;
  location: Emirate;
}

export interface PlateListing {
  id: string;
  emirate: Emirate;
  code: string;
  number: string;
  digitCount: number;
  priceAed: number;
  negotiable: boolean;
  featured: boolean;
  premium: boolean;
  verified: boolean;
  popularity: number;
  rarity: "Iconic" | "Rare" | "Premium" | "Standard";
  sellerId: string;
  createdAt: string;
  views: number;
  saves: number;
  image: string;
  description: string;
}

export interface ListingFilters {
  query?: string;
  emirate?: Emirate;
  code?: string;
  digitCount?: number;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  verified?: boolean;
  negotiable?: boolean;
  sort?: ListingSort;
  page?: number;
  limit?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  trend: string;
  direction: "up" | "down";
}

export interface MockResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
