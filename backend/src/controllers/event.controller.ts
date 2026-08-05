import { Request, Response, NextFunction } from "express";
import { Event } from "../models/Event";
import { AppError } from "../utils/AppError";

// Get all published events (Public/Customer)
export const getPublishedEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await Event.find({ status: "published", isDeleted: { $ne: true } }).sort("-createdAt");
    res.status(200).json({ success: true, count: events.length, data: { events } });
  } catch (error) {
    next(error);
  }
};

// Get all events (Admin)
export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, status, eventType } = req.query;
    const filter: any = { isDeleted: { $ne: true } };

    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType;
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: "i" } },
        { description: { $regex: search as string, $options: "i" } },
      ];
    }

    const events = await Event.find(filter).sort("-createdAt");
    res.status(200).json({ success: true, count: events.length, data: { events } });
  } catch (error) {
    next(error);
  }
};

// Get single event
export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!event) return next(new AppError("Event not found", 404));

    if (event.status !== "published" && req.user?.role !== "admin") {
      return next(new AppError("This event is not available", 403));
    }

    res.status(200).json({ success: true, data: { event } });
  } catch (error) {
    next(error);
  }
};

// Create Event (Admin)
export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: { event } });
  } catch (error) {
    next(error);
  }
};

// Update Event (Admin)
export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return next(new AppError("Event not found", 404));
    res.status(200).json({ success: true, data: { event } });
  } catch (error) {
    next(error);
  }
};

// Delete Event (Admin)
export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!event) return next(new AppError("Event not found", 404));
    res.status(204).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};

