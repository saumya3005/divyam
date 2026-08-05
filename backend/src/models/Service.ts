import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  duration: string;
  availability: boolean;
  location: string;
  features: string[];
  maxGuests: number;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Wedding",
        "Corporate",
        "Birthday",
        "Photography",
        "Decoration",
        "Catering",
        "Concert",
        "Exhibition",
      ],
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    features: {
      type: [String],
      default: [],
    },
    maxGuests: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model<IService>("Service", serviceSchema);
