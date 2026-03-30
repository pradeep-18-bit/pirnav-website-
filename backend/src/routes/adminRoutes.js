import { Router } from "express";
import {
  dashboardSummary,
  login,
  recentApplications,
  recentMessages,
  scheduleCandidateInterview,
  shortlistCandidate,
} from "../controllers/adminController.js";
import { authenticateAdmin } from "../middleware/authenticate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateBody } from "../middleware/validate.js";
import {
  adminLoginSchema,
  scheduleInterviewSchema,
  shortlistCandidateSchema,
} from "../utils/schemas.js";

const router = Router();

router.post("/login", validateBody(adminLoginSchema), asyncHandler(login));
router.get("/dashboard-summary", authenticateAdmin, asyncHandler(dashboardSummary));
router.get("/recent-messages", authenticateAdmin, asyncHandler(recentMessages));
router.get("/recent-applications", authenticateAdmin, asyncHandler(recentApplications));
router.post(
  "/shortlist",
  authenticateAdmin,
  validateBody(shortlistCandidateSchema),
  asyncHandler(shortlistCandidate)
);
router.post(
  "/schedule-interview",
  authenticateAdmin,
  validateBody(scheduleInterviewSchema),
  asyncHandler(scheduleCandidateInterview)
);

export default router;
