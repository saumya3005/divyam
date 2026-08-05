import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.error("🔥 ERROR DETAILS:");
  console.error(err);

  console.error("MESSAGE:", err.message);
  console.error("STACK:", err.stack);

  let error = { ...err };
  error.message = err.message;


  if (err.name === "CastError") {
    error = new AppError("Resource not found", 404);
  }


  if (err.code === 11000) {
    error = new AppError("Duplicate field value entered", 400);
  }


  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");

    error = new AppError(message, 400);
  }


  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token", 401);
  }


  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired", 401);
  }


  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    stack: err.stack
  });
};