"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInquiry = createInquiry;
exports.listInquiriesForSeller = listInquiriesForSeller;
exports.contactSeller = contactSeller;
const prisma_1 = require("../../database/prisma");
const error_handler_1 = require("../../common/middleware/error-handler");
async function createInquiry(userId, payload) {
    const listing = await prisma_1.prisma.numberPlateListing.findUnique({ where: { id: payload.listingId } });
    if (!listing)
        throw new error_handler_1.AppError("Listing not found", 404);
    const inquiry = await prisma_1.prisma.inquiry.create({
        data: {
            listingId: payload.listingId,
            userId,
            subject: payload.subject,
            message: payload.message,
        },
    });
    await prisma_1.prisma.numberPlateListing.update({
        where: { id: payload.listingId },
        data: { inquiriesCount: { increment: 1 } },
    });
    await prisma_1.prisma.notification.create({
        data: {
            userId: listing.userId,
            listingId: listing.id,
            title: "New inquiry",
            body: payload.subject,
        },
    });
    return inquiry;
}
async function listInquiriesForSeller(userId) {
    return prisma_1.prisma.inquiry.findMany({
        where: { listing: { userId } },
        include: {
            listing: true,
            user: true,
        },
        orderBy: { createdAt: "desc" },
    });
}
async function contactSeller(userId, payload) {
    const listing = await prisma_1.prisma.numberPlateListing.findUnique({ where: { id: payload.listingId } });
    if (!listing)
        throw new error_handler_1.AppError("Listing not found", 404);
    return prisma_1.prisma.message.create({
        data: {
            senderId: userId,
            receiverId: listing.userId,
            content: payload.message,
        },
    });
}
