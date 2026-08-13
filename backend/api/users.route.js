import express from "express";
import UsersCtrl from "./users.controller.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.route("/register").post(UsersCtrl.apiRegister);
router.route("/login").post(loginLimiter, UsersCtrl.apiLogin);

export default router;