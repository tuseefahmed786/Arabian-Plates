import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/api-response";
import * as service from "./contact.service";

export const createContactSubmission = asyncHandler(async (req: Request, res: Response) => {
  const row = await service.createContactSubmission(req.body);

  res.status(201).json(
    successResponse("Contact request submitted", {
      id: row.id,
      createdAt: row.createdAt,
    }),
  );
});
