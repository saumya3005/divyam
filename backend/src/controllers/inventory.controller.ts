import { Request, Response, NextFunction } from "express";
import { Inventory } from "../models/Inventory";
import { AppError } from "../utils/AppError";

// GET all inventory items
export const getAllInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, category, status } = req.query;
    const filter: any = { isDeleted: { $ne: true } };

    if (category) filter.category = category;
    if (status) filter.maintenanceStatus = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { category: { $regex: search as string, $options: "i" } },
      ];
    }

    const items = await Inventory.find(filter).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: items.length,
      data: { items },
    });
  } catch (error) {
    next(error);
  }
};

// GET single inventory item
export const getInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Inventory.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!item) {
      return next(new AppError("Inventory item not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { item },
    });
  } catch (error) {
    next(error);
  }
};

// CREATE inventory item
export const createInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // By default availableQuantity should equal quantity upon creation if not provided
    if (req.body.quantity && req.body.availableQuantity === undefined) {
      req.body.availableQuantity = req.body.quantity;
    }
    
    const item = await Inventory.create(req.body);

    res.status(201).json({
      success: true,
      data: { item },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE inventory item
export const updateInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return next(new AppError("Inventory item not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { item },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE (Soft delete) inventory item
export const deleteInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, { isDeleted: true });

    if (!item) {
      return next(new AppError("Inventory item not found", 404));
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
