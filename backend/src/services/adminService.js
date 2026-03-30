import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { readCollection } from "./dataStoreService.js";
import { AppError } from "../utils/AppError.js";

const verifyPassword = async (password) => {
  if (env.adminPasswordHash) {
    return bcrypt.compare(password, env.adminPasswordHash);
  }

  return password === env.adminPassword;
};

export const loginAdmin = async ({ email, password }) => {
  if (String(email).trim().toLowerCase() !== env.adminEmail.toLowerCase()) {
    throw new AppError("Invalid credentials.", 401);
  }

  const isValidPassword = await verifyPassword(password);

  if (!isValidPassword) {
    throw new AppError("Invalid credentials.", 401);
  }

  const token = jwt.sign(
    {
      sub: env.adminEmail,
      email: env.adminEmail,
      role: "admin",
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return {
    token,
    user: {
      email: env.adminEmail,
      role: "admin",
    },
  };
};

export const getDashboardSummary = async () => {
  const [contacts, applications, jobs] = await Promise.all([
    readCollection("contacts"),
    readCollection("applications"),
    readCollection("jobs"),
  ]);

  return {
    selectedCandidates: applications.filter((record) => record.status === "selected").length,
    unreadMessages: contacts.filter((record) => record.status !== "Read").length,
    openPositions: jobs.filter((record) => String(record.status).toLowerCase() === "open").length,
    pendingApplications: applications.filter((record) => record.status === "pending").length,
  };
};
