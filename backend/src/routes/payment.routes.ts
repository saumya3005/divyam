import { Router } from "express";
import { z } from "zod";
import * as paymentController from "../controllers/payment.controller";
import { validate } from "../middleware/validate.middleware";
import { protect } from "../middleware/auth.middleware";

const router = Router();

const createOrderSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    bookingId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid booking ID"),
  }),
});

const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string().optional(),
    razorpay_signature: z.string().optional(),
    bookingId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid booking ID"),
    mock: z.boolean().optional(),
  }),
});

router.use(protect);

router.post("/create-order", validate(createOrderSchema), paymentController.createOrder);
router.post("/verify", validate(verifyPaymentSchema), paymentController.verifyPayment);

export default router;
