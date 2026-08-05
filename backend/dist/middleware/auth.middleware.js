"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const AppError_1 = require("../utils/AppError");
const jwt_service_1 = require("../services/jwt.service");
const User_1 = require("../models/User");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(new AppError_1.AppError("You are not logged in! Please log in to get access.", 401));
        }
        // 1) Verify token
        const decoded = (0, jwt_service_1.verifyToken)(token);
        // 2) Check if user still exists
        const currentUser = await User_1.User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError_1.AppError("The user belonging to this token does no longer exist.", 401));
        }
        // 3) Check if user is active
        if (!currentUser.isActive) {
            return next(new AppError_1.AppError("Your account has been deactivated.", 403));
        }
        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
