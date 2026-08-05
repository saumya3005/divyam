import mongoose, { Document, Schema } from "mongoose";

export interface IQuery extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  message: string;
  status: "Open" | "Resolved";
  adminReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const querySchema = new Schema<IQuery>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Open", "Resolved"],
      default: "Open",
    },
    adminReply: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Query = mongoose.model<IQuery>("Query", querySchema);
