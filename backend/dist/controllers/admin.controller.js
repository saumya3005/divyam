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
        // Chart Data: Revenue by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        const revenueByMonth = await Booking_1.Booking.aggregate([
            {
                $match: {
                    paymentStatus: "Payment Successful",
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    revenue: { $sum: "$amount" },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        const formattedRevenueChart = revenueByMonth.map(item => {
            const date = new Date(item._id.year, item._id.month - 1, 1);
            return {
                name: date.toLocaleString('default', { month: 'short' }),
                revenue: item.revenue,
                bookings: item.bookings
            };
        });
        const bookingsByStatus = [
            { name: 'Pending', value: pendingBookings },
            { name: 'Confirmed', value: confirmedBookings },
            { name: 'Completed', value: completedBookings },
            { name: 'Rejected', value: rejectedBookings },
        ];
        // Top services by revenue
        const topServices = await Booking_1.Booking.aggregate([
            { $match: { paymentStatus: "Payment Successful" } },
            { $group: { _id: "$serviceId", revenue: { $sum: "$amount" }, bookings: { $sum: 1 } } },
            { $lookup: { from: "services", localField: "_id", foreignField: "_id", as: "serviceDetails" } },
            { $unwind: "$serviceDetails" },
            { $project: { name: "$serviceDetails.title", revenue: 1, bookings: 1 } },
            { $sort: { revenue: -1 } },
            { $limit: 4 }
        ]);
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
                    revenueChart: formattedRevenueChart,
                    statusChart: bookingsByStatus,
                    topServices,
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
