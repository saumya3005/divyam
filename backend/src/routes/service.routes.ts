import { Router } from "express";
import * as serviceController from "../controllers/service.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";

const router = Router();

// Public routes
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getService);

// Admin-only routes
router.post("/", protect, restrictTo("admin"), serviceController.createService);
router.patch("/:id", protect, restrictTo("admin"), serviceController.updateService);
router.delete("/:id", protect, restrictTo("admin"), serviceController.deleteService);

export default router;
