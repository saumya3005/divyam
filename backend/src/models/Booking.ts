import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  bookingId: string;
  userId?: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  customerName: string;
  email: string;
  phone: string;
  serviceType: string;
  bookingDate: Date;
  bookingTime: string;
  guests: number;
  address: string;
  notes?: string;
  bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Rejected";
  paymentStatus: "Payment Pending" | "Payment Successful" | "Refunded";
  paymentId?: string;
  amount: number;
  advanceAmount: number;
  remainingAmount: number;
  createdBy?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    serviceType: {
      type: String,
      required: [true, "Service/Event type is required"],
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    bookingTime: {
      type: String,
      required: [true, "Booking time is required"],
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "Must have at least 1 guest"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    notes: String,
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Payment Pending", "Payment Successful", "Refunded"],
      default: "Payment Pending",
    },
    paymentId: String,
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    advanceAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
