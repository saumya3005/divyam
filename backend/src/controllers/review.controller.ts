import { Request, Response, NextFunction } from "express";
import { Review } from "../models/Review";
import { AppError } from "../utils/AppError";

export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search } = req.query;
    const filter: any = { isDeleted: { $ne: true } };

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
      ];
    }

    const reviews = await Review.find(filter)
      .populate("serviceId", "title category")
      .populate("userId", "firstName lastName email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: { reviews },
    });
  } catch (error) {
    next(error);
  }
};

export const getReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

    if (!review) {
      return next(new AppError("No review found with that ID", 404));
    }

    res.status(200).json({
      success: true,
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({
      success: true,
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      req.body,
      { new: true, runValidators: true }
    );

    if (!review) {
      return next(new AppError("No review found with that ID", 404));
    }

    res.status(200).json({
      success: true,
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { isDeleted: true },
      { new: true }
    );

    if (!review) {
      return next(new AppError("No review found with that ID", 404));
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
