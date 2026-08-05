"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.getEmployee = exports.getAllEmployees = void 0;
const Employee_1 = require("../models/Employee");
const AppError_1 = require("../utils/AppError");
// GET all employees
const getAllEmployees = async (req, res, next) => {
    try {
        const { search, status, department } = req.query;
        const filter = { isDeleted: { $ne: true } };
        if (status)
            filter.status = status;
        if (department)
            filter.department = department;
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } },
            ];
        }
        const employees = await Employee_1.Employee.find(filter).sort("-createdAt");
        res.status(200).json({
            success: true,
            count: employees.length,
            data: { employees },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllEmployees = getAllEmployees;
// GET single employee
const getEmployee = async (req, res, next) => {
    try {
        const employee = await Employee_1.Employee.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
        if (!employee) {
            return next(new AppError_1.AppError("Employee not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { employee },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getEmployee = getEmployee;
// CREATE employee
const createEmployee = async (req, res, next) => {
    try {
        const employee = await Employee_1.Employee.create(req.body);
        res.status(201).json({
            success: true,
            data: { employee },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createEmployee = createEmployee;
// UPDATE employee
const updateEmployee = async (req, res, next) => {
    try {
        const employee = await Employee_1.Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!employee) {
            return next(new AppError_1.AppError("Employee not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { employee },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEmployee = updateEmployee;
// DELETE (Soft delete) employee
const deleteEmployee = async (req, res, next) => {
    try {
        const employee = await Employee_1.Employee.findByIdAndUpdate(req.params.id, { isDeleted: true });
        if (!employee) {
            return next(new AppError_1.AppError("Employee not found", 404));
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
exports.deleteEmployee = deleteEmployee;
