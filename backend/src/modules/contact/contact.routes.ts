import { Router } from "express";
import { validateRequest } from "../../common/middleware/validate-request";
import { createContactSubmissionSchema } from "./contact.schema";
import * as controller from "./contact.controller";

const router = Router();

router.post("/", validateRequest(createContactSubmissionSchema), controller.createContactSubmission);

export default router;
