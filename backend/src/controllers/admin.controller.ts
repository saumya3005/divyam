import { Request, Response, NextFunction } from "express";
import { Booking } from "../models/Booking";
import { User } from "../models/User";
import { Service } from "../models/Service";

// GET /api/v1/admin/stats
export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ bookingStatus: "Pending" });
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: "Confirmed" });
    const completedBookings = await Booking.countDocuments({ bookingStatus: "Completed" });
    const rejectedBookings = await Booking.countDocuments({ bookingStatus: "Rejected" });

    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: "Payment Successful" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalServices = await Service.countDocuments();

    // Chart Data: Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const revenueByMonth = await Booking.aggregate([
      { 
        $match: { 
          paymentStatus: "Payment Successful",
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formattedRevenueChart = revenueByMonth.map(item => {
      const date = new Date(item._id.year, item._id.month - 1, 1);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        revenue: item.revenue
      };
    });

    const bookingsByStatus = [
      { name: 'Pending', value: pendingBookings },
      { name: 'Confirmed', value: confirmedBookings },
      { name: 'Completed', value: completedBookings },
      { name: 'Rejected', value: rejectedBookings },
    ];

    // Recent bookings (last 10)
    const recentBookings = await Booking.find()
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
          statusChart: bookingsByStatus
        },
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/bookings
export const getAllBookingsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "firstName lastName email phone")
      .populate("serviceId", "title category price")
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
