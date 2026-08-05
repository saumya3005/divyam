import express from "express";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import {
  getPublishedEvents,
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} from "../controllers/event.controller";

const router = express.Router();

// Publicly available
router.get("/published", getPublishedEvents);

// Need to be logged in to view a specific event (Customer/Admin)
router.get("/:id", protect, getEvent);

// Admin only routes
router.use(protect, restrictTo("admin"));
router.get("/", getAllEvents);
router.post("/", createEvent);
router.patch("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
