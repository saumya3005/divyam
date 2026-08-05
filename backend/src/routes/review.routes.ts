import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";

const router = Router();

// Public routes (if any, like getting approved reviews for a service)
// router.get("/public", getPublicReviews);

// All routes below are protected
router.use(protect);
router.use(restrictTo("admin"));

router.route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);

router.route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
