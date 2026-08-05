import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

/**
 * Role-based access control middleware.
 * Must be used AFTER the `protect` middleware.
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user is populated by the protect middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
