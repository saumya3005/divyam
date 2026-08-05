import mongoose, { Document, Schema } from "mongoose";

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  department: string;
  phone: string;
  email: string;
  salary: number;
  role: string;
  joiningDate: Date;
  status: "Active" | "On Leave" | "Terminated";
  emergencyContact?: string;
  address?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    department: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salary: { type: Number, required: true },
    role: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    status: { type: String, enum: ["Active", "On Leave", "Terminated"], default: "Active" },
    emergencyContact: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);
