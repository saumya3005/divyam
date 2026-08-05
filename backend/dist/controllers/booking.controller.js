"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingStats = exports.deleteBooking = exports.updateBookingStatus = exports.getBooking = exports.getAllBookings = exports.getMyBookings = exports.createBooking = void 0;
const Booking_1 = require("../models/Booking");
const AppError_1 = require("../utils/AppError");
// Create a new booking
const createBooking = async (req, res, next) => {
    try {
        // Inject userId from protected route middleware
        const bookingData = {
            ...req.body,
            userId: req.user?._id,
        };
        const booking = await Booking_1.Booking.create(bookingData);
        res.status(201).json({
            success: true,
            data: { booking },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createBooking = createBooking;
// Get user bookings
const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking_1.Booking.find({ userId: req.user?._id }).sort("-createdAt");
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: { bookings },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyBookings = getMyBookings;
// Get all bookings (Admin)
const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking_1.Booking.find().populate("userId", "firstName lastName email").sort("-createdAt");
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: { bookings },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBookings = getAllBookings;
// Get single booking
const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking_1.Booking.findById(req.params.id);
        if (!booking) {
            return next(new AppError_1.AppError("No booking found with that ID", 404));
        }
        // Security check: Only admin or the booking owner can view it
        if (req.user?.role !== "admin" && booking.userId.toString() !== req.user?._id.toString()) {
            return next(new AppError_1.AppError("You do not have permission to view this booking", 403));
        }
        res.status(200).json({
            success: true,
            data: { booking },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getBooking = getBooking;
// Update booking status (Admin)
const updateBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { bookingStatus } = req.body;
        const booking = await Booking_1.Booking.findByIdAndUpdate(id, { bookingStatus }, { new: true, runValidators: true });
        if (!booking) {
            return next(new AppError_1.AppError("No booking found with that ID", 404));
        }
        res.status(200).json({
            success: true,
            data: { booking },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBookingStatus = updateBookingStatus;
// Delete booking (Admin)
const deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking_1.Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return next(new AppError_1.AppError("No booking found with that ID", 404));
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
exports.deleteBooking = deleteBooking;
// Get booking stats (Admin)
const getBookingStats = async (req, res, next) => {
    try {
        const totalBookings = await Booking_1.Booking.countDocuments();
        const pendingBookings = await Booking_1.Booking.countDocuments({ bookingStatus: "Pending" });
        const confirmedBookings = await Booking_1.Booking.countDocuments({ bookingStatus: "Confirmed" });
        const completedBookings = await Booking_1.Booking.countDocuments({ bookingStatus: "Completed" });
        const revenueAgg = await Booking_1.Booking.aggregate([
            { $match: { paymentStatus: "Payment Successful" } },
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;
        const customersAgg = await Booking_1.Booking.aggregate([
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
    }
    catch (error) {
        next(error);
    }
};
exports.getBookingStats = getBookingStats;
