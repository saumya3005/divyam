"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const errorHandler = (err, req, res, next) => {
    console.error("🔥 ERROR DETAILS:");
    console.error(err);
    console.error("MESSAGE:", err.message);
    console.error("STACK:", err.stack);
    let error = { ...err };
    error.message = err.message;
    if (err.name === "CastError") {
        error = new AppError_1.AppError("Resource not found", 404);
    }
    if (err.code === 11000) {
        error = new AppError_1.AppError("Duplicate field value entered", 400);
    }
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        error = new AppError_1.AppError(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        error = new AppError_1.AppError("Invalid token", 401);
    }
    if (err.name === "TokenExpiredError") {
        error = new AppError_1.AppError("Token expired", 401);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
        stack: err.stack
    });
};
exports.errorHandler = errorHandler;
