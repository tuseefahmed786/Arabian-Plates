"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactSubmission = createContactSubmission;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../database/prisma");
const departmentMap = {
    sales: client_1.ContactDepartment.sales,
    "buyer-support": client_1.ContactDepartment.buyer_support,
    "seller-operations": client_1.ContactDepartment.seller_operations,
};
async function createContactSubmission(payload) {
    return prisma_1.prisma.contactSubmission.create({
        data: {
            fullName: payload.fullName,
            email: payload.email,
            department: departmentMap[payload.department],
            subject: payload.subject,
            message: payload.message,
        },
    });
}
