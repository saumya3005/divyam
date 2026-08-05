"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookingsAdmin = exports.getAllUsers = exports.getAdminStats = void 0;
const Booking_1 = require("../models/Booking");
const User_1 = require("../models/User");
const Service_1 = require("../models/Service");
// GET /api/v1/admin/stats
const getAdminStats = async (req, res, next) => {
    try {
        const totalBookings = await Booking_1.Booking.countDocuments();
        const pendingBookings = await Booking_1.Booking.countDocuments({ bookingStatus: "Pending" });
        const confirmedBookings = await Booking_1.Booking.countDocuments({ bookingStatus: "Confirmed" });
        const completedBookings = await Booking_1.Booking.countDocuments({ bookingStatus: "Completed" });
        const rejectedBookings = await Booking_1.Booking.countDocuments({ bookingStatus: "Rejected" });
        const revenueAgg = await Booking_1.Booking.aggregate([
            { $match: { paymentStatus: "Payment Successful" } },
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;
        const totalUsers = await User_1.User.countDocuments({ role: { $ne: "admin" } });
        const totalServices = await Service_1.Service.countDocuments();
        // Recent bookings (last 10)
        const recentBookings = await Booking_1.Booking.find()
            .populate("userId", "firstName lastName email")
            .populate("serviceId", "title category price")
            .sort("-createdAt")
            .limit(10);
        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalBookings,
                    pendingBookings,
                    confirmedBookings,
                    completedBookings,
                    rejectedBookings,
                    totalRevenue,
                    totalUsers,
                    totalServices,
                },
                recentBookings,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminStats = getAdminStats;
// GET /api/v1/admin/users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User_1.User.find({ role: { $ne: "admin" } }).sort("-createdAt");
        res.status(200).json({
            success: true,
            count: users.length,
            data: { users },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
// GET /api/v1/admin/bookings
const getAllBookingsAdmin = async (req, res, next) => {
    try {
        const bookings = await Booking_1.Booking.find()
            .populate("userId", "firstName lastName email phone")
            .populate("serviceId", "title category price")
            .sort("-createdAt");
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
exports.getAllBookingsAdmin = getAllBookingsAdmin;
