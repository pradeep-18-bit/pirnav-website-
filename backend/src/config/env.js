import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const backendRoot = process.cwd();
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:5000",
].join(",");

const readOrigins = () =>
  String(process.env.FRONTEND_ORIGIN || defaultOrigins)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const env = {
  backendRoot,
  port: Number.parseInt(process.env.PORT || "5001", 10),
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  adminEmail: process.env.ADMIN_EMAIL || "admin@pirnav.com",
  adminPassword: process.env.ADMIN_PASSWORD || "PirnavAdmin@123",
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || "",
  emailFrom: process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@pirnav.com",
  email: {
    host: process.env.EMAIL_HOST || "",
    port: Number.parseInt(process.env.EMAIL_PORT || "587", 10),
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
    secure:
      process.env.EMAIL_SECURE === "true" ||
      Number.parseInt(process.env.EMAIL_PORT || "587", 10) === 465,
  },
  allowedOrigins: readOrigins(),
  dataDir: path.join(backendRoot, "src", "data"),
  resumesDir: path.join(backendRoot, "storage", "resumes"),
  maxResumeSizeInBytes: 5 * 1024 * 1024,
};
