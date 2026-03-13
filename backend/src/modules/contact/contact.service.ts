import { ContactDepartment } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { CreateContactSubmissionBody } from "./contact.schema";

const departmentMap: Record<CreateContactSubmissionBody["department"], ContactDepartment> = {
  sales: ContactDepartment.sales,
  "buyer-support": ContactDepartment.buyer_support,
  "seller-operations": ContactDepartment.seller_operations,
};

export async function createContactSubmission(payload: CreateContactSubmissionBody) {
  return prisma.contactSubmission.create({
    data: {
      fullName: payload.fullName,
      email: payload.email,
      department: departmentMap[payload.department],
      subject: payload.subject,
      message: payload.message,
    },
  });
}
