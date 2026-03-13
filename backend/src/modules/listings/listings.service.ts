import { NumberPlateListing, Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { parsePagination } from "../../common/utils/pagination";
import { createSlug } from "../../common/utils/slug";
import { AppError } from "../../common/middleware/error-handler";
import { redis } from "../../database/redis";

const HOMEPAGE_FEATURED_KEY = "home:featured";
const HOMEPAGE_TRENDING_KEY = "home:trending";
const HOMEPAGE_PREMIUM_KEY = "home:premium";

function getSort(sort?: string): Prisma.NumberPlateListingOrderByWithRelationInput {
  switch (sort) {
    case "price-low-high":
      return { priceAED: "asc" };
    case "price-high-low":
      return { priceAED: "desc" };
    case "most-viewed":
      return { views: "desc" };
    case "most-favorited":
      return { favorites: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

function buildSmartSearch(q: string): Prisma.NumberPlateListingWhereInput[] {
  const normalized = q.trim();
  const words = normalized.split(/\s+/);
  const repeatedPattern = /^([0-9])\1+$/;

  const clauses: Prisma.NumberPlateListingWhereInput[] = [
    { plateNumber: { equals: normalized, mode: "insensitive" } },
    { plateNumber: { contains: normalized, mode: "insensitive" } },
    { formattedPlate: { equals: normalized, mode: "insensitive" } },
    { formattedPlate: { contains: normalized, mode: "insensitive" } },
  ];

  if (words.length >= 3) {
    clauses.push({
      AND: [
        { emirate: { equals: words[0], mode: "insensitive" } },
        { plateCode: { equals: words[1], mode: "insensitive" } },
        { plateNumber: { equals: words.slice(2).join(""), mode: "insensitive" } },
      ],
    });
  }

  if (repeatedPattern.test(normalized)) {
    clauses.push({ plateNumber: { contains: normalized[0] } });
  }

  return clauses;
}

function normalizeBoolean(value: unknown) {
  if (value === undefined) {
    return undefined;
  }
  if (value === true || value === "true") {
    return true;
  }
  if (value === false || value === "false") {
    return false;
  }
  return undefined;
}

export async function getListings(query: Record<string, unknown>) {
  const { page, limit, skip } = parsePagination(query);
  const isPopularSearch = typeof query.q === "string" && query.q.trim().length > 0;
  const searchCacheKey = isPopularSearch
    ? `search:${JSON.stringify({ ...query, page, limit })}`
    : null;

  if (searchCacheKey) {
    const cached = await getCached<{ rows: NumberPlateListing[]; page: number; limit: number; total: number }>(searchCacheKey);
    if (cached) {
      return cached;
    }
  }

  const where: Prisma.NumberPlateListingWhereInput = {
    ...(query.emirate ? { emirate: String(query.emirate) } : {}),
    ...(query.city ? { city: String(query.city) } : {}),
    ...(query.plateCode ? { plateCode: String(query.plateCode) } : {}),
    ...(query.plateNumber ? { plateNumber: { contains: String(query.plateNumber), mode: "insensitive" } } : {}),
    ...(query.digitCount ? { digitCount: Number(query.digitCount) } : {}),
    ...(query.minPrice || query.maxPrice
      ? {
          priceAED: {
            ...(query.minPrice ? { gte: Number(query.minPrice) } : {}),
            ...(query.maxPrice ? { lte: Number(query.maxPrice) } : {}),
          },
        }
      : {}),
    ...(normalizeBoolean(query.featured) !== undefined ? { featured: normalizeBoolean(query.featured) } : {}),
    ...(normalizeBoolean(query.verified) !== undefined ? { verified: normalizeBoolean(query.verified) } : {}),
    ...(normalizeBoolean(query.negotiable) !== undefined ? { negotiable: normalizeBoolean(query.negotiable) } : {}),
    ...(query.sellerType ? { sellerType: query.sellerType as Prisma.EnumSellerTypeFilter } : {}),
    ...(query.plateType ? { plateType: query.plateType as Prisma.EnumPlateTypeFilter } : {}),
    ...(query.status ? { status: query.status as Prisma.EnumListingStatusFilter } : {}),
    ...(query.q ? { OR: buildSmartSearch(String(query.q)) } : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.numberPlateListing.findMany({
      where,
      skip,
      take: limit,
      orderBy: getSort(String(query.sort ?? "newest")),
      include: { user: { select: { id: true, fullName: true, email: true, role: true } } },
    }),
    prisma.numberPlateListing.count({ where }),
  ]);

  const response = {
    rows,
    page,
    limit,
    total,
  };

  if (searchCacheKey) {
    await setCached(searchCacheKey, response, 90);
  }

  return response;
}

export async function getListingById(id: string) {
  const listing = await prisma.numberPlateListing.findUnique({ where: { id } });
  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  return listing;
}

export async function getListingBySlug(slug: string) {
  const listing = await prisma.numberPlateListing.findUnique({ where: { slug } });
  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  return listing;
}

export async function createListing(userId: string, payload: {
  emirate: string;
  city: string;
  plateCode: string;
  plateNumber: string;
  priceAED: number;
  negotiable: boolean;
  sellerType: "owner" | "broker" | "dealer";
  plateType: "standard" | "premium" | "vip";
  description?: string;
  ownershipStatus?: string;
  expiresAt?: Date;
}) {
  const formattedPlate = `${payload.emirate} ${payload.plateCode} ${payload.plateNumber}`;
  const slugBase = createSlug(formattedPlate);
  const slug = `${slugBase}-${Date.now().toString().slice(-6)}`;
  const listingId = `NP${Date.now().toString().slice(-8)}`;

  return prisma.numberPlateListing.create({
    data: {
      listingId,
      emirate: payload.emirate,
      city: payload.city,
      plateCode: payload.plateCode,
      plateNumber: payload.plateNumber,
      formattedPlate,
      digitCount: payload.plateNumber.length,
      priceAED: payload.priceAED,
      negotiable: payload.negotiable,
      sellerType: payload.sellerType,
      plateType: payload.plateType,
      description: payload.description,
      ownershipStatus: payload.ownershipStatus ?? "unknown",
      expiresAt: payload.expiresAt,
      status: "pending",
      approvalStatus: "pending",
      slug,
      userId,
      isPublished: true,
    },
  });
}

export async function updateListing(id: string, data: Record<string, unknown>, actor: { id: string; role: string }) {
  const existing = await prisma.numberPlateListing.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Listing not found", 404);
  }

  if (actor.role !== "admin" && existing.userId !== actor.id) {
    throw new AppError("Forbidden", 403);
  }

  return prisma.numberPlateListing.update({
    where: { id },
    data,
  });
}

export async function deleteListing(id: string, actor: { id: string; role: string }) {
  const existing = await prisma.numberPlateListing.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Listing not found", 404);
  }

  if (actor.role !== "admin" && existing.userId !== actor.id) {
    throw new AppError("Forbidden", 403);
  }

  await prisma.numberPlateListing.delete({ where: { id } });
}

export async function markFeatured(id: string, featured: boolean) {
  return prisma.numberPlateListing.update({ where: { id }, data: { featured } });
}

export async function markVerified(id: string, verified: boolean) {
  return prisma.numberPlateListing.update({ where: { id }, data: { verified } });
}

export async function changeStatus(id: string, status: "active" | "pending" | "sold" | "rejected" | "archived") {
  return prisma.numberPlateListing.update({ where: { id }, data: { status } });
}

export async function getSimilarListings(id: string) {
  const current = await prisma.numberPlateListing.findUnique({ where: { id } });
  if (!current) {
    throw new AppError("Listing not found", 404);
  }

  return prisma.numberPlateListing.findMany({
    where: {
      id: { not: id },
      emirate: current.emirate,
      digitCount: current.digitCount,
    },
    take: 8,
    orderBy: { views: "desc" },
  });
}

async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    if (!cached) return null;
    return JSON.parse(cached) as T;
  } catch {
    return null;
  }
}

async function setCached(key: string, value: unknown, ttlSeconds = 120) {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    return;
  }
}

export async function getTrendingListings() {
  const cached = await getCached<NumberPlateListing[]>(HOMEPAGE_TRENDING_KEY);
  if (cached) return cached;

  const rows = await prisma.numberPlateListing.findMany({ where: { status: "active" }, take: 10, orderBy: [{ views: "desc" }, { favorites: "desc" }] });
  await setCached(HOMEPAGE_TRENDING_KEY, rows);
  return rows;
}

export async function getFeaturedListings() {
  const cached = await getCached<NumberPlateListing[]>(HOMEPAGE_FEATURED_KEY);
  if (cached) return cached;

  const rows = await prisma.numberPlateListing.findMany({ where: { featured: true, status: "active" }, take: 10, orderBy: { createdAt: "desc" } });
  await setCached(HOMEPAGE_FEATURED_KEY, rows);
  return rows;
}

export async function getPremiumListings() {
  const cached = await getCached<NumberPlateListing[]>(HOMEPAGE_PREMIUM_KEY);
  if (cached) return cached;

  const rows = await prisma.numberPlateListing.findMany({ where: { plateType: { in: ["premium", "vip"] }, status: "active" }, take: 10, orderBy: { priceAED: "desc" } });
  await setCached(HOMEPAGE_PREMIUM_KEY, rows);
  return rows;
}

export async function getLatestListings() {
  return prisma.numberPlateListing.findMany({
    where: { status: "active" },
    take: 12,
    orderBy: { createdAt: "desc" },
  });
}

export async function reportListing(listingId: string, reportedById: string, reason: string, details?: string) {
  await prisma.numberPlateListing.findUniqueOrThrow({ where: { id: listingId } });

  return prisma.listingReport.create({
    data: {
      listingId,
      reportedById,
      reason,
      details,
      status: "open",
    },
  });
}
