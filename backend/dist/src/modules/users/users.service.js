"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
exports.getSellerDashboard = getSellerDashboard;
const prisma_1 = require("../../database/prisma");
async function getMe(userId) {
    return prisma_1.prisma.user.findUnique({
        where: { id: userId },
        include: { sellerProfile: true },
    });
}
async function getSellerDashboard(userId) {
    const [myListings, aggregate, recentOffers, recentInquiries] = await Promise.all([
        prisma_1.prisma.numberPlateListing.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
        prisma_1.prisma.numberPlateListing.aggregate({
            where: { userId },
            _sum: {
                views: true,
                favorites: true,
                inquiriesCount: true,
            },
            _count: { _all: true },
        }),
        prisma_1.prisma.offer.findMany({ where: { receiverId: userId }, include: { listing: true, sender: true }, orderBy: { createdAt: "desc" }, take: 10 }),
        prisma_1.prisma.inquiry.findMany({ where: { listing: { userId } }, include: { listing: true, user: true }, orderBy: { createdAt: "desc" }, take: 10 }),
    ]);
    return {
        myListings,
        stats: {
            totalListings: aggregate._count._all,
            totalViews: aggregate._sum.views ?? 0,
            totalFavorites: aggregate._sum.favorites ?? 0,
            totalInquiries: aggregate._sum.inquiriesCount ?? 0,
            totalOffers: recentOffers.length,
        },
        recentActivity: {
            offers: recentOffers,
            inquiries: recentInquiries,
        },
    };
}
