import express from "express";
import { trackVisitor } from "../controllers/visitor.controller";

const router = express.Router();

router.post("/track", trackVisitor);

export default router;
