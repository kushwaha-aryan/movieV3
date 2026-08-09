import express from "express";
import UsersCtrl from "./users.controller.js";

const router = express.Router();

router.route("/register").post(UsersCtrl.apiRegister);
router.route("/login").post(UsersCtrl.apiLogin);

export default router;