import { Router } from "express";
import {
  deleteMessage,
  getMessage,
  getMessages,
  markAsRead,
  submitMessage,
  unreadCount,
} from "../controllers/contactController.js";
import { authenticateAdmin } from "../middleware/authenticate.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { contactMessageSchema, routeIdSchema } from "../utils/schemas.js";

const router = Router();

router.post("/", validateBody(contactMessageSchema), asyncHandler(submitMessage));
router.get("/", authenticateAdmin, asyncHandler(getMessages));
router.get("/unread-count", authenticateAdmin, asyncHandler(unreadCount));
router.get("/:id", authenticateAdmin, validateParams(routeIdSchema), asyncHandler(getMessage));
router.put(
  "/mark-read/:id",
  authenticateAdmin,
  validateParams(routeIdSchema),
  asyncHandler(markAsRead)
);
router.delete(
  "/:id",
  authenticateAdmin,
  validateParams(routeIdSchema),
  asyncHandler(deleteMessage)
);

export default router;
