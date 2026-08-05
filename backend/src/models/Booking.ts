import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  attendees: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalPrice: number;
  paymentStatus: "unpaid" | "partial" | "paid" | "refunded";
  specialRequests?: string;
  assignedStaff?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Booking must belong to a customer"],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Booking must be linked to an event"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    attendees: {
      type: Number,
      required: [true, "Number of attendees is required"],
      min: [1, "Must have at least 1 attendee"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid", "refunded"],
      default: "unpaid",
    },
    specialRequests: String,
    assignedStaff: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
