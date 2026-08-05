import mongoose, { Document, Schema } from "mongoose";

export interface IApproval extends Document {
  type: string;
  requesterName: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const approvalSchema = new Schema<IApproval>(
  {
    type: { type: String, required: true },
    requesterName: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export const Approval = mongoose.model<IApproval>("Approval", approvalSchema);
