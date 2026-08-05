import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: "Pending" | "Completed" | "Failed" | "Refunded";
  paymentMethod?: string;
  transactionId?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["Pending", "Completed", "Failed", "Refunded"], default: "Pending" },
    paymentMethod: { type: String },
    transactionId: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
