import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId; // User ID
  type: "booking_created" | "payment_received" | "system_alert" | "task_assigned";
  title: string;
  message: string;
  isRead: boolean;
  link?: string; // Optional deep link to related resource
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
    },
    type: {
      type: String,
      enum: ["booking_created", "payment_received", "system_alert", "task_assigned"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: String,
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
