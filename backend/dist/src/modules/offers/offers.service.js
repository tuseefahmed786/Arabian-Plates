"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOffer = makeOffer;
exports.getOffersReceived = getOffersReceived;
exports.getOffersSent = getOffersSent;
exports.updateOfferStatus = updateOfferStatus;
const prisma_1 = require("../../database/prisma");
const error_handler_1 = require("../../common/middleware/error-handler");
async function makeOffer(userId, payload) {
    const listing = await prisma_1.prisma.numberPlateListing.findUnique({ where: { id: payload.listingId } });
    if (!listing) {
        throw new error_handler_1.AppError("Listing not found", 404);
    }
    const offer = await prisma_1.prisma.offer.create({
        data: {
            listingId: payload.listingId,
            senderId: userId,
            receiverId: listing.userId,
            amountAED: payload.amountAED,
            note: payload.note,
            status: "pending",
        },
    });
    await prisma_1.prisma.notification.create({
        data: {
            userId: listing.userId,
            listingId: listing.id,
            title: "New offer received",
            body: `You received a new offer of AED ${payload.amountAED}`,
        },
    });
    return offer;
}
async function getOffersReceived(userId) {
    return prisma_1.prisma.offer.findMany({ where: { receiverId: userId }, include: { listing: true, sender: true }, orderBy: { createdAt: "desc" } });
}
async function getOffersSent(userId) {
    return prisma_1.prisma.offer.findMany({ where: { senderId: userId }, include: { listing: true, receiver: true }, orderBy: { createdAt: "desc" } });
}
async function updateOfferStatus(userId, offerId, status) {
    const offer = await prisma_1.prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer)
        throw new error_handler_1.AppError("Offer not found", 404);
    if (offer.receiverId !== userId)
        throw new error_handler_1.AppError("Forbidden", 403);
    return prisma_1.prisma.offer.update({
        where: { id: offerId },
        data: { status },
    });
}
