import { prisma } from "../../database/prisma";

export async function saveListing(userId: string, listingId: string) {
  await prisma.savedListing.upsert({
    where: {
      userId_listingId: {
        userId,
        listingId,
      },
    },
    create: { userId, listingId },
    update: {},
  });

  await prisma.numberPlateListing.update({
    where: { id: listingId },
    data: { favorites: { increment: 1 } },
  });
}

export async function unsaveListing(userId: string, listingId: string) {
  await prisma.savedListing.deleteMany({
    where: { userId, listingId },
  });
}

export async function getSavedListings(userId: string) {
  return prisma.savedListing.findMany({
    where: { userId },
    include: {
      listing: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
