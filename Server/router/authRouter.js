import express from "express";
import { forgetPassword, loginUser, logoutUser, registerUser, resetPassword } from "../controller/authController.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/register", registerUser);
// for binary image data we have use multer  upload.single('image') middleware
// router.post("/register", upload.single('image'), registerUser);
export default router;