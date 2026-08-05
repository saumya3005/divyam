import mongoose, { Document, Schema } from "mongoose";

export interface IVisitor extends Document {
  sessionId: string;
  path: string;
  timestamp: Date;
}

const visitorSchema = new Schema<IVisitor>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    path: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 30, // Auto-delete after 30 days
    },
  },
  {
    timestamps: true,
  }
);

// We want to track unique visitors per session, not every single page load
visitorSchema.index({ sessionId: 1 }, { unique: true });

export const Visitor = mongoose.model<IVisitor>("Visitor", visitorSchema);
