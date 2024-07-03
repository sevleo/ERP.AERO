import express from "express";
import navigation from "../controllers/navigation";
import auth from "../controllers/auth";
import passport from "passport";

const router = express.Router();

// Page views
router.get("/", navigation.home);
router.get("/signup", navigation.signup);

// SignUp API
router.post("/signup", auth.signup);

// SignIn API
router.post("/signin", auth.signin);

// Lougout API
router.post("/logout", auth.logout);

// Refresh Token API
router.post("/signin/new_token", auth.refreshToken);

// Verify Token API
router.get(
  "/verify-token",
  passport.authenticate("jwt", { session: false }),
  auth.verifyToken
);

export default router;
