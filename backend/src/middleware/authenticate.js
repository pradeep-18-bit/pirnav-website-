import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const authenticateAdmin = (request, _response, next) => {
  const authorization = request.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    request.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    next(new AppError("Unauthorized", 401));
  }
};
