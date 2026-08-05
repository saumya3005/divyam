import { Request, Response, NextFunction } from "express";
import { Booking } from "../models/Booking";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";

// Create a new booking
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId, eventId, bookingDate, bookingTime, guests } = req.body;

    // 1. Service Conflict Validation (Prevent double booking of a single service)
    if (serviceId && bookingDate && bookingTime) {
      const existingBooking = await Booking.findOne({
        serviceId,
        bookingDate,
        bookingTime,
        bookingStatus: { $nin: ["Cancelled", "Rejected"] }
      });

      if (existingBooking) {
        return next(new AppError("This service is unavailable on selected date and time", 400));
      }
    }

    // 2. Event Capacity Validation
    if (eventId && bookingDate) {
      const Event = require("../models/Event").Event;
      const event = await Event.findById(eventId);
      
      if (!event) {
        return next(new AppError("Event not found", 404));
      }

      // Find all active bookings for this event on this date
      const activeBookings = await Booking.find({
        eventId,
        bookingDate,
        bookingStatus: { $nin: ["Cancelled", "Rejected"] }
      });

      // Sum up the guests
      const totalGuestsBooked = activeBookings.reduce((sum, b) => sum + (b.guests || 0), 0);
      const requestedGuests = guests || 0;

      if (totalGuestsBooked + requestedGuests > event.capacity) {
        return next(new AppError(`Capacity full. Only ${event.capacity - totalGuestsBooked} spots remaining.`, 400));
      }
    }

    // Inject userId from protected route middleware
    const bookingData = {
      ...req.body,
      userId: req.user?._id,
    };

    const booking = await Booking.create(bookingData);

    // Notify all admins
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        type: "booking_created",
        title: "New Booking Received",
        message: `A new booking has been created by ${booking.customerName}.`,
        link: `/admin/bookings/${booking._id}`
      });
    }

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
    const bookings = await Booking.find()
      .populate("userId", "firstName lastName email")
      .populate("serviceId", "title")
      .populate("eventId", "title")
      .sort("-createdAt");

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

    // Notify the customer about status change
    let notificationTitle = "Booking Updated";
    let notificationMessage = `Your booking status has been updated to ${bookingStatus}.`;
    
    if (bookingStatus === "Confirmed") {
      notificationTitle = "Booking Approved";
      notificationMessage = `Great news! Your booking for ${booking.serviceType} has been approved.`;
    } else if (bookingStatus === "Rejected") {
      notificationTitle = "Booking Rejected";
      notificationMessage = `Unfortunately, your booking for ${booking.serviceType} could not be approved.`;
    }

    await Notification.create({
      recipient: booking.userId,
      type: "system_alert",
      title: notificationTitle,
      message: notificationMessage,
      link: `/dashboard/bookings/${booking._id}`
    });

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
    const Query = require("../models/Query").Query;

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ bookingStatus: "Pending" });
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: "Confirmed" });
    const completedBookings = await Booking.countDocuments({ bookingStatus: "Completed" });
    const cancelledBookings = await Booking.countDocuments({ bookingStatus: "Cancelled" });
    const pendingPayments = await Booking.countDocuments({ paymentStatus: "Payment Pending" });
    const pendingQueries = await Query.countDocuments({ status: "Open" });
    
    // Today's Bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaysBookings = await Booking.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Upcoming Bookings (Confirmed but date is in the future)
    const upcomingBookings = await Booking.countDocuments({
      bookingStatus: "Confirmed",
      bookingDate: { $gte: today }
    });
    
    const Visitor = require("../models/Visitor").Visitor;
    const websiteVisitors = await Visitor.countDocuments();

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
          todaysBookings,
          upcomingBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          cancelledBookings,
          pendingPayments,
          pendingQueries,
          totalRevenue,
          totalCustomers,
          websiteVisitors
        }
      },
    });
  } catch (error) {
    next(error);
  }
};
