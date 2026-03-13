"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListings = getListings;
exports.getListingById = getListingById;
exports.getListingBySlug = getListingBySlug;
exports.createListing = createListing;
exports.updateListing = updateListing;
exports.deleteListing = deleteListing;
exports.markFeatured = markFeatured;
exports.markVerified = markVerified;
exports.changeStatus = changeStatus;
exports.getSimilarListings = getSimilarListings;
exports.getTrendingListings = getTrendingListings;
exports.getFeaturedListings = getFeaturedListings;
exports.getPremiumListings = getPremiumListings;
exports.getLatestListings = getLatestListings;
exports.reportListing = reportListing;
const prisma_1 = require("../../database/prisma");
const pagination_1 = require("../../common/utils/pagination");
const slug_1 = require("../../common/utils/slug");
const error_handler_1 = require("../../common/middleware/error-handler");
const redis_1 = require("../../database/redis");
const HOMEPAGE_FEATURED_KEY = "home:featured";
const HOMEPAGE_TRENDING_KEY = "home:trending";
const HOMEPAGE_PREMIUM_KEY = "home:premium";
function getSort(sort) {
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
function buildSmartSearch(q) {
    const normalized = q.trim();
    const words = normalized.split(/\s+/);
    const repeatedPattern = /^([0-9])\1+$/;
    const clauses = [
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
function normalizeBoolean(value) {
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
async function getListings(query) {
    const { page, limit, skip } = (0, pagination_1.parsePagination)(query);
    const isPopularSearch = typeof query.q === "string" && query.q.trim().length > 0;
    const searchCacheKey = isPopularSearch
        ? `search:${JSON.stringify({ ...query, page, limit })}`
        : null;
    if (searchCacheKey) {
        const cached = await getCached(searchCacheKey);
        if (cached) {
            return cached;
        }
    }
    const where = {
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
        ...(query.sellerType ? { sellerType: query.sellerType } : {}),
        ...(query.plateType ? { plateType: query.plateType } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.q ? { OR: buildSmartSearch(String(query.q)) } : {}),
    };
    const [rows, total] = await Promise.all([
        prisma_1.prisma.numberPlateListing.findMany({
            where,
            skip,
            take: limit,
            orderBy: getSort(String(query.sort ?? "newest")),
            include: { user: { select: { id: true, fullName: true, email: true, role: true } } },
        }),
        prisma_1.prisma.numberPlateListing.count({ where }),
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
async function getListingById(id) {
    const listing = await prisma_1.prisma.numberPlateListing.findUnique({ where: { id } });
    if (!listing) {
        throw new error_handler_1.AppError("Listing not found", 404);
    }
    return listing;
}
async function getListingBySlug(slug) {
    const listing = await prisma_1.prisma.numberPlateListing.findUnique({ where: { slug } });
    if (!listing) {
        throw new error_handler_1.AppError("Listing not found", 404);
    }
    return listing;
}
async function createListing(userId, payload) {
    const formattedPlate = `${payload.emirate} ${payload.plateCode} ${payload.plateNumber}`;
    const slugBase = (0, slug_1.createSlug)(formattedPlate);
    const slug = `${slugBase}-${Date.now().toString().slice(-6)}`;
    const listingId = `NP${Date.now().toString().slice(-8)}`;
    return prisma_1.prisma.numberPlateListing.create({
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
async function updateListing(id, data, actor) {
    const existing = await prisma_1.prisma.numberPlateListing.findUnique({ where: { id } });
    if (!existing) {
        throw new error_handler_1.AppError("Listing not found", 404);
    }
    if (actor.role !== "admin" && existing.userId !== actor.id) {
        throw new error_handler_1.AppError("Forbidden", 403);
    }
    return prisma_1.prisma.numberPlateListing.update({
        where: { id },
        data,
    });
}
async function deleteListing(id, actor) {
    const existing = await prisma_1.prisma.numberPlateListing.findUnique({ where: { id } });
    if (!existing) {
        throw new error_handler_1.AppError("Listing not found", 404);
    }
    if (actor.role !== "admin" && existing.userId !== actor.id) {
        throw new error_handler_1.AppError("Forbidden", 403);
    }
    await prisma_1.prisma.numberPlateListing.delete({ where: { id } });
}
async function markFeatured(id, featured) {
    return prisma_1.prisma.numberPlateListing.update({ where: { id }, data: { featured } });
}
async function markVerified(id, verified) {
    return prisma_1.prisma.numberPlateListing.update({ where: { id }, data: { verified } });
}
async function changeStatus(id, status) {
    return prisma_1.prisma.numberPlateListing.update({ where: { id }, data: { status } });
}
async function getSimilarListings(id) {
    const current = await prisma_1.prisma.numberPlateListing.findUnique({ where: { id } });
    if (!current) {
        throw new error_handler_1.AppError("Listing not found", 404);
    }
    return prisma_1.prisma.numberPlateListing.findMany({
        where: {
            id: { not: id },
            emirate: current.emirate,
            digitCount: current.digitCount,
        },
        take: 8,
        orderBy: { views: "desc" },
    });
}
async function getCached(key) {
    try {
        const cached = await redis_1.redis.get(key);
        if (!cached)
            return null;
        return JSON.parse(cached);
    }
    catch {
        return null;
    }
}
async function setCached(key, value, ttlSeconds = 120) {
    try {
        await redis_1.redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    }
    catch {
        return;
    }
}
async function getTrendingListings() {
    const cached = await getCached(HOMEPAGE_TRENDING_KEY);
    if (cached)
        return cached;
    const rows = await prisma_1.prisma.numberPlateListing.findMany({ where: { status: "active" }, take: 10, orderBy: [{ views: "desc" }, { favorites: "desc" }] });
    await setCached(HOMEPAGE_TRENDING_KEY, rows);
    return rows;
}
async function getFeaturedListings() {
    const cached = await getCached(HOMEPAGE_FEATURED_KEY);
    if (cached)
        return cached;
    const rows = await prisma_1.prisma.numberPlateListing.findMany({ where: { featured: true, status: "active" }, take: 10, orderBy: { createdAt: "desc" } });
    await setCached(HOMEPAGE_FEATURED_KEY, rows);
    return rows;
}
async function getPremiumListings() {
    const cached = await getCached(HOMEPAGE_PREMIUM_KEY);
    if (cached)
        return cached;
    const rows = await prisma_1.prisma.numberPlateListing.findMany({ where: { plateType: { in: ["premium", "vip"] }, status: "active" }, take: 10, orderBy: { priceAED: "desc" } });
    await setCached(HOMEPAGE_PREMIUM_KEY, rows);
    return rows;
}
async function getLatestListings() {
    return prisma_1.prisma.numberPlateListing.findMany({
        where: { status: "active" },
        take: 12,
        orderBy: { createdAt: "desc" },
    });
}
async function reportListing(listingId, reportedById, reason, details) {
    await prisma_1.prisma.numberPlateListing.findUniqueOrThrow({ where: { id: listingId } });
    return prisma_1.prisma.listingReport.create({
        data: {
            listingId,
            reportedById,
            reason,
            details,
            status: "open",
        },
    });
}
