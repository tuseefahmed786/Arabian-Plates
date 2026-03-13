import { prisma } from "../../database/prisma";
import { AppError } from "../../common/middleware/error-handler";

export async function createInquiry(userId: string, payload: { listingId: string; subject: string; message: string }) {
  const listing = await prisma.numberPlateListing.findUnique({ where: { id: payload.listingId } });
  if (!listing) throw new AppError("Listing not found", 404);

  const inquiry = await prisma.inquiry.create({
    data: {
      listingId: payload.listingId,
      userId,
      subject: payload.subject,
      message: payload.message,
    },
  });

  await prisma.numberPlateListing.update({
    where: { id: payload.listingId },
    data: { inquiriesCount: { increment: 1 } },
  });

  await prisma.notification.create({
    data: {
      userId: listing.userId,
      listingId: listing.id,
      title: "New inquiry",
      body: payload.subject,
    },
  });

  return inquiry;
}

export async function listInquiriesForSeller(userId: string) {
  return prisma.inquiry.findMany({
    where: { listing: { userId } },
    include: {
      listing: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function contactSeller(userId: string, payload: { listingId: string; message: string }) {
  const listing = await prisma.numberPlateListing.findUnique({ where: { id: payload.listingId } });
  if (!listing) throw new AppError("Listing not found", 404);

  return prisma.message.create({
    data: {
      senderId: userId,
      receiverId: listing.userId,
      content: payload.message,
    },
  });
}
