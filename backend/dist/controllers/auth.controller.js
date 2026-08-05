"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const AppError_1 = require("../utils/AppError");
const jwt_service_1 = require("../services/jwt.service");
const hash_service_1 = require("../services/hash.service");
const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Check if user exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return next(new AppError_1.AppError("Email already in use", 400));
        }
        // Hash password
        const hashedPassword = await (0, hash_service_1.hashPassword)(password);
        // Create user
        const user = await User_1.User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        // Generate token
        const token = (0, jwt_service_1.generateToken)(user._id, user.role);
        // Remove password from response
        user.password = undefined;
        res.status(201).json({
            success: true,
            token,
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        // Check if email and password exist
        if (!email || !password) {
            return next(new AppError_1.AppError("Please provide email and password", 400));
        }
        // Check if user exists && password is correct
        const user = await User_1.User.findOne({ email }).select("+password");
        if (!user || !(await (0, hash_service_1.comparePasswords)(password, user.password))) {
            return next(new AppError_1.AppError("Incorrect email or password", 401));
        }
        // Check admin gate
        if (role === "admin" && user.role !== "admin") {
            return next(new AppError_1.AppError("Unauthorized Access: Admin privileges required", 403));
        }
        // Generate token
        const token = (0, jwt_service_1.generateToken)(user._id, user.role);
        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
        // Remove password from output
        user.password = undefined;
        res.status(200).json({
            success: true,
            token,
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        // req.user is set in protect middleware
        const user = req.user;
        res.status(200).json({
            success: true,
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
