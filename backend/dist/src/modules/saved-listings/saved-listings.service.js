"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveListing = saveListing;
exports.unsaveListing = unsaveListing;
exports.getSavedListings = getSavedListings;
const prisma_1 = require("../../database/prisma");
async function saveListing(userId, listingId) {
    await prisma_1.prisma.savedListing.upsert({
        where: {
            userId_listingId: {
                userId,
                listingId,
            },
        },
        create: { userId, listingId },
        update: {},
    });
    await prisma_1.prisma.numberPlateListing.update({
        where: { id: listingId },
        data: { favorites: { increment: 1 } },
    });
}
async function unsaveListing(userId, listingId) {
    await prisma_1.prisma.savedListing.deleteMany({
        where: { userId, listingId },
    });
}
async function getSavedListings(userId) {
    return prisma_1.prisma.savedListing.findMany({
        where: { userId },
        include: {
            listing: true,
        },
        orderBy: { createdAt: "desc" },
    });
}
