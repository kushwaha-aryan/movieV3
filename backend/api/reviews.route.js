import express from "express";
import ReviewsCtrl from "./reviews.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/movie/:id").get(ReviewsCtrl.apiGetReviews)
router.route("/new").post(auth, ReviewsCtrl.apiPostReview)
router.route("/:id")
    .get(ReviewsCtrl.apiGetReview)
    .put(auth, ReviewsCtrl.apiUpdateReview)
    .delete(auth, ReviewsCtrl.apiDeleteReview)

export default router;