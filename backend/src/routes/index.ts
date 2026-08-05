import { Router } from "express";
import authRoutes from "./auth.routes";
import bookingRoutes from "./booking.routes";
import serviceRoutes from "./service.routes";
import adminRoutes from "./admin.routes";
import paymentRoutes from "./payment.routes";

import extraRoutes from "./extra.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);
router.use("/services", serviceRoutes);
router.use("/admin", adminRoutes);
router.use("/payment", paymentRoutes);
router.use("/extra", extraRoutes);

export default router;
