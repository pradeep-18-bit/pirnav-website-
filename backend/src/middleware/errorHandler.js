export const errorHandler = (error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong.";

  if (statusCode >= 500) {
    console.error("[backend] Unhandled error:", error);
  }

  response.status(statusCode).json({
    success: false,
    message,
    errors: error.details || undefined,
  });
};
