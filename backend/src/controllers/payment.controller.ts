import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Booking } from "../models/Booking";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import { Payment } from "../models/Payment";
import { AppError } from "../utils/AppError";

// Razorpay Instance
let razorpay: any = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (error) {
  console.warn("Razorpay credentials missing or invalid.");
}

// Create Razorpay Order
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new AppError("Booking not found", 404));
    }

    if (booking.userId && booking.userId.toString() !== req.user?._id.toString()) {
      return next(new AppError("You can only pay for your own bookings", 403));
    }

    // MOCK MODE: If Razorpay keys are missing, return a mock order
    if (!razorpay) {
      return res.status(200).json({
        success: true,
        data: {
          order: {
            id: `order_mock_${Date.now()}`,
            amount: amount * 100, // Razorpay takes amount in paise
            currency: "INR",
          },
          mock: true
        },
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: bookingId,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(new AppError("Failed to create payment order", 500));
  }
};

// Verify Razorpay Payment
export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      mock
    } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new AppError("Booking not found", 404));
    }

    // Helper function for notifications
    const createPaymentNotifications = async (bookingDoc: any) => {
      // Notify customer
      await Notification.create({
        recipient: bookingDoc.userId,
        type: "payment_received",
        title: "Payment Successful",
        message: `Your payment for booking ${bookingDoc.serviceType} was successful.`,
        link: `/dashboard/bookings/${bookingDoc._id}`
      });

      // Notify admins
      const admins = await User.find({ role: "admin" });
      for (const admin of admins) {
        await Notification.create({
          recipient: admin._id,
          type: "payment_received",
          title: "New Payment",
          message: `Payment received for booking ${bookingDoc.serviceType}.`,
          link: `/admin/bookings/${bookingDoc._id}`
        });
      }
    };

    if (mock) {
      booking.paymentStatus = "Payment Successful";
      await booking.save();
      await createPaymentNotifications(booking);
      
      // CREATE PAYMENT RECORD
      await Payment.create({
        bookingId: booking._id,
        userId: booking.userId,
        amount: booking.amount,
        status: "Completed",
        paymentMethod: "Mock",
        transactionId: `mock_tx_${Date.now()}`
      });

      return res.status(200).json({ success: true, data: { booking } });
    }

    if (!razorpay) {
      return next(new AppError("Payment verification failed", 500));
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      booking.paymentStatus = "Payment Successful";
      await booking.save();
      await createPaymentNotifications(booking);

      // CREATE PAYMENT RECORD
      await Payment.create({
        bookingId: booking._id,
        userId: booking.userId,
        amount: booking.amount,
        status: "Completed",
        paymentMethod: "Razorpay",
        transactionId: razorpay_payment_id
      });

      res.status(200).json({ success: true, data: { booking } });
    } else {
      // Create Failed payment record
      await Payment.create({
        bookingId: booking._id,
        userId: booking.userId,
        amount: booking.amount,
        status: "Failed",
        paymentMethod: "Razorpay",
        transactionId: razorpay_payment_id
      });
      next(new AppError("Invalid payment signature", 400));
    }
  } catch (error) {
    next(error);
  }
};

// Admin: Get all payments
export const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search } = req.query;
    const filter: any = { isDeleted: { $ne: true } };

    if (status) filter.status = status;
    
    // For search, we might want to populate user/booking but let's keep it simple
    // Maybe search by transactionId
    if (search) {
      filter.transactionId = { $regex: search as string, $options: "i" };
    }

    const payments = await Payment.find(filter)
      .populate("userId", "name email")
      .populate("bookingId", "serviceType bookingDate")
      .sort("-createdAt");

    res.status(200).json({ success: true, count: payments.length, data: { payments } });
  } catch (error) {
    next(error);
  }
};

// Admin: Get single payment
export const getPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, isDeleted: { $ne: true } })
      .populate("userId", "name email")
      .populate("bookingId");
      
    if (!payment) return next(new AppError("Payment not found", 404));
    res.status(200).json({ success: true, data: { payment } });
  } catch (error) {
    next(error);
  }
};

// Admin: Update Payment
export const updatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!payment) return next(new AppError("Payment not found", 404));
    res.status(200).json({ success: true, data: { payment } });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete Payment (Soft delete)
export const deletePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!payment) return next(new AppError("Payment not found", 404));
    res.status(204).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};
