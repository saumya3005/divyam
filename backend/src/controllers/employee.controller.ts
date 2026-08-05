import { Request, Response, NextFunction } from "express";
import { Employee } from "../models/Employee";
import { AppError } from "../utils/AppError";

// GET all employees
export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, status, department } = req.query;
    const filter: any = { isDeleted: { $ne: true } };

    if (status) filter.status = status;
    if (department) filter.department = department;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search as string, $options: "i" } },
        { lastName: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
        { phone: { $regex: search as string, $options: "i" } },
        { role: { $regex: search as string, $options: "i" } },
      ];
    }

    const employees = await Employee.find(filter).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: employees.length,
      data: { employees },
    });
  } catch (error) {
    next(error);
  }
};

// GET single employee
export const getEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!employee) {
      return next(new AppError("Employee not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { employee },
    });
  } catch (error) {
    next(error);
  }
};

// CREATE employee
export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      data: { employee },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE employee
export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return next(new AppError("Employee not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { employee },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE (Soft delete) employee
export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, { isDeleted: true });

    if (!employee) {
      return next(new AppError("Employee not found", 404));
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
