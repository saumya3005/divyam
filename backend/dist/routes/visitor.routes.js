"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const visitor_controller_1 = require("../controllers/visitor.controller");
const router = express_1.default.Router();
router.post("/track", visitor_controller_1.trackVisitor);
exports.default = router;
