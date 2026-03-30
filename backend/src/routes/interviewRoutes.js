import { Router } from "express";
import { getInterviews, updateInterviewRecord } from "../controllers/interviewController.js";
import { authenticateAdmin } from "../middleware/authenticate.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { interviewUpdateSchema, routeIdSchema } from "../utils/schemas.js";

const router = Router();

router.get("/", authenticateAdmin, asyncHandler(getInterviews));
router.put(
  "/:id",
  authenticateAdmin,
  validateParams(routeIdSchema),
  validateBody(interviewUpdateSchema),
  asyncHandler(updateInterviewRecord)
);

export default router;
