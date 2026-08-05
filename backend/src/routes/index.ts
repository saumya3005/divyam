import { Router } from "express";
import authRoutes from "./auth.routes";
import bookingRoutes from "./booking.routes";
import serviceRoutes from "./service.routes";
import adminRoutes from "./admin.routes";
import paymentRoutes from "./payment.routes";

import extraRoutes from "./extra.routes";
import eventRoutes from "./event.routes";
import inventoryRoutes from "./inventory.routes";
import customerRoutes from "./customer.routes";
import employeeRoutes from "./employee.routes";
import reviewRoutes from "./review.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);
router.use("/services", serviceRoutes);
router.use("/admin", adminRoutes);
router.use("/payment", paymentRoutes);
router.use("/events", eventRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/customers", customerRoutes);
router.use("/employees", employeeRoutes);
router.use("/reviews", reviewRoutes);
router.use("/extra", extraRoutes);

export default router;
