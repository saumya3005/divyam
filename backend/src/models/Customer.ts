import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  companyName: string;
  contactPerson: mongoose.Types.ObjectId; // Reference to User if they log in
  email: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  industry?: string;
  status: "active" | "inactive" | "lead";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    contactPerson: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    email: {
      type: String,
      required: [true, "Contact email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Contact phone is required"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    industry: String,
    status: {
      type: String,
      enum: ["active", "inactive", "lead"],
      default: "lead",
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
