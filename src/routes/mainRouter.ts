import express from "express";
import navigation from "../controllers/navigation";
import auth from "../controllers/auth";
import passport from "passport";

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

// Check if tokens are valid
router.get(
  "/verify-token",
  passport.authenticate("jwt", { session: false }),
  auth.verifyToken
);
router.get("/info", navigation.info);

export default router;
