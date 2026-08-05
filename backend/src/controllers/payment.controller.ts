import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Booking } from "../models/Booking";
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

    if (booking.userId.toString() !== req.user?._id.toString()) {
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

    // MOCK MODE: Bypass signature verification
    if (mock) {
      booking.paymentStatus = "Payment Successful";
      booking.paymentId = `pay_mock_${Date.now()}`;
      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Mock Payment verified successfully",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return next(new AppError("Razorpay secret not configured", 500));
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      booking.paymentStatus = "Payment Successful";
      booking.paymentId = razorpay_payment_id;
      await booking.save();

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return next(new AppError("Invalid payment signature", 400));
    }
  } catch (error) {
    next(error);
  }
};
