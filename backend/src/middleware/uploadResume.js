import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

fs.mkdirSync(env.resumesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, env.resumesDir);
  },
  filename: (_request, file, callback) => {
    const safeExtension = path.extname(file.originalname).toLowerCase() || ".pdf";
    callback(null, `${Date.now()}-${crypto.randomUUID()}${safeExtension}`);
  },
});

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: env.maxResumeSizeInBytes,
  },
  fileFilter: (_request, file, callback) => {
    if (allowedMimeTypes.has(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new AppError("Only PDF, DOC, and DOCX resumes are allowed.", 400));
  },
});
