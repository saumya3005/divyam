import { Request, Response, NextFunction } from "express";
import { Booking } from "../models/Booking";
import { AppError } from "../utils/AppError";

// Create a new booking
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Inject userId from protected route middleware
    const bookingData = {
      ...req.body,
      userId: req.user?._id,
    };

    const booking = await Booking.create(bookingData);

    res.status(201).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

// Get user bookings
export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await Booking.find({ userId: req.user?._id }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings (Admin)
export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await Booking.find().populate("userId", "firstName lastName email").sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

// Get single booking
export const getBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError("No booking found with that ID", 404));
    }

    // Security check: Only admin or the booking owner can view it
    if (req.user?.role !== "admin" && booking.userId.toString() !== req.user?._id.toString()) {
      return next(new AppError("You do not have permission to view this booking", 403));
    }

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status (Admin)
export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { bookingStatus },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return next(new AppError("No booking found with that ID", 404));
    }

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

// Delete booking (Admin)
export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return next(new AppError("No booking found with that ID", 404));
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Get booking stats (Admin)
export const getBookingStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ bookingStatus: "Pending" });
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: "Confirmed" });
    const completedBookings = await Booking.countDocuments({ bookingStatus: "Completed" });
    
    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: "Payment Successful" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    const customersAgg = await Booking.aggregate([
      { $group: { _id: "$userId" } },
      { $count: "totalCustomers" }
    ]);
    const totalCustomers = customersAgg.length > 0 ? customersAgg[0].totalCustomers : 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          totalRevenue,
          totalCustomers
        }
      },
    });
  } catch (error) {
    next(error);
  }
};
