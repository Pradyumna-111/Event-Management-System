import express from "express";
import { loginUser } from "../controllers/authController.js";
import { registerUser } from "../controllers/authController.js";
const router = express.Router();

// POST /api/auth/login
router.post("/login", loginUser);
router.post("/register", registerUser);
export default router;
