import { prisma } from "../../database/prisma";
import { AppError } from "../../common/middleware/error-handler";

export async function getDashboard() {
  const [totalUsers, totalListings, activeListings, pendingApproval, featuredListings, reportedListings] = await Promise.all([
    prisma.user.count(),
    prisma.numberPlateListing.count(),
    prisma.numberPlateListing.count({ where: { status: "active" } }),
    prisma.numberPlateListing.count({ where: { approvalStatus: "pending" } }),
    prisma.numberPlateListing.count({ where: { featured: true } }),
    prisma.listingReport.count({ where: { status: "open" } }),
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

export async function approveListing(listingId: string) {
  return prisma.numberPlateListing.update({
    where: { id: listingId },
    data: { approvalStatus: "approved", status: "active", verified: true },
  });
}

export async function rejectListing(listingId: string) {
  return prisma.numberPlateListing.update({
    where: { id: listingId },
    data: { approvalStatus: "rejected", status: "rejected" },
  });
}

export async function removeListing(listingId: string) {
  await prisma.numberPlateListing.delete({ where: { id: listingId } });
}

export async function manageUsers() {
  return prisma.user.findMany({
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

export async function manageReports() {
  return prisma.listingReport.findMany({ include: { listing: true }, orderBy: { createdAt: "desc" }, take: 100 });
}

export async function setFeatured(listingId: string, featured: boolean) {
  return prisma.numberPlateListing.update({ where: { id: listingId }, data: { featured } });
}

export async function moderateSuspiciousListing(listingId: string, reason: string) {
  const listing = await prisma.numberPlateListing.findUnique({ where: { id: listingId } });
  if (!listing) throw new AppError("Listing not found", 404);

  return prisma.listingReport.create({
    data: {
      listingId,
      reason,
      details: "Flagged by admin moderation endpoint",
      status: "open",
    },
  });
}
