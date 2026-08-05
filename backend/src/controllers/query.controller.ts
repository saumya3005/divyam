import { Request, Response, NextFunction } from "express";
import { Query } from "../models/Query";
import { AppError } from "../utils/AppError";

// Customer creates a new query
export const createQuery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = await Query.create({
      userId: req.user?._id,
      subject: req.body.subject,
      message: req.body.message,
    });

    res.status(201).json({
      success: true,
      data: { query },
    });
  } catch (error) {
    next(error);
  }
};

// Customer views their own queries
export const getMyQueries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries = await Query.find({ userId: req.user?._id }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: queries.length,
      data: { queries },
    });
  } catch (error) {
    next(error);
  }
};

// Admin views all queries
export const getAllQueries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries = await Query.find().populate("userId", "firstName lastName email").sort("-createdAt");

    res.status(200).json({
      success: true,
      count: queries.length,
      data: { queries },
    });
  } catch (error) {
    next(error);
  }
};

// Admin replies to a query
export const replyToQuery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;

    const query = await Query.findByIdAndUpdate(
      id,
      { adminReply, status: "Resolved" },
      { new: true, runValidators: true }
    );

    if (!query) {
      return next(new AppError("No query found with that ID", 404));
    }

    res.status(200).json({
      success: true,
      data: { query },
    });
  } catch (error) {
    next(error);
  }
};
