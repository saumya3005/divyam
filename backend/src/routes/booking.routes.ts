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
    customerName: z.string().min(2, "Customer name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(10, "Phone number is required"),
    serviceType: z.string().min(1, "Service type is required"),
    bookingDate: z.string().datetime().or(z.string().min(10)), // flexible date
    bookingTime: z.string().min(4, "Time is required"),
    guests: z.number().int().positive(),
    address: z.string().min(5, "Address is required"),
    notes: z.string().optional(),
    amount: z.number().positive(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    bookingStatus: z.enum(["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"]),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid booking ID"),
  }),
});

// All booking routes are protected
router.use(protect);

router
  .route("/")
  .get(restrictTo("admin"), bookingController.getAllBookings)
  .post(validate(createBookingSchema), bookingController.createBooking);

router
  .route("/stats")
  .get(restrictTo("admin"), bookingController.getBookingStats);

router
  .route("/my")
  .get(bookingController.getMyBookings);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .delete(restrictTo("admin"), bookingController.deleteBooking);

router
  .route("/:id/status")
  .patch(validate(updateStatusSchema), restrictTo("admin", "manager"), bookingController.updateBookingStatus);

export default router;
