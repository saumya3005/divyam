import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  serviceId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  customerName: string;
  status: "Published" | "Hidden";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Published", "Hidden"],
      default: "Published",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model<IReview>("Review", reviewSchema);
