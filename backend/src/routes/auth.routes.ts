import { Router } from "express";
import { z } from "zod";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// Validation Schemas
const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

// Routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", protect, authController.getMe);

export default router;
