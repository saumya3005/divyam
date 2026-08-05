import { Request, Response, NextFunction } from "express";
import { Booking } from "../models/Booking";
import { AppError } from "../utils/AppError";

// Get all bookings (can be filtered by status, customer, etc.)
export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, eventId } = req.query;
    
    let filter: any = {};
    if (status) filter.status = status;
    if (eventId) filter.event = eventId;
    
    // For clients, only show their bookings
    if (req.user?.role === "client") {
      // In a real app we'd map req.user._id to Customer documents
      // Assuming for now req.user._id matches the customer contactPerson
      // filter.customer = req.user._id; 
    }

    const bookings = await Booking.find(filter)
      .populate("customer", "companyName email")
      .populate("event", "title eventType")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: {
        bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new booking
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.create(req.body);

    // In a real application, trigger a Notification here
    
    res.status(201).json({
      success: true,
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status
export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status, paymentStatus },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return next(new AppError("No booking found with that ID", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};
