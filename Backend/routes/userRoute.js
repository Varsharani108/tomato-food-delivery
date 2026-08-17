import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

// Register user
userRouter.post("/register", registerUser);

// Login user
userRouter.post("/login", loginUser);

// Get user profile
userRouter.get("/profile", authMiddleware, getUserProfile);

export default userRouter;