"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
const AppError_1 = require("../utils/AppError");
/**
 * Role-based access control middleware.
 * Must be used AFTER the `protect` middleware.
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user is populated by the protect middleware
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError_1.AppError("You do not have permission to perform this action", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
