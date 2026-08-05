import { Router } from "express";
import * as customerController from "../controllers/customer.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";

const router = Router();

// All customer routes are admin-only
router.use(protect, restrictTo("admin"));

router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomer);
router.post("/", customerController.createCustomer);
router.patch("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

export default router;
