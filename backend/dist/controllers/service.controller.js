"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.getService = exports.getAllServices = void 0;
const Service_1 = require("../models/Service");
const AppError_1 = require("../utils/AppError");
// GET all services (Public)
const getAllServices = async (req, res, next) => {
    try {
        const { category, available, search } = req.query;
        const filter = { isDeleted: { $ne: true } };
        if (category)
            filter.category = category;
        if (available !== undefined)
            filter.availability = available === "true";
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }
        const services = await Service_1.Service.find(filter).sort("-createdAt");
        res.status(200).json({
            success: true,
            count: services.length,
            data: { services },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllServices = getAllServices;
// GET single service (Public)
const getService = async (req, res, next) => {
    try {
        const service = await Service_1.Service.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
        if (!service) {
            return next(new AppError_1.AppError("Service not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { service },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getService = getService;
// CREATE service (Admin only)
const createService = async (req, res, next) => {
    try {
        const service = await Service_1.Service.create(req.body);
        res.status(201).json({
            success: true,
            data: { service },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createService = createService;
// UPDATE service (Admin only)
const updateService = async (req, res, next) => {
    try {
        const service = await Service_1.Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!service) {
            return next(new AppError_1.AppError("Service not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { service },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateService = updateService;
// DELETE service (Admin only)
const deleteService = async (req, res, next) => {
    try {
        const service = await Service_1.Service.findByIdAndUpdate(req.params.id, { isDeleted: true });
        if (!service) {
            return next(new AppError_1.AppError("Service not found", 404));
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
exports.deleteService = deleteService;
