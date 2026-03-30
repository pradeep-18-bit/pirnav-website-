export const sendSuccess = (response, { statusCode = 200, message = "OK", data = null }) =>
  response.status(statusCode).json({
    success: true,
    message,
    data,
  });
