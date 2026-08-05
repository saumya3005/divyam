"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.createReview = exports.getReview = exports.getAllReviews = void 0;
const Review_1 = require("../models/Review");
const AppError_1 = require("../utils/AppError");
const getAllReviews = async (req, res, next) => {
    try {
        const { status, search } = req.query;
        const filter = { isDeleted: { $ne: true } };
        if (status)
            filter.status = status;
        if (search) {
            filter.$or = [
                { customerName: { $regex: search, $options: "i" } },
                { comment: { $regex: search, $options: "i" } },
            ];
        }
        const reviews = await Review_1.Review.find(filter)
            .populate("serviceId", "title category")
            .populate("userId", "firstName lastName email")
            .sort("-createdAt");
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: { reviews },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllReviews = getAllReviews;
const getReview = async (req, res, next) => {
    try {
        const review = await Review_1.Review.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
        if (!review) {
            return next(new AppError_1.AppError("No review found with that ID", 404));
        }
        res.status(200).json({
            success: true,
            data: { review },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getReview = getReview;
const createReview = async (req, res, next) => {
    try {
        const review = await Review_1.Review.create(req.body);
        res.status(201).json({
            success: true,
            data: { review },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createReview = createReview;
const updateReview = async (req, res, next) => {
    try {
        const review = await Review_1.Review.findOneAndUpdate({ _id: req.params.id, isDeleted: { $ne: true } }, req.body, { new: true, runValidators: true });
        if (!review) {
            return next(new AppError_1.AppError("No review found with that ID", 404));
        }
        res.status(200).json({
            success: true,
            data: { review },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateReview = updateReview;
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review_1.Review.findOneAndUpdate({ _id: req.params.id, isDeleted: { $ne: true } }, { isDeleted: true }, { new: true });
        if (!review) {
            return next(new AppError_1.AppError("No review found with that ID", 404));
        }
        res.status(204).json({
            success: true,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteReview = deleteReview;
