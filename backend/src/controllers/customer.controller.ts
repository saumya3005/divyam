import { Request, Response, NextFunction } from "express";
import { Customer } from "../models/Customer";
import { AppError } from "../utils/AppError";

// GET all customers (Admin)
export const getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, status } = req.query;
    const filter: any = { isDeleted: { $ne: true } };
    
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { companyName: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
        { phone: { $regex: search as string, $options: "i" } },
      ];
    }

    const customers = await Customer.find(filter).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: customers.length,
      data: { customers },
    });
  } catch (error) {
    next(error);
  }
};

// GET single customer
export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!customer) {
      return next(new AppError("Customer not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

// CREATE customer
export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE customer
export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return next(new AppError("Customer not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE (Soft delete) customer
export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, { isDeleted: true });

    if (!customer) {
      return next(new AppError("Customer not found", 404));
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
