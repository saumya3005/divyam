"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const query_controller_1 = require("../controllers/query.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
router.post("/", query_controller_1.createQuery);
router.get("/my", query_controller_1.getMyQueries);
router.use((0, role_middleware_1.restrictTo)("admin"));
router.get("/", query_controller_1.getAllQueries);
router.patch("/:id/reply", query_controller_1.replyToQuery);
exports.default = router;
