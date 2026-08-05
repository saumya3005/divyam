"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEvent = exports.getAllEvents = exports.getPublishedEvents = void 0;
const Event_1 = require("../models/Event");
const AppError_1 = require("../utils/AppError");
// Get all published events (Public/Customer)
const getPublishedEvents = async (req, res, next) => {
    try {
        const events = await Event_1.Event.find({ status: "published", isDeleted: { $ne: true } }).sort("-createdAt");
        res.status(200).json({ success: true, count: events.length, data: { events } });
    }
    catch (error) {
        next(error);
    }
};
exports.getPublishedEvents = getPublishedEvents;
// Get all events (Admin)
const getAllEvents = async (req, res, next) => {
    try {
        const { search, status, eventType } = req.query;
        const filter = { isDeleted: { $ne: true } };
        if (status)
            filter.status = status;
        if (eventType)
            filter.eventType = eventType;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        const events = await Event_1.Event.find(filter).sort("-createdAt");
        res.status(200).json({ success: true, count: events.length, data: { events } });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllEvents = getAllEvents;
// Get single event
const getEvent = async (req, res, next) => {
    try {
        const event = await Event_1.Event.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
        if (!event)
            return next(new AppError_1.AppError("Event not found", 404));
        if (event.status !== "published" && req.user?.role !== "admin") {
            return next(new AppError_1.AppError("This event is not available", 403));
        }
        res.status(200).json({ success: true, data: { event } });
    }
    catch (error) {
        next(error);
    }
};
exports.getEvent = getEvent;
// Create Event (Admin)
const createEvent = async (req, res, next) => {
    try {
        const event = await Event_1.Event.create(req.body);
        res.status(201).json({ success: true, data: { event } });
    }
    catch (error) {
        next(error);
    }
};
exports.createEvent = createEvent;
// Update Event (Admin)
const updateEvent = async (req, res, next) => {
    try {
        const event = await Event_1.Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!event)
            return next(new AppError_1.AppError("Event not found", 404));
        res.status(200).json({ success: true, data: { event } });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEvent = updateEvent;
// Delete Event (Admin)
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event_1.Event.findByIdAndUpdate(req.params.id, { isDeleted: true });
        if (!event)
            return next(new AppError_1.AppError("Event not found", 404));
        res.status(204).json({ success: true, data: null });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEvent = deleteEvent;
