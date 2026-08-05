"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomer = exports.getAllCustomers = void 0;
const Customer_1 = require("../models/Customer");
const AppError_1 = require("../utils/AppError");
// GET all customers (Admin)
const getAllCustomers = async (req, res, next) => {
    try {
        const { search, status } = req.query;
        const filter = { isDeleted: { $ne: true } };
        if (status)
            filter.status = status;
        if (search) {
            filter.$or = [
                { companyName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }
        const customers = await Customer_1.Customer.find(filter).sort("-createdAt");
        res.status(200).json({
            success: true,
            count: customers.length,
            data: { customers },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCustomers = getAllCustomers;
// GET single customer
const getCustomer = async (req, res, next) => {
    try {
        const customer = await Customer_1.Customer.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
        if (!customer) {
            return next(new AppError_1.AppError("Customer not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { customer },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomer = getCustomer;
// CREATE customer
const createCustomer = async (req, res, next) => {
    try {
        const customer = await Customer_1.Customer.create(req.body);
        res.status(201).json({
            success: true,
            data: { customer },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createCustomer = createCustomer;
// UPDATE customer
const updateCustomer = async (req, res, next) => {
    try {
        const customer = await Customer_1.Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!customer) {
            return next(new AppError_1.AppError("Customer not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { customer },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCustomer = updateCustomer;
// DELETE (Soft delete) customer
const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer_1.Customer.findByIdAndUpdate(req.params.id, { isDeleted: true });
        if (!customer) {
            return next(new AppError_1.AppError("Customer not found", 404));
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
exports.deleteCustomer = deleteCustomer;
