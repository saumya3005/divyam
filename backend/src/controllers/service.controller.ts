import { Request, Response, NextFunction } from "express";
import { Service } from "../models/Service";
import { AppError } from "../utils/AppError";

// GET all services (Public)
export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, available } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (available !== undefined) filter.availability = available === "true";

    const services = await Service.find(filter).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: services.length,
      data: { services },
    });
  } catch (error) {
    next(error);
  }
};

// GET single service (Public)
export const getService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(new AppError("Service not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

// CREATE service (Admin only)
export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE service (Admin only)
export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return next(new AppError("Service not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE service (Admin only)
export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return next(new AppError("Service not found", 404));
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
