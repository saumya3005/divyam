"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInventory = exports.updateInventory = exports.createInventory = exports.getInventory = exports.getAllInventory = void 0;
const Inventory_1 = require("../models/Inventory");
const AppError_1 = require("../utils/AppError");
// GET all inventory items
const getAllInventory = async (req, res, next) => {
    try {
        const { search, category, status } = req.query;
        const filter = { isDeleted: { $ne: true } };
        if (category)
            filter.category = category;
        if (status)
            filter.maintenanceStatus = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }
        const items = await Inventory_1.Inventory.find(filter).sort("-createdAt");
        res.status(200).json({
            success: true,
            count: items.length,
            data: { items },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllInventory = getAllInventory;
// GET single inventory item
const getInventory = async (req, res, next) => {
    try {
        const item = await Inventory_1.Inventory.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
        if (!item) {
            return next(new AppError_1.AppError("Inventory item not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { item },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getInventory = getInventory;
// CREATE inventory item
const createInventory = async (req, res, next) => {
    try {
        // By default availableQuantity should equal quantity upon creation if not provided
        if (req.body.quantity && req.body.availableQuantity === undefined) {
            req.body.availableQuantity = req.body.quantity;
        }
        const item = await Inventory_1.Inventory.create(req.body);
        res.status(201).json({
            success: true,
            data: { item },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createInventory = createInventory;
// UPDATE inventory item
const updateInventory = async (req, res, next) => {
    try {
        const item = await Inventory_1.Inventory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item) {
            return next(new AppError_1.AppError("Inventory item not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { item },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateInventory = updateInventory;
// DELETE (Soft delete) inventory item
const deleteInventory = async (req, res, next) => {
    try {
        const item = await Inventory_1.Inventory.findByIdAndUpdate(req.params.id, { isDeleted: true });
        if (!item) {
            return next(new AppError_1.AppError("Inventory item not found", 404));
        }
        res.status(204).json({
            success: true,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteInventory = deleteInventory;
