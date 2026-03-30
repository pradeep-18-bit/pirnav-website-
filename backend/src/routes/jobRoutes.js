import { Router } from "express";
import {
  createJobRecord,
  deleteJobRecord,
  getAdminJobs,
  getPublicJob,
  getPublicJobs,
  updateJobRecord,
} from "../controllers/jobController.js";
import { authenticateAdmin } from "../middleware/authenticate.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { jobSchema, routeIdSchema } from "../utils/schemas.js";

const router = Router();

router.get("/public", asyncHandler(getPublicJobs));
router.get("/public/:id", validateParams(routeIdSchema), asyncHandler(getPublicJob));

router.get("/", authenticateAdmin, asyncHandler(getAdminJobs));
router.post("/", authenticateAdmin, validateBody(jobSchema), asyncHandler(createJobRecord));
router.put(
  "/:id",
  authenticateAdmin,
  validateParams(routeIdSchema),
  validateBody(jobSchema),
  asyncHandler(updateJobRecord)
);
router.delete(
  "/:id",
  authenticateAdmin,
  validateParams(routeIdSchema),
  asyncHandler(deleteJobRecord)
);

export default router;
