import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { generateToken } from "../services/jwt.service";
import { hashPassword, comparePasswords } from "../services/hash.service";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already in use", 400));
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");
    
    if (!user || !(await comparePasswords(password, user.password as string))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // Generate token
    const token = generateToken(user._id, user.role);
    
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
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is set in protect middleware
    const user = req.user;
    
    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
