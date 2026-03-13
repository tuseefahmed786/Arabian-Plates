"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function normalizeStatus(status) {
    if (status === "pending_verification") {
        return "pending";
    }
    return status;
}
function createSlug(item) {
    return `${item.emirate}-${item.plateCode}-${item.plateNumber}-${item.listingId}`
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
async function ensureSeedUsers() {
    const passwordHash = await bcryptjs_1.default.hash("SeedUser@123", 10);
    const owner = await prisma.user.upsert({
        where: { email: "owner.seed@arabianplates.ae" },
        update: {},
        create: {
            fullName: "Seed Owner",
            email: "owner.seed@arabianplates.ae",
            passwordHash,
            role: "seller",
            isEmailVerified: true,
            sellerProfile: {
                create: { verified: true, companyName: "Seed Owner Garage", emirate: "Dubai", city: "Dubai" },
            },
        },
    });
    const broker = await prisma.user.upsert({
        where: { email: "broker.seed@arabianplates.ae" },
        update: {},
        create: {
            fullName: "Seed Broker",
            email: "broker.seed@arabianplates.ae",
            passwordHash,
            role: "seller",
            isEmailVerified: true,
            sellerProfile: {
                create: { verified: true, companyName: "Seed Broker House", emirate: "Abu Dhabi", city: "Abu Dhabi" },
            },
        },
    });
    const dealer = await prisma.user.upsert({
        where: { email: "dealer.seed@arabianplates.ae" },
        update: {},
        create: {
            fullName: "Seed Dealer",
            email: "dealer.seed@arabianplates.ae",
            passwordHash,
            role: "seller",
            isEmailVerified: true,
            sellerProfile: {
                create: { verified: true, companyName: "Seed Dealer Motors", emirate: "Sharjah", city: "Sharjah" },
            },
        },
    });
    await prisma.user.upsert({
        where: { email: "admin@arabianplates.ae" },
        update: {},
        create: {
            fullName: "Platform Admin",
            email: "admin@arabianplates.ae",
            passwordHash,
            role: "admin",
            isEmailVerified: true,
            adminProfile: {
                create: { permissions: ["all"] },
            },
        },
    });
    return {
        owner: owner.id,
        broker: broker.id,
        dealer: dealer.id,
    };
}
async function main() {
    const datasetPath = node_path_1.default.resolve(__dirname, "../../uae_number_plates_500.json");
    const raw = await promises_1.default.readFile(datasetPath, "utf-8");
    const items = JSON.parse(raw);
    const users = await ensureSeedUsers();
    let inserted = 0;
    for (const item of items) {
        const sellerType = item.sellerType;
        const plateType = item.plateType;
        const status = normalizeStatus(item.status);
        const userId = sellerType === "owner" ? users.owner : sellerType === "broker" ? users.broker : users.dealer;
        const existing = await prisma.numberPlateListing.findUnique({ where: { listingId: item.listingId } });
        if (existing) {
            continue;
        }
        await prisma.numberPlateListing.create({
            data: {
                listingId: item.listingId,
                emirate: item.emirate,
                city: item.city,
                plateCode: item.plateCode,
                plateNumber: item.plateNumber,
                formattedPlate: item.formattedPlate,
                digitCount: item.digitCount,
                priceAED: item.priceAED,
                negotiable: item.negotiable,
                featured: item.featured,
                verified: item.verified,
                sellerType,
                plateType,
                status,
                views: item.views,
                favorites: item.favorites,
                inquiriesCount: item.inquiries,
                description: `${item.formattedPlate} marketplace listing`,
                ownershipStatus: "owned",
                approvalStatus: status === "active" ? "approved" : "pending",
                isPublished: status === "active",
                createdAt: new Date(item.createdAt),
                slug: createSlug(item),
                userId,
            },
        });
        inserted += 1;
    }
    console.log(`Seeding complete. Inserted ${inserted} new listings from ${items.length} records.`);
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
