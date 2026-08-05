import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { verifyToken, JwtPayload } from "../services/jwt.service";
import { User, IUser } from "../models/User";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in! Please log in to get access.", 401));
    }

    // 1) Verify token
    const decoded = verifyToken(token) as JwtPayload;

    // 2) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("The user belonging to this token does no longer exist.", 401));
    }

    // 3) Check if user is active
    if (!currentUser.isActive) {
      return next(new AppError("Your account has been deactivated.", 403));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
