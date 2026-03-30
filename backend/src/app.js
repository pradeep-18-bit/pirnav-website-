import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import adminRoutes from "./routes/adminRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";

const createCorsMiddleware = () =>
  cors({
    origin: (origin, callback) => {
      if (!origin || env.allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS."));
    },
  });

export const app = express();

app.use(helmet());
app.use(createCorsMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Backend is healthy.",
  });
});

app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/job-applications", applicationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/interview", interviewRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export const startServer = () => {
  app.listen(env.port, () => {
    console.log(`[backend] API server listening on http://localhost:${env.port}`);
  });
};
