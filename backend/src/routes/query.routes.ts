import express from "express";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import {
  createQuery,
  getMyQueries,
  getAllQueries,
  replyToQuery,
} from "../controllers/query.controller";

const router = express.Router();

router.use(protect);

router.post("/", createQuery);
router.get("/my", getMyQueries);

router.use(restrictTo("admin"));
router.get("/", getAllQueries);
router.patch("/:id/reply", replyToQuery);

export default router;
