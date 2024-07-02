import express from "express";
import navigation from "../controllers/navigation";
import auth from "../controllers/auth";
import { verifyToken } from "../helpers/verifyToken";
const router = express.Router();

// Pages
router.get("/", navigation.home);
router.get("/signup", navigation.signup);

// SignUp
router.post("/signup", auth.signup);

// SignIn
router.post("/signin", auth.signin);

// Refresh Token API
router.post("/signin/new_token", auth.refreshToken);

// Protected routes

router.get("/info", verifyToken, (req, res) => {});

router.get("/latency", verifyToken, (req, res) => {});

router.get("/logout", verifyToken, (req, res) => {});

router.get("/file", verifyToken, (req, res) => {});
export default router;
