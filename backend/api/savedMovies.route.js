import express from "express";
import SavedMoviesCtrl from "./savedMovies.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/add").post(auth, SavedMoviesCtrl.apiAddSavedMovie);
router.route("/:movieId").delete(auth, SavedMoviesCtrl.apiRemoveSavedMovie);
router.route("/list/:type").get(auth, SavedMoviesCtrl.apiGetSavedMovies);

export default router;