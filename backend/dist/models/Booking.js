"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    bookingId: {
        type: String,
        unique: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    serviceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Service",
    },
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Event",
    },
    customerName: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
    },
    serviceType: {
        type: String,
        required: [true, "Service/Event type is required"],
    },
    bookingDate: {
        type: Date,
        required: [true, "Booking date is required"],
    },
    bookingTime: {
        type: String,
        required: [true, "Booking time is required"],
    },
    guests: {
        type: Number,
        required: [true, "Number of guests is required"],
        min: [1, "Must have at least 1 guest"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    notes: String,
    bookingStatus: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"],
        default: "Pending",
    },
    paymentStatus: {
        type: String,
        enum: ["Payment Pending", "Payment Successful", "Refunded"],
        default: "Payment Pending",
    },
    paymentId: String,
    amount: {
        type: Number,
        required: [true, "Amount is required"],
    },
    advanceAmount: {
        type: Number,
        default: 0,
    },
    remainingAmount: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});
exports.Booking = mongoose_1.default.model("Booking", bookingSchema);
