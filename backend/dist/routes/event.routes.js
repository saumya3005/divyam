"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const event_controller_1 = require("../controllers/event.controller");
const router = express_1.default.Router();
// Publicly available
router.get("/published", event_controller_1.getPublishedEvents);
// Need to be logged in to view a specific event (Customer/Admin)
router.get("/:id", auth_middleware_1.protect, event_controller_1.getEvent);
// Admin only routes
router.use(auth_middleware_1.protect, (0, role_middleware_1.restrictTo)("admin"));
router.get("/", event_controller_1.getAllEvents);
router.post("/", event_controller_1.createEvent);
router.patch("/:id", event_controller_1.updateEvent);
router.delete("/:id", event_controller_1.deleteEvent);
exports.default = router;
