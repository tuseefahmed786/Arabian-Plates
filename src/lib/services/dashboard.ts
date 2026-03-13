import { getAccessToken } from "@/lib/auth-client";
import { apiGet } from "@/lib/services/api";
import { DashboardMetric, PlateListing } from "@/lib/types";

interface BackendListing {
  id: string;
  emirate: string;
  plateCode: string;
  plateNumber: string;
  digitCount: number;
  priceAED: number;
  negotiable: boolean;
  featured: boolean;
  verified: boolean;
  plateType: "standard" | "premium" | "vip";
  views: number;
  favorites: number;
  userId: string;
  createdAt: string;
  description?: string;
}

interface SellerDashboardData {
  myListings: BackendListing[];
  stats: {
    totalListings: number;
    totalViews: number;
    totalFavorites: number;
    totalInquiries: number;
    totalOffers: number;
  };
  recentActivity: {
    offers: Array<{ id: string; amountAED: number; status: string; listing: BackendListing }>;
    inquiries: Array<{ id: string; subject: string; message: string; listing: BackendListing }>;
  };
}

interface AdminDashboardData {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  pendingApproval: number;
  featuredListings: number;
  reportedListings: number;
}

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

interface ListingReport {
  id: string;
  reason: string;
  status: string;
  listing: BackendListing;
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

export async function getSellerDashboardLive() {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Please login to view dashboard");
  }

  const [dashboardRes, savedRes, messagesRes] = await Promise.all([
    apiGet<SellerDashboardData>("/users/dashboard/seller", token),
    apiGet<Array<{ listing: BackendListing }>>("/saved-listings", token),
    apiGet<Array<{ id: string; content: string }>>("/messages", token),
  ]);

  const stats: DashboardMetric[] = [
    {
      id: "live-1",
      title: "Active Listings",
      value: String(dashboardRes.data.stats.totalListings),
      trend: `${dashboardRes.data.stats.totalOffers} open offers`,
      direction: "up",
    },
    {
      id: "live-2",
      title: "Saved by Buyers",
      value: String(dashboardRes.data.stats.totalFavorites),
      trend: `${dashboardRes.data.stats.totalViews} total views`,
      direction: "up",
    },
    {
      id: "live-3",
      title: "Open Offers",
      value: String(dashboardRes.data.stats.totalOffers),
      trend: `${dashboardRes.data.stats.totalInquiries} inquiries`,
      direction: "up",
    },
    {
      id: "live-4",
      title: "Profile Score",
      value: dashboardRes.data.stats.totalListings > 0 ? "90/100" : "65/100",
      trend: dashboardRes.data.stats.totalListings > 0 ? "Marketplace active" : "Complete first listing",
      direction: "up",
    },
  ];

  return {
    stats,
    myListings: dashboardRes.data.myListings.map(toPlateListing),
    savedListings: savedRes.data.map((item) => toPlateListing(item.listing)),
    offers: dashboardRes.data.recentActivity.offers,
    inquiries: dashboardRes.data.recentActivity.inquiries,
    messages: messagesRes.data,
  };
}

export async function getAdminDashboardLive() {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Please login as admin");
  }

  const [dashboardRes, usersRes, reportsRes, listingsRes] = await Promise.all([
    apiGet<AdminDashboardData>("/admin/dashboard", token),
    apiGet<AdminUser[]>("/admin/users", token),
    apiGet<ListingReport[]>("/admin/reports", token),
    apiGet<BackendListing[]>("/listings?limit=20", token),
  ]);

  const stats: DashboardMetric[] = [
    {
      id: "admin-live-1",
      title: "Total Users",
      value: String(dashboardRes.data.totalUsers),
      trend: "Live from backend",
      direction: "up",
    },
    {
      id: "admin-live-2",
      title: "Total Listings",
      value: String(dashboardRes.data.totalListings),
      trend: `${dashboardRes.data.activeListings} active`,
      direction: "up",
    },
    {
      id: "admin-live-3",
      title: "Pending Moderation",
      value: String(dashboardRes.data.pendingApproval),
      trend: `${dashboardRes.data.reportedListings} reports open`,
      direction: "down",
    },
    {
      id: "admin-live-4",
      title: "Featured Listings",
      value: String(dashboardRes.data.featuredListings),
      trend: "Premium placements",
      direction: "up",
    },
  ];

  return {
    stats,
    listings: listingsRes.data.map(toPlateListing),
    users: usersRes.data,
    reports: reportsRes.data,
  };
}
