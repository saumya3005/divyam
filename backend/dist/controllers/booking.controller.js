"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingStats = exports.deleteBooking = exports.updateBooking = exports.updateBookingStatus = exports.getBooking = exports.getAllBookings = exports.getMyBookings = exports.createBooking = void 0;
const Booking_1 = require("../models/Booking");
const Notification_1 = require("../models/Notification");
const User_1 = require("../models/User");
const AppError_1 = require("../utils/AppError");
// Create a new booking
const createBooking = async (req, res, next) => {
    try {
        const { serviceId, eventId, bookingDate, bookingTime, guests } = req.body;
        // 1. Service Conflict Validation (Prevent double booking of a single service)
        if (serviceId && bookingDate && bookingTime) {
            const existingBooking = await Booking_1.Booking.findOne({
                serviceId,
                bookingDate,
                bookingTime,
                bookingStatus: { $nin: ["Cancelled", "Rejected"] }
            });
            if (existingBooking) {
                return next(new AppError_1.AppError("This service is unavailable on selected date and time", 400));
            }
        }
        // 2. Event Capacity Validation
        if (eventId && bookingDate) {
            const Event = require("../models/Event").Event;
            const event = await Event.findById(eventId);
            if (!event) {
                return next(new AppError_1.AppError("Event not found", 404));
            }
            // Find all active bookings for this event on this date
            const activeBookings = await Booking_1.Booking.find({
                eventId,
                bookingDate,
                bookingStatus: { $nin: ["Cancelled", "Rejected"] }
            });
            // Sum up the guests
            const totalGuestsBooked = activeBookings.reduce((sum, b) => sum + (b.guests || 0), 0);
            const requestedGuests = guests || 0;
            if (totalGuestsBooked + requestedGuests > event.capacity) {
                return next(new AppError_1.AppError(`Capacity full. Only ${event.capacity - totalGuestsBooked} spots remaining.`, 400));
            }
        }
        const bookingId = "BKG-" + Math.floor(100000 + Math.random() * 900000);
        const advanceAmount = req.body.advanceAmount || 0;
        const amount = req.body.amount || 0;
        const remainingAmount = amount - advanceAmount;
        // Inject userId from protected route middleware
        const bookingData = {
            ...req.body,
            bookingId,
            advanceAmount,
            remainingAmount,
            userId: req.user?._id,
            createdBy: req.user?._id,
        };
        const booking = await Booking_1.Booking.create(bookingData);
        // Notify all admins
        const admins = await User_1.User.find({ role: "admin" });
        for (const admin of admins) {
            await Notification_1.Notification.create({
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
        const { search, status, paymentStatus, serviceId, eventType } = req.query;
        let query = { isDeleted: { $ne: true } };
        if (status)
            query.bookingStatus = status;
        if (paymentStatus)
            query.paymentStatus = paymentStatus;
        if (serviceId)
            query.serviceId = serviceId;
        if (eventType)
            query.serviceType = eventType;
        if (search) {
            query.$or = [
                { bookingId: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } }
            ];
        }
        const bookings = await Booking_1.Booking.find(query)
            .populate("userId", "firstName lastName email")
            .populate("serviceId", "title")
            .populate("eventId", "title")
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
exports.getAllBookings = getAllBookings;
// Get single booking
const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking_1.Booking.findById(req.params.id);
        if (!booking) {
            return next(new AppError_1.AppError("No booking found with that ID", 404));
        }
        // Security check: Only admin or the booking owner can view it
        if (req.user?.role !== "admin" && booking.userId && booking.userId.toString() !== req.user?._id.toString()) {
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
        // Notify the customer about status change
        let notificationTitle = "Booking Updated";
        let notificationMessage = `Your booking status has been updated to ${bookingStatus}.`;
        if (bookingStatus === "Confirmed") {
            notificationTitle = "Booking Approved";
            notificationMessage = `Great news! Your booking for ${booking.serviceType} has been approved.`;
        }
        else if (bookingStatus === "Rejected") {
            notificationTitle = "Booking Rejected";
            notificationMessage = `Unfortunately, your booking for ${booking.serviceType} could not be approved.`;
        }
        await Notification_1.Notification.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateBookingStatus = updateBookingStatus;
// Update full booking (Admin)
const updateBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (req.body.amount !== undefined && req.body.advanceAmount !== undefined) {
            req.body.remainingAmount = req.body.amount - req.body.advanceAmount;
        }
        const booking = await Booking_1.Booking.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
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
exports.updateBooking = updateBooking;
// Delete booking (Admin)
const deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking_1.Booking.findByIdAndUpdate(req.params.id, { isDeleted: true });
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
        const Query = require("../models/Query").Query;
        const totalBookings = await Booking_1.Booking.countDocuments();
        const pendingBookings = await Booking_1.Booking.countDocuments({ bookingStatus: "Pending" });
        const confirmedBookings = await Booking_1.Booking.countDocuments({ bookingStatus: "Confirmed" });
        const completedBookings = await Booking_1.Booking.countDocuments({ bookingStatus: "Completed" });
        const cancelledBookings = await Booking_1.Booking.countDocuments({ bookingStatus: "Cancelled" });
        const pendingPayments = await Booking_1.Booking.countDocuments({ paymentStatus: "Payment Pending" });
        const pendingQueries = await Query.countDocuments({ status: "Open" });
        // Today's Bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todaysBookings = await Booking_1.Booking.countDocuments({
            createdAt: { $gte: today, $lt: tomorrow }
        });
        // Upcoming Bookings (Confirmed but date is in the future)
        const upcomingBookings = await Booking_1.Booking.countDocuments({
            bookingStatus: "Confirmed",
            bookingDate: { $gte: today }
        });
        const Visitor = require("../models/Visitor").Visitor;
        const websiteVisitors = await Visitor.countDocuments();
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
    }
    catch (error) {
        next(error);
    }
};
exports.getBookingStats = getBookingStats;
