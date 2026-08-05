import { Router } from "express";
import authRoutes from "./auth.routes";
import bookingRoutes from "./booking.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);
// router.use("/customers", customerRoutes);
// router.use("/events", eventRoutes);

export default router;
