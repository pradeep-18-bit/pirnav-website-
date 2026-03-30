import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

const toErrorMap = (zodError) =>
  zodError.issues.reduce((errors, issue) => {
    const path = issue.path.join(".") || "root";
    errors[path] = issue.message;
    return errors;
  }, {});

const buildValidationMiddleware =
  (schema, key) =>
  (request, _response, next) => {
    try {
      request[key] = schema.parse(request[key]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError("Validation failed.", 400, toErrorMap(error)));
        return;
      }

      next(error);
    }
  };

export const validateBody = (schema) => buildValidationMiddleware(schema, "body");
export const validateParams = (schema) => buildValidationMiddleware(schema, "params");
