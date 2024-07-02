import express from "express";
import navigation from "../controllers/navigation";
import auth from "../controllers/auth";
const router = express.Router();

// Pages
router.get("/", navigation.home);
router.get("/signup", navigation.signup);

// SignUp API
router.post("/signup", auth.signup);

export default router;
