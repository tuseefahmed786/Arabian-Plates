"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackListingView = trackListingView;
exports.getListingAnalytics = getListingAnalytics;
exports.getPopularListings = getPopularListings;
const prisma_1 = require("../../database/prisma");
async function trackListingView(listingId, userId, ipAddress, userAgent) {
    await prisma_1.prisma.plateView.create({
        data: {
            listingId,
            userId,
            ipAddress,
            userAgent,
        },
    });
    await prisma_1.prisma.numberPlateListing.update({
        where: { id: listingId },
        data: { views: { increment: 1 } },
    });
}
async function getListingAnalytics(listingId) {
    const listing = await prisma_1.prisma.numberPlateListing.findUnique({ where: { id: listingId } });
    if (!listing)
        return null;
    const offersCount = await prisma_1.prisma.offer.count({ where: { listingId } });
    const inquiriesCount = await prisma_1.prisma.inquiry.count({ where: { listingId } });
    const popularityScore = (listing.views * 0.4) + (listing.favorites * 0.3) + (inquiriesCount * 0.2) + (offersCount * 0.1);
    const trendingScore = (listing.views * 0.5) + (listing.favorites * 0.3) + (offersCount * 0.2);
    return {
        listingId,
        views: listing.views,
        favorites: listing.favorites,
        inquiries: inquiriesCount,
        offers: offersCount,
        popularityScore: Number(popularityScore.toFixed(2)),
        trendingScore: Number(trendingScore.toFixed(2)),
    };
}
async function getPopularListings() {
    const rows = await prisma_1.prisma.numberPlateListing.findMany({ where: { status: "active" }, take: 20, orderBy: [{ views: "desc" }, { favorites: "desc" }] });
    return rows.map((listing) => {
        const popularityScore = Number(((listing.views * 0.6) + (listing.favorites * 0.4)).toFixed(2));
        return { listing, popularityScore };
    });
}
