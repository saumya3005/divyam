import { Router } from "express";
import { z } from "zod";
import * as bookingController from "../controllers/booking.controller";
import { validate } from "../middleware/validate.middleware";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";

const router = Router();

// Validation Schemas
const createBookingSchema = z.object({
  body: z.object({
    customer: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid customer ID"),
    event: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid event ID"),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    attendees: z.number().int().positive(),
    totalPrice: z.number().positive(),
    specialRequests: z.string().optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
    paymentStatus: z.enum(["unpaid", "partial", "paid", "refunded"]).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid booking ID"),
  }),
});

// All booking routes are protected
router.use(protect);

router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(validate(createBookingSchema), restrictTo("admin", "manager", "client"), bookingController.createBooking);

router
  .route("/:id/status")
  .patch(validate(updateStatusSchema), restrictTo("admin", "manager", "staff"), bookingController.updateBookingStatus);

export default router;
