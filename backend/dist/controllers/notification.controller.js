"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getMyNotifications = void 0;
const Notification_1 = require("../models/Notification");
const AppError_1 = require("../utils/AppError");
// Get all notifications for logged in user
const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification_1.Notification.find({ recipient: req.user?._id }).sort("-createdAt");
        res.status(200).json({
            success: true,
            count: notifications.length,
            data: { notifications },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyNotifications = getMyNotifications;
// Mark a single notification as read
const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification_1.Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user?._id }, { isRead: true }, { new: true, runValidators: true });
        if (!notification) {
            return next(new AppError_1.AppError("Notification not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { notification },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.markAsRead = markAsRead;
// Mark all notifications as read
const markAllAsRead = async (req, res, next) => {
    try {
        await Notification_1.Notification.updateMany({ recipient: req.user?._id, isRead: false }, { isRead: true });
        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    }
    catch (error) {
        next(error);
    }
};
exports.markAllAsRead = markAllAsRead;
// Delete a notification
const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification_1.Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user?._id
        });
        if (!notification) {
            return next(new AppError_1.AppError("Notification not found", 404));
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
exports.deleteNotification = deleteNotification;
