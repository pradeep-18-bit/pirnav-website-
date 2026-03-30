import { Router } from "express";
import {
  changeApplicationStatus,
  createApplication,
  downloadApplicationResume,
  getApplications,
} from "../controllers/applicationController.js";
import { authenticateAdmin } from "../middleware/authenticate.js";
import { uploadResume } from "../middleware/uploadResume.js";
import { validateParams } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { routeIdSchema } from "../utils/schemas.js";

const router = Router();

router.post("/", uploadResume.single("Resume"), asyncHandler(createApplication));
router.get("/", authenticateAdmin, asyncHandler(getApplications));
router.put(
  "/:id/status",
  authenticateAdmin,
  validateParams(routeIdSchema),
  asyncHandler(changeApplicationStatus)
);
router.get(
  "/download/:id",
  authenticateAdmin,
  validateParams(routeIdSchema),
  asyncHandler(downloadApplicationResume)
);

export default router;
