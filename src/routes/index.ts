import express from "express";
import { home, signup } from "../controllers/navigation";
const router = express.Router();

// Pages
router.get("/", home);
router.get("/sign-up", signup);

export default router;
