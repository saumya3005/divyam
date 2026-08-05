import mongoose, { Document, Schema } from "mongoose";

export interface IInventory extends Document {
  name: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  maintenanceStatus: "Good" | "Needs Repair" | "In Maintenance";
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    availableQuantity: { type: Number, required: true, min: 0 },
    maintenanceStatus: { type: String, enum: ["Good", "Needs Repair", "In Maintenance"], default: "Good" },
  },
  { timestamps: true }
);

export const Inventory = mongoose.model<IInventory>("Inventory", inventorySchema);
