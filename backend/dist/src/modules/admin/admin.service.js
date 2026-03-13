"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = getDashboard;
exports.approveListing = approveListing;
exports.rejectListing = rejectListing;
exports.removeListing = removeListing;
exports.manageUsers = manageUsers;
exports.manageReports = manageReports;
exports.setFeatured = setFeatured;
exports.moderateSuspiciousListing = moderateSuspiciousListing;
const prisma_1 = require("../../database/prisma");
const error_handler_1 = require("../../common/middleware/error-handler");
async function getDashboard() {
    const [totalUsers, totalListings, activeListings, pendingApproval, featuredListings, reportedListings] = await Promise.all([
        prisma_1.prisma.user.count(),
        prisma_1.prisma.numberPlateListing.count(),
        prisma_1.prisma.numberPlateListing.count({ where: { status: "active" } }),
        prisma_1.prisma.numberPlateListing.count({ where: { approvalStatus: "pending" } }),
        prisma_1.prisma.numberPlateListing.count({ where: { featured: true } }),
        prisma_1.prisma.listingReport.count({ where: { status: "open" } }),
    ]);
    return {
        totalUsers,
        totalListings,
        activeListings,
        pendingApproval,
        featuredListings,
        reportedListings,
        analyticsSummary: {
            listingActivationRate: totalListings === 0 ? 0 : Number(((activeListings / totalListings) * 100).toFixed(2)),
        },
    };
}
async function approveListing(listingId) {
    return prisma_1.prisma.numberPlateListing.update({
        where: { id: listingId },
        data: { approvalStatus: "approved", status: "active", verified: true },
    });
}
async function rejectListing(listingId) {
    return prisma_1.prisma.numberPlateListing.update({
        where: { id: listingId },
        data: { approvalStatus: "rejected", status: "rejected" },
    });
}
async function removeListing(listingId) {
    await prisma_1.prisma.numberPlateListing.delete({ where: { id: listingId } });
}
async function manageUsers() {
    return prisma_1.prisma.user.findMany({
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
    });
}
async function manageReports() {
    return prisma_1.prisma.listingReport.findMany({ include: { listing: true }, orderBy: { createdAt: "desc" }, take: 100 });
}
async function setFeatured(listingId, featured) {
    return prisma_1.prisma.numberPlateListing.update({ where: { id: listingId }, data: { featured } });
}
async function moderateSuspiciousListing(listingId, reason) {
    const listing = await prisma_1.prisma.numberPlateListing.findUnique({ where: { id: listingId } });
    if (!listing)
        throw new error_handler_1.AppError("Listing not found", 404);
    return prisma_1.prisma.listingReport.create({
        data: {
            listingId,
            reason,
            details: "Flagged by admin moderation endpoint",
            status: "open",
        },
    });
}
