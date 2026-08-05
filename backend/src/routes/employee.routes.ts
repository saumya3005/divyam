import { Router } from "express";
import * as employeeController from "../controllers/employee.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";

const router = Router();

// All employee routes are admin-only
router.use(protect, restrictTo("admin"));

router.get("/", employeeController.getAllEmployees);
router.get("/:id", employeeController.getEmployee);
router.post("/", employeeController.createEmployee);
router.patch("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

export default router;
