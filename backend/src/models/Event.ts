import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  eventType: "conference" | "wedding" | "corporate" | "party" | "other";
  capacity: number;
  basePrice: number;
  amenities: string[];
  status: "draft" | "published" | "archived";
  coverImage?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    eventType: {
      type: String,
      enum: ["conference", "wedding", "corporate", "party", "other"],
      required: [true, "Event type is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"],
    },
    amenities: [String],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    coverImage: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model<IEvent>("Event", eventSchema);
