import { prisma } from "../../database/prisma";
import { AppError } from "../../common/middleware/error-handler";

export async function makeOffer(userId: string, payload: { listingId: string; amountAED: number; note?: string }) {
  const listing = await prisma.numberPlateListing.findUnique({ where: { id: payload.listingId } });
  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  const offer = await prisma.offer.create({
    data: {
      listingId: payload.listingId,
      senderId: userId,
      receiverId: listing.userId,
      amountAED: payload.amountAED,
      note: payload.note,
      status: "pending",
    },
  });

  await prisma.notification.create({
    data: {
      userId: listing.userId,
      listingId: listing.id,
      title: "New offer received",
      body: `You received a new offer of AED ${payload.amountAED}`,
    },
  });

  return offer;
}

export async function getOffersReceived(userId: string) {
  return prisma.offer.findMany({ where: { receiverId: userId }, include: { listing: true, sender: true }, orderBy: { createdAt: "desc" } });
}

export async function getOffersSent(userId: string) {
  return prisma.offer.findMany({ where: { senderId: userId }, include: { listing: true, receiver: true }, orderBy: { createdAt: "desc" } });
}

export async function updateOfferStatus(userId: string, offerId: string, status: "accepted" | "rejected") {
  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) throw new AppError("Offer not found", 404);
  if (offer.receiverId !== userId) throw new AppError("Forbidden", 403);

  return prisma.offer.update({
    where: { id: offerId },
    data: { status },
  });
}
