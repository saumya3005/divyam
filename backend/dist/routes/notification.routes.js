"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const notification_controller_1 = require("../controllers/notification.controller");
const router = express_1.default.Router();
// All notification routes are protected
router.use(auth_middleware_1.protect);
router.get("/", notification_controller_1.getMyNotifications);
router.patch("/read-all", notification_controller_1.markAllAsRead);
router.patch("/:id/read", notification_controller_1.markAsRead);
router.delete("/:id", notification_controller_1.deleteNotification);
exports.default = router;
