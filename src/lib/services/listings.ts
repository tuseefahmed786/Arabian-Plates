import { sellers } from "@/data/mock/sellers";
import { ListingFilters, ListingSort, MockResponse, PlateListing, Seller } from "@/lib/types";
import { apiGet } from "@/lib/services/api";

interface BackendListing {
  id: string;
  listingId: string;
  emirate: string;
  city: string;
  plateCode: string;
  plateNumber: string;
  digitCount: number;
  priceAED: number;
  negotiable: boolean;
  featured: boolean;
  verified: boolean;
  sellerType: "owner" | "broker" | "dealer";
  plateType: "standard" | "premium" | "vip";
  status: "active" | "pending" | "sold" | "rejected" | "archived";
  views: number;
  favorites: number;
  createdAt: string;
  userId: string;
  description?: string;
}

function mapSort(sort?: ListingSort): string {
  switch (sort) {
    case "lowest-price":
      return "price-low-high";
    case "highest-price":
      return "price-high-low";
    case "most-popular":
      return "most-viewed";
    case "premium-picks":
      return "most-favorited";
    case "newest":
    default:
      return "newest";
  }
}

function toPlateListing(item: BackendListing): PlateListing {
  const rarity =
    item.plateType === "vip"
      ? "Iconic"
      : item.plateType === "premium"
        ? "Premium"
        : item.digitCount <= 3
          ? "Rare"
          : "Standard";

  return {
    id: item.id,
    emirate: item.emirate as PlateListing["emirate"],
    code: item.plateCode,
    number: item.plateNumber,
    digitCount: item.digitCount,
    priceAed: item.priceAED,
    negotiable: item.negotiable,
    featured: item.featured,
    premium: item.plateType === "premium" || item.plateType === "vip",
    verified: item.verified,
    popularity: item.views + item.favorites,
    rarity,
    sellerId: item.userId,
    createdAt: item.createdAt,
    views: item.views,
    saves: item.favorites,
    image: "/plates/default.svg",
    description: item.description ?? `${item.emirate} ${item.plateCode} ${item.plateNumber}`,
  };
}

function buildListingsQuery(filters: ListingFilters = {}) {
  const query = new URLSearchParams();

  if (filters.query) query.set("q", filters.query);
  if (filters.page) query.set("page", String(filters.page));
  if (filters.limit) query.set("limit", String(filters.limit));
  if (filters.emirate) query.set("emirate", filters.emirate);
  if (filters.code) query.set("plateCode", filters.code);
  if (filters.digitCount) query.set("digitCount", String(filters.digitCount));
  if (filters.minPrice) query.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) query.set("maxPrice", String(filters.maxPrice));
  if (filters.featured) query.set("featured", "true");
  if (filters.verified) query.set("verified", "true");
  if (filters.negotiable) query.set("negotiable", "true");
  if (filters.sort) query.set("sort", mapSort(filters.sort));

  return query.toString();
}

export async function getListings(filters: ListingFilters = {}): Promise<MockResponse<PlateListing[]>> {
  try {
    const query = buildListingsQuery(filters);
    const response = await apiGet<BackendListing[]>(`/listings${query ? `?${query}` : ""}`);

    return {
      ok: true,
      data: response.data.map(toPlateListing),
      meta: response.meta,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to load listings",
    };
  }
}

export async function getListingById(id: string): Promise<MockResponse<PlateListing>> {
  try {
    const response = await apiGet<BackendListing>(`/listings/${id}`);
    return { ok: true, data: toPlateListing(response.data) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Listing not found",
    };
  }
}

export async function getSellerById(id: string): Promise<MockResponse<Seller>> {
  const seller = sellers.find((item) => item.id === id);

  if (!seller) {
    return {
      ok: true,
      data: {
        id,
        name: "Verified Seller",
        avatar: "VS",
        type: "Dealer",
        verified: true,
        totalSales: 0,
        responseTime: "within 30 minutes",
        location: "Dubai",
      },
    };
  }

  return { ok: true, data: seller };
}

export async function getFeaturedListings(): Promise<MockResponse<PlateListing[]>> {
  try {
    const response = await apiGet<BackendListing[]>("/listings/featured");
    return { ok: true, data: response.data.map(toPlateListing) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unable to fetch featured listings" };
  }
}

export async function getTrendingListings(): Promise<MockResponse<PlateListing[]>> {
  try {
    const response = await apiGet<BackendListing[]>("/listings/trending");
    return { ok: true, data: response.data.map(toPlateListing) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unable to fetch trending listings" };
  }
}

export async function getPremiumListings(): Promise<MockResponse<PlateListing[]>> {
  try {
    const response = await apiGet<BackendListing[]>("/listings/premium");
    return { ok: true, data: response.data.map(toPlateListing) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unable to fetch premium listings" };
  }
}

export async function getLatestListings(): Promise<MockResponse<PlateListing[]>> {
  try {
    const response = await apiGet<BackendListing[]>("/listings/latest");
    return { ok: true, data: response.data.map(toPlateListing) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unable to fetch latest listings" };
  }
}

export async function getSimilarListings(id: string): Promise<MockResponse<PlateListing[]>> {
  try {
    const response = await apiGet<BackendListing[]>(`/listings/${id}/similar`);
    return { ok: true, data: response.data.map(toPlateListing) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unable to fetch similar listings" };
  }
}
