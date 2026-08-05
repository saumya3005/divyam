"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyToQuery = exports.getAllQueries = exports.getMyQueries = exports.createQuery = void 0;
const Query_1 = require("../models/Query");
const AppError_1 = require("../utils/AppError");
// Customer creates a new query
const createQuery = async (req, res, next) => {
    try {
        const query = await Query_1.Query.create({
            userId: req.user?._id,
            subject: req.body.subject,
            message: req.body.message,
        });
        res.status(201).json({
            success: true,
            data: { query },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createQuery = createQuery;
// Customer views their own queries
const getMyQueries = async (req, res, next) => {
    try {
        const queries = await Query_1.Query.find({ userId: req.user?._id }).sort("-createdAt");
        res.status(200).json({
            success: true,
            count: queries.length,
            data: { queries },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyQueries = getMyQueries;
// Admin views all queries
const getAllQueries = async (req, res, next) => {
    try {
        const queries = await Query_1.Query.find().populate("userId", "firstName lastName email").sort("-createdAt");
        res.status(200).json({
            success: true,
            count: queries.length,
            data: { queries },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllQueries = getAllQueries;
// Admin replies to a query
const replyToQuery = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { adminReply } = req.body;
        const query = await Query_1.Query.findByIdAndUpdate(id, { adminReply, status: "Resolved" }, { new: true, runValidators: true });
        if (!query) {
            return next(new AppError_1.AppError("No query found with that ID", 404));
        }
        res.status(200).json({
            success: true,
            data: { query },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.replyToQuery = replyToQuery;
