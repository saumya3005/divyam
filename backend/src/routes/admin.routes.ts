import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";

const router = Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo("admin"));

router.get("/stats", adminController.getAdminStats);
router.get("/users", adminController.getAllUsers);
router.get("/bookings", adminController.getAllBookingsAdmin);

export default router;
