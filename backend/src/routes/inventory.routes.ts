import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";

const router = Router();

// All inventory routes are admin-only
router.use(protect, restrictTo("admin"));

router.get("/", inventoryController.getAllInventory);
router.get("/:id", inventoryController.getInventory);
router.post("/", inventoryController.createInventory);
router.patch("/:id", inventoryController.updateInventory);
router.delete("/:id", inventoryController.deleteInventory);

export default router;
